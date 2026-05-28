// middleware/upload.js
// ─────────────────────────────────────────────────────────
// Middleware runs BETWEEN the request arriving and the
// controller handling it.
//
// Multer is a library that handles "multipart/form-data"
// requests — which is how browsers send files.
//
// We configure it to:
//   1. Store files in memory (not on disk — we don't need to)
//   2. Only accept PDFs
//   3. Reject files bigger than 5MB
// ─────────────────────────────────────────────────────────

import multer from "multer";

// ── Storage: memoryStorage ────────────────────────────────
// Instead of saving the file to disk, Multer keeps it in
// memory as a Buffer (raw bytes).
// This is faster and simpler for our use case because
// pdf-parse can read directly from a Buffer.
const storage = multer.memoryStorage();

// ── File Filter ───────────────────────────────────────────
// This function runs for every uploaded file.
// cb = callback function
//   cb(null, true)  → accept the file ✅
//   cb(error, false) → reject the file ❌
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true); // ✅ It's a PDF — allow it
  } else {
    // ❌ Not a PDF — reject with a descriptive error
    cb(
      new Error(`Invalid file type: ${file.mimetype}. Only PDF files are allowed.`),
      false
    );
  }
};

// ── Multer Instance ───────────────────────────────────────
// We combine storage + fileFilter + size limit into one config
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB in bytes (5 × 1024 × 1024)
  },
});

// ── Error Handler for Multer ──────────────────────────────
// Multer throws its own error type called MulterError.
// This middleware catches those and sends clean JSON errors
// instead of crashing the server.
export const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Multer-specific errors (file too large, etc.)
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        error: "File too large. Maximum size is 5MB.",
      });
    }
    return res.status(400).json({
      success: false,
      error: `Upload error: ${err.message}`,
    });
  }

  if (err) {
    // Our custom fileFilter error (wrong file type)
    return res.status(400).json({
      success: false,
      error: err.message,
    });
  }

  // No error — continue to next middleware
  next();
};