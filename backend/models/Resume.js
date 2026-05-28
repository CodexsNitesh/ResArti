// models/Resume.js — UPDATED to match new Gemini output
import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      required: [true, "File name is required"],
      trim: true,
    },

    extractedText: {
      type: String,
      required: [true, "Extracted text is required"],
    },

    // Metadata from the text preprocessor
    textMetadata: {
      originalLength:     { type: Number, default: 0 },
      processedLength:    { type: Number, default: 0 },
      estimatedTokens:    { type: Number, default: 0 },
      wasTruncated:       { type: Boolean, default: false },
    },

    analysis: {
      summary:            { type: String,   default: "" },
      atsScore:           { type: Number,   default: 0, min: 0, max: 100 },

      // Breakdown of how the ATS score was calculated
      atsBreakdown: {
        keywords:         { type: Number, default: 0 },
        formatting:       { type: Number, default: 0 },
        achievements:     { type: Number, default: 0 },
        completeness:     { type: Number, default: 0 },
      },

      strengths:          { type: [String], default: [] },
      weaknesses:         { type: [String], default: [] },
      missingSkills:      { type: [String], default: [] },
      interviewQuestions: { type: [String], default: [] },

      // New fields
      careerLevel: {
        type: String,
        enum: ["student", "entry", "mid", "senior", "lead", "executive"],
        default: "mid",
      },
      topRoles:           { type: [String], default: [] },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Resume", resumeSchema);