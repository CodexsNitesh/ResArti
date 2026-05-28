// controllers/resumeController.js — UPDATED
import pdfParse from "pdf-parse/lib/pdf-parse.js";
import Resume from "../models/Resume.js";
import { analyzeResumeWithGemini } from "../services/geminiService.js";

export const uploadAndAnalyze = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: "No PDF file uploaded." });
    }

    console.log(`\n📄 Processing: ${req.file.originalname} (${(req.file.size / 1024).toFixed(1)} KB)`);

    // ── Extract text from PDF ──────────────────────────
    let pdfData;
    try {
      pdfData = await pdfParse(req.file.buffer);
    } catch {
      return res.status(400).json({
        success: false,
        error: "Could not read the PDF. Make sure it is a valid, non-corrupted file.",
      });
    }

    const rawText = pdfData.text;

    // ── Analyze with Gemini (includes preprocessing) ───
    // analyzeResumeWithGemini now handles preprocessing internally
    // It returns { ...analysis, _metadata }
    let analysisResult;
    try {
      analysisResult = await analyzeResumeWithGemini(rawText);
    } catch (aiError) {
      console.error("AI Error:", aiError.message);

      // Give users a helpful error depending on what went wrong
      const userMessage = aiError.message.includes("too short")
        ? aiError.message                                  // Our preprocessing error → show it
        : "AI analysis failed. Please try again in a moment."; // Generic for API errors

      return res.status(502).json({ success: false, error: userMessage });
    }

    // Separate metadata from analysis fields
    const { _metadata, ...analysis } = analysisResult;

    console.log(`✅ Analysis complete — ATS: ${analysis.atsScore}, Level: ${analysis.careerLevel}`);

    // ── Save to MongoDB ────────────────────────────────
    const resume = await Resume.create({
      fileName:     req.file.originalname,
      extractedText: pdfData.text.substring(0, 5000), // Store first 5000 chars only
      textMetadata: _metadata,
      analysis,
    });

    return res.status(201).json({
      success: true,
      message: "Resume analyzed successfully!",
      data: resume,
    });

  } catch (error) {
    console.error("❌ Unexpected controller error:", error);
    return res.status(500).json({ success: false, error: "Internal server error." });
  }
};

export const getHistory = async (req, res) => {
  try {
    const resumes = await Resume.find()
      .sort({ createdAt: -1 })
      .select("-extractedText")
      .lean();

    return res.status(200).json({ success: true, count: resumes.length, data: resumes });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Failed to fetch history." });
  }
};

export const getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) return res.status(404).json({ success: false, error: "Resume not found." });
    return res.status(200).json({ success: true, data: resume });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ success: false, error: "Invalid resume ID." });
    }
    return res.status(500).json({ success: false, error: "Failed to fetch resume." });
  }
};

export const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findByIdAndDelete(req.params.id);
    if (!resume) return res.status(404).json({ success: false, error: "Resume not found." });
    return res.status(200).json({ success: true, message: "Resume deleted." });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Failed to delete resume." });
  }
};