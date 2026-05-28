import { GoogleGenAI } from "@google/genai";
import { preprocessResumeText } from "./textPreprocessor.js";
import { buildResumeAnalysisPrompt } from "./promptBuilder.js";
import { parseGeminiResponse } from "./responseParser.js";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is missing in .env");
}

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const MODEL_NAME = "gemini-2.0-flash";
const MAX_RETRIES = 3;
const BASE_DELAY = 1000;
const REQUEST_TIMEOUT = 30000;

export const analyzeResumeWithGemini = async (rawText) => {
  try {
    console.log("Starting Resume Analysis");

    const { text: cleanText, metadata } =
      preprocessResumeText(rawText);

    const { systemPrompt, userPrompt } =
      buildResumeAnalysisPrompt(cleanText);

    const finalPrompt = `
${systemPrompt}

${userPrompt}

IMPORTANT:
Return ONLY valid JSON.
`;
    const rawResponse =
      await callGeminiWithRetry(finalPrompt);

// const rawResponse = `
// {
//   "atsScore": "85/100",
//   "strengths": [
//     "Good React knowledge",
//     "Strong MERN skills"
//   ],
//   "weaknesses": [
//     "Limited cloud experience"
//   ],
//   "missingSkills": [
//     "Docker",
//     "AWS"
//   ],
//   "interviewQuestions": [
//     "Explain React hooks",
//     "What is JWT?"
//   ],
//   "careerSuggestions": [
//     "Frontend Developer",
//     "MERN Stack Developer"
//   ],
//   "careerLevel": "Beginner"
// }
// `;
    const analysis =
      parseGeminiResponse(rawResponse);

    return {
      ...analysis,
      _metadata: metadata,
    };

  } catch (error) {
    console.error("Gemini Service Error:", error);

    throw new Error(
      error.message || "Failed to analyze resume"
    );
  }
};

const callGeminiWithRetry = async (prompt) => {
  let lastError;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(
        `Attempt ${attempt}/${MAX_RETRIES}`
      );

      if (attempt > 1) {
        const delay = BASE_DELAY * attempt;

        await sleep(delay);
      }

      const response = await callGemini(prompt);

      return response;

    } catch (error) {
      lastError = error;

      console.error(
        `Attempt ${attempt} failed:`,
        error.message
      );

      if (attempt === MAX_RETRIES) {
        throw new Error(
          `Gemini failed after ${MAX_RETRIES} attempts`
        );
      }
    }
  }
};

const callGemini = async (prompt) => {
  try {
    const apiCall = ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(
        () =>
          reject(
            new Error(
              `Request timeout after ${REQUEST_TIMEOUT / 1000}s`
            )
          ),
        REQUEST_TIMEOUT
      )
    );

    const result = await Promise.race([
      apiCall,
      timeoutPromise,
    ]);

    const responseText = result.text;

    if (
      !responseText ||
      responseText.trim().length === 0
    ) {
      throw new Error(
        "Gemini returned empty response"
      );
    }

    return responseText;

  } catch (error) {
    console.error("Gemini API Error:", error);

    throw error;
  }
};

const sleep = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));