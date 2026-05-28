// services/responseParser.js
// ─────────────────────────────────────────────────────────
// Gemini almost always returns clean JSON — but not always.
// This file handles every known failure mode:
//
//   1. JSON wrapped in ```json ... ``` markdown fences
//   2. Explanation text before or after the JSON
//   3. Trailing commas (invalid JSON but common AI mistake)
//   4. Missing required fields (filled with defaults)
//   5. Wrong data types (e.g. atsScore as string "72")
//
// "Defensive parsing" — we assume Gemini might mess up
// and handle it gracefully instead of crashing.
// ─────────────────────────────────────────────────────────

/**
 * Takes raw Gemini text output and returns a clean,
 * validated analysis object ready to save to MongoDB.
 *
 * @param {string} rawOutput - Raw text from Gemini
 * @returns {object} - Validated analysis object
 */
export const parseGeminiResponse = (rawOutput) => {
  if (!rawOutput || typeof rawOutput !== "string") {
    throw new Error("Gemini returned an empty response.");
  }

  // ── Step 1: Extract JSON from the response ─────────────
  const jsonString = extractJSON(rawOutput);

  // ── Step 2: Parse the JSON string ─────────────────────
  let parsed;
  try {
    parsed = JSON.parse(jsonString);
  } catch (err) {
    // Try one more aggressive clean before giving up
    const aggressivelyCleaned = aggressiveJSONClean(jsonString);
    try {
      parsed = JSON.parse(aggressivelyCleaned);
    } catch {
      throw new Error(
        `Could not parse Gemini response as JSON. ` +
        `Raw output (first 300 chars): ${rawOutput.substring(0, 300)}`
      );
    }
  }

  // ── Step 3: Validate and normalize the structure ───────
  return normalizeAnalysis(parsed);
};

// ─────────────────────────────────────────────────────────
// HELPER: extractJSON
// Tries multiple strategies to pull valid JSON out of
// whatever string Gemini returned.
// ─────────────────────────────────────────────────────────
const extractJSON = (text) => {
  // Strategy 1: Strip markdown code fences
  // Handles: ```json { ... } ``` or ``` { ... } ```
  let cleaned = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  // Strategy 2: Find the first { and last } in the string
  // This handles cases where Gemini adds text before/after
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");

  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }

  return cleaned;
};

// ─────────────────────────────────────────────────────────
// HELPER: aggressiveJSONClean
// Last resort — fixes common AI JSON mistakes before
// trying to parse again.
// ─────────────────────────────────────────────────────────
const aggressiveJSONClean = (text) => {
  return (
    text
      // Remove trailing commas before } or ]
      // e.g.  ["item1", "item2",]  →  ["item1", "item2"]
      .replace(/,\s*([\]}])/g, "$1")
      // Fix single-quoted strings → double-quoted
      // e.g.  {'key': 'value'}  →  {"key": "value"}
      .replace(/'/g, '"')
      // Remove JavaScript-style comments (// and /* */)
      .replace(/\/\/[^\n]*/g, "")
      .replace(/\/\*[\s\S]*?\*\//g, "")
      // Remove ellipsis (...) that AI sometimes adds
      .replace(/\.\.\./g, "")
      .trim()
  );
};

// ─────────────────────────────────────────────────────────
// HELPER: normalizeAnalysis
// Takes a parsed JSON object and ensures every field:
//   - Exists (defaults if missing)
//   - Has the correct type (coerces if needed)
//   - Is within valid ranges
//   - Has the right array lengths
// ─────────────────────────────────────────────────────────
const normalizeAnalysis = (data) => {
  // ── ATS Score ──────────────────────────────────────────
  // Must be an integer 0–100
  let atsScore = parseInt(data.atsScore, 10);
  if (isNaN(atsScore)) atsScore = 50; // Default if missing
  atsScore = Math.max(0, Math.min(100, atsScore)); // Clamp to 0–100

  // ── ATS Breakdown ──────────────────────────────────────
  const breakdown = data.atsBreakdown || {};
  const atsBreakdown = {
    keywords:     clampInt(breakdown.keywords,     0, 30, 15),
    formatting:   clampInt(breakdown.formatting,   0, 25, 12),
    achievements: clampInt(breakdown.achievements, 0, 25, 12),
    completeness: clampInt(breakdown.completeness, 0, 20, 11),
  };
  // Recalculate total from breakdown to ensure consistency
  const calculatedTotal =
    atsBreakdown.keywords +
    atsBreakdown.formatting +
    atsBreakdown.achievements +
    atsBreakdown.completeness;
  // If atsScore from AI doesn't match sum, use calculated sum
  if (Math.abs(atsScore - calculatedTotal) > 5) {
    atsScore = calculatedTotal;
  }

  // ── Arrays: ensure they're arrays of strings ───────────
  const strengths          = toStringArray(data.strengths, 3);
  const weaknesses         = toStringArray(data.weaknesses, 3);
  const missingSkills      = toStringArray(data.missingSkills, 3);
  const interviewQuestions = toStringArray(data.interviewQuestions, 5, 5);
  const topRoles           = toStringArray(data.topRoles, 2, 3);

  // ── Career level ───────────────────────────────────────
  const validLevels = ["student", "entry", "mid", "senior", "lead", "executive"];
  const careerLevel = validLevels.includes(data.careerLevel)
    ? data.careerLevel
    : "mid"; // Default if missing or invalid

  // ── Summary ────────────────────────────────────────────
  const summary =
    typeof data.summary === "string" && data.summary.trim().length > 10
      ? data.summary.trim()
      : "Resume analyzed. Please review the detailed findings below.";

  return {
    summary,
    atsScore,
    atsBreakdown,
    strengths,
    weaknesses,
    missingSkills,
    interviewQuestions,
    careerLevel,
    topRoles,
  };
};

// ── Utility: clampInt ──────────────────────────────────
// Parses an integer and clamps it between min and max.
// Falls back to defaultVal if the input isn't a number.
const clampInt = (value, min, max, defaultVal) => {
  const n = parseInt(value, 10);
  if (isNaN(n)) return defaultVal;
  return Math.max(min, Math.min(max, n));
};

// ── Utility: toStringArray ─────────────────────────────
// Ensures a value is an array of non-empty strings.
// Fills with placeholder items if the array is too short.
// Trims to maxItems if too long.
const toStringArray = (value, minItems = 1, maxItems = 10) => {
  let arr = Array.isArray(value) ? value : [];

  // Filter: keep only non-empty strings
  arr = arr
    .filter((item) => item && typeof item === "string" && item.trim().length > 0)
    .map((item) => item.trim());

  // Pad if too short
  while (arr.length < minItems) {
    arr.push("See full analysis for details.");
  }

  // Trim if too long
  if (arr.length > maxItems) {
    arr = arr.slice(0, maxItems);
  }

  return arr;
};