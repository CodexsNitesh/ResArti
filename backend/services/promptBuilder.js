// // services/promptBuilder.js
// // ─────────────────────────────────────────────────────────
// // Prompt engineering is the art of writing instructions
// // that get AI to reliably output exactly what you need.
// //
// // Key techniques used here:
// //
// // 1. ROLE ASSIGNMENT
// //    "You are an expert HR recruiter..."
// //    → Gemini adopts that persona and uses its knowledge
// //
// // 2. EXPLICIT JSON SCHEMA
// //    We show the exact structure we want returned.
// //    → Reduces hallucination and format errors
// //
// // 3. STRICT RULES SECTION
// //    Numbered rules the AI must follow.
// //    → Prevents common failure modes
// //
// // 4. SCORING RUBRIC
// //    We tell Gemini exactly HOW to calculate the ATS score.
// //    → Makes scores consistent and meaningful
// //
// // 5. FEW-SHOT EXAMPLES (in the schema)
// //    We show example values for each field.
// //    → AI learns the tone and specificity we want
// // ─────────────────────────────────────────────────────────

// /**
//  * Builds the full prompt to send to Gemini.
//  * Separates system context from the user's resume text.
//  *
//  * @param {string} resumeText - Preprocessed resume text
//  * @returns {{ systemPrompt: string, userPrompt: string }}
//  */
// export const buildResumeAnalysisPrompt = (resumeText) => {
//   // ── System Prompt ──────────────────────────────────────
//   // This sets Gemini's PERSONA and RULES.
//   // It never changes regardless of which resume is analyzed.
//   const systemPrompt = `You are an expert HR recruiter, career coach, and ATS (Applicant Tracking System) specialist with 15+ years of experience across tech, finance, healthcare, and consulting industries.

// Your task is to analyze resumes and return a structured JSON evaluation. You are objective, constructive, and specific — you always reference actual content from the resume rather than giving generic advice.

// OUTPUT FORMAT:
// You must return ONLY a valid JSON object. No markdown, no code fences, no explanation text before or after. Start your response with { and end with }.

// REQUIRED JSON STRUCTURE:
// {
//   "summary": "string — 2 to 3 sentences. Cover: (1) candidate's current level/title, (2) their strongest qualification, (3) overall readiness. Example: 'Mid-level software engineer with 4 years of React and Node.js experience. Strong full-stack foundation evidenced by shipped products at two startups. Ready for senior roles but needs to demonstrate leadership and system design exposure.'",

//   "atsScore": "integer 0–100. Use the rubric below.",

//   "atsBreakdown": {
//     "keywords": "integer 0–30. Does the resume contain role-relevant technical keywords?",
//     "formatting": "integer 0–25. Is the structure clean, scannable, ATS-parseable (no tables, no columns)?",
//     "achievements": "integer 0–25. Are accomplishments quantified? (numbers, %, $, scale)",
//     "completeness": "integer 0–20. Are all key sections present: contact, summary, experience, education, skills?"
//   },

//   "strengths": [
//     "Specific strength referencing resume content — at least 3, maximum 6 items",
//     "Each item should be 1–2 sentences. Example: 'Led cross-functional team of 8 engineers to deliver a payment module 2 weeks ahead of schedule, demonstrating strong project leadership.'"
//   ],

//   "weaknesses": [
//     "Specific, actionable area for improvement — at least 3, maximum 5 items",
//     "Be honest but constructive. Example: 'Work experience bullets are responsibilities-focused rather than achievement-focused — rewrite using the STAR format to show impact.'"
//   ],

//   "missingSkills": [
//     "Skills commonly required for roles this candidate is targeting, but absent from resume",
//     "Only list skills genuinely missing — not skills the candidate likely has but didn't mention",
//     "Minimum 3 items. Example: 'Docker / containerization — expected for backend engineers at this level.'"
//   ],

//   "interviewQuestions": [
//     "Question 1 — tailored to this specific candidate's background",
//     "Question 2",
//     "Question 3",
//     "Question 4",
//     "Question 5 — exactly 5 questions total"
//   ],

//   "careerLevel": "one of: 'student', 'entry', 'mid', 'senior', 'lead', 'executive'",

//   "topRoles": [
//     "Job title this candidate is best suited for",
//     "2nd best fit role",
//     "3rd best fit role"
//   ]
// }

// ATS SCORE RUBRIC (total = atsScore, sum of four components):
// - keywords (0–30): 25–30 = rich technical vocabulary matching target roles; 15–24 = adequate; 0–14 = thin or generic
// - formatting (0–25): 20–25 = single column, clear headings, standard fonts, no tables; 10–19 = mostly clean; 0–9 = columns, graphics, or parsing-hostile layout
// - achievements (0–25): 20–25 = most bullets quantified with metrics; 10–19 = some metrics; 0–9 = all responsibilities, no numbers
// - completeness (0–20): 17–20 = all key sections present including summary and skills list; 10–16 = missing 1–2 sections; 0–9 = missing major sections

// STRICT RULES:
// 1. Return ONLY the JSON object. No text before or after it.
// 2. Be SPECIFIC — always reference actual job titles, companies, skills, or phrases from the resume.
// 3. Never hallucinate skills or experience not present in the resume.
// 4. interviewQuestions must be exactly 5 items.
// 5. atsScore must equal atsBreakdown.keywords + atsBreakdown.formatting + atsBreakdown.achievements + atsBreakdown.completeness.
// 6. If the text appears to be a CV (academic), adjust scoring expectations accordingly.
// 7. careerLevel must be one of the six specified values exactly.`;

//   // ── User Prompt ───────────────────────────────────────
//   // This is the actual resume text the user uploaded.
//   // We clearly delimit it with markers so Gemini knows
//   // exactly where the resume starts and ends.
//   const userPrompt = `Analyze the following resume and return the JSON evaluation as specified:

// === RESUME START ===
// ${resumeText}
// === RESUME END ===`;

//   return { systemPrompt, userPrompt };
// };

// /**
//  * Builds a follow-up prompt to fix broken JSON output.
//  * Used by the retry logic when Gemini returns malformed JSON.
//  *
//  * @param {string} brokenOutput - What Gemini returned
//  * @returns {string}
//  */
// export const buildRepairPrompt = (brokenOutput) => {
//   return `The following text was supposed to be a valid JSON object but is malformed or incomplete. 
// Fix it and return ONLY the corrected JSON. Do not add any explanation.

// Broken output:
// ${brokenOutput.substring(0, 2000)}

// Return the fixed JSON now:`;
// };




export const buildResumeAnalysisPrompt = (resumeText) => {

  const systemPrompt = `
You are an AI resume analyzer.

Analyze the resume and return ONLY valid JSON.

Required JSON format:
{
  "atsScore": "number",
  "strengths": [],
  "weaknesses": [],
  "missingSkills": [],
  "interviewQuestions": [],
  "careerSuggestions": []
}

Rules:
- Keep responses short
- No markdown
- No extra text
- interviewQuestions must contain 5 items
`;

  const userPrompt = `
Resume:
${resumeText}
`;

  return {
    systemPrompt,
    userPrompt,
  };
};