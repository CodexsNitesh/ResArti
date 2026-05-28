// services/textPreprocessor.js
// ─────────────────────────────────────────────────────────
// PDF text extracted by pdf-parse is often messy:
//   - Multiple blank lines between sections
//   - Strange unicode characters
//   - Page numbers and headers repeated on every page
//   - Extra whitespace everywhere
//
// This module cleans all of that BEFORE we send to Gemini.
// Cleaner text = better AI analysis + fewer tokens used.
// ─────────────────────────────────────────────────────────

// Maximum characters to send to Gemini.
// A typical resume is 3,000–6,000 chars.
// We cap at 12,000 to handle multi-page CVs without
// exceeding token limits or slowing down the response.
const MAX_TEXT_LENGTH = 12000;

// Minimum characters — if less, the PDF was probably blank
// or a scanned image (no selectable text)
const MIN_TEXT_LENGTH = 150;

/**
 * Main export — takes raw pdf-parse output and returns
 * clean, trimmed text ready to send to Gemini.
 *
 * @param {string} rawText - Text directly from pdf-parse
 * @returns {{ text: string, metadata: object }}
 */
export const preprocessResumeText = (rawText) => {
  // ── Step 1: Basic validation ───────────────────────────
  if (!rawText || typeof rawText !== "string") {
    throw new Error("Invalid input: expected a non-empty string.");
  }

  let text = rawText;

  // ── Step 2: Normalize line endings ────────────────────
  // PDFs from Windows may use \r\n, Mac classic used \r
  // We normalize everything to \n
  text = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  // ── Step 3: Remove non-printable / junk characters ────
  // Some PDFs embed hidden control characters (form feeds,
  // null bytes, etc.) that confuse AI models
  // We keep: letters, numbers, punctuation, whitespace
  // \x20-\x7E = all printable ASCII
  // \u00C0-\u024F = common Latin extended (accented chars)
  // \n = newlines (we want to keep these)
  text = text.replace(/[^\x20-\x7E\u00C0-\u024F\n]/g, " ");

  // ── Step 4: Collapse excessive whitespace ─────────────
  // Replace 3+ consecutive newlines with exactly 2
  // This preserves section breaks without huge blank gaps
  text = text.replace(/\n{3,}/g, "\n\n");

  // Replace multiple spaces with a single space
  // (but NOT newlines — we handle those separately)
  text = text.replace(/[ \t]{2,}/g, " ");

  // ── Step 5: Remove common PDF artifacts ───────────────
  // Page numbers like "Page 1 of 3" or just "1" on their own line
  text = text.replace(/^page\s+\d+(\s+of\s+\d+)?$/gim, "");

  // Lines that are purely decorative (---, ===, ···)
  text = text.replace(/^[-=*_.~]{3,}\s*$/gm, "");

  // ── Step 6: Trim each line ────────────────────────────
  // Remove leading and trailing spaces from every line
  text = text
    .split("\n")
    .map((line) => line.trim())
    .join("\n");

  // ── Step 7: Final trim ────────────────────────────────
  text = text.trim();

  // ── Step 8: Check minimum length ──────────────────────
  if (text.length < MIN_TEXT_LENGTH) {
    throw new Error(
      `Resume text is too short (${text.length} characters). ` +
      `Minimum is ${MIN_TEXT_LENGTH}. ` +
      `If your resume is a scanned image, please export it as a text-based PDF.`
    );
  }

  // ── Step 9: Truncate if too long ──────────────────────
  // If the resume is extremely long (very detailed CV),
  // we take the first MAX_TEXT_LENGTH characters.
  // We cut at the last complete word to avoid mid-word cuts.
  let wasTruncated = false;
  if (text.length > MAX_TEXT_LENGTH) {
    const truncated = text.substring(0, MAX_TEXT_LENGTH);
    // Find the last space/newline to avoid cutting mid-word
    const lastBreak = Math.max(
      truncated.lastIndexOf(" "),
      truncated.lastIndexOf("\n")
    );
    text = truncated.substring(0, lastBreak > 0 ? lastBreak : MAX_TEXT_LENGTH);
    wasTruncated = true;
  }

  // ── Step 10: Collect metadata ─────────────────────────
  // We return some stats alongside the text. These are
  // logged by the controller and saved to MongoDB.
  const metadata = {
    originalLength: rawText.length,
    processedLength: text.length,
    wasTruncated,
    estimatedWordCount: text.split(/\s+/).filter(Boolean).length,
    // Rough estimate: 1 token ≈ 4 characters for English text
    estimatedTokens: Math.ceil(text.length / 4),
  };

  return { text, metadata };
};