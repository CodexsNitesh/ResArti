// routes/resumeRoutes.js
// ─────────────────────────────────────────────────────────
// Routes are like a switchboard — they map incoming URLs
// to the right controller function.
//
// All these routes are PREFIXED with /api/resume
// (that prefix is set in server.js)
//
// So the full URLs are:
//   POST   http://localhost:5000/api/resume/upload
//   GET    http://localhost:5000/api/resume/history
//   GET    http://localhost:5000/api/resume/:id
//   DELETE http://localhost:5000/api/resume/:id
// ─────────────────────────────────────────────────────────

import express from "express";
import { upload, handleUploadError } from "../middleware/upload.js";
import {
  uploadAndAnalyze,
  getHistory,
  getResumeById,
  deleteResume,
} from "../controllers/resumeController.js";

const router = express.Router();

// ── POST /upload ───────────────────────────────────────────
// Flow: request → upload.single() → handleUploadError → uploadAndAnalyze
//
// upload.single("resume") means:
//   "Look for a file in the request's form-data field named 'resume'"
//   That field name must match what the React frontend sends!
router.post(
  "/upload",
  upload.single("resume"),   // Step 1: Multer processes the file
  handleUploadError,          // Step 2: Handle any Multer errors cleanly
  uploadAndAnalyze            // Step 3: Run our controller
);

// ── GET /history ───────────────────────────────────────────
router.get("/history", getHistory);

// ── GET /:id ───────────────────────────────────────────────
// :id is a URL parameter — e.g. /api/resume/64a3f...
router.get("/:id", getResumeById);

// ── DELETE /:id ────────────────────────────────────────────
router.delete("/:id", deleteResume);

export default router;