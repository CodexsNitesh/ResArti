// server.js
// ─────────────────────────────────────────────────────────
// This is the ENTRY POINT of our backend.
// It's the first file Node.js runs.
//
// It:
//   1. Loads environment variables from .env
//   2. Creates the Express app
//   3. Attaches middleware (CORS, JSON parsing)
//   4. Attaches routes
//   5. Connects to MongoDB
//   6. Starts listening for requests
// ─────────────────────────────────────────────────────────

import "./config/env.js";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import resumeRoutes from "./routes/resumeRoutes.js";

// Load .env file FIRST — before anything else reads process.env

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ────────────────────────────────────────────
// Middleware runs on EVERY request, in the order defined here.

// CORS: Allows our React frontend (port 5173) to talk to
// this backend (port 5000). Without this, browsers block the request.
app.use(
  cors({
    origin: true,
    //  process.env.NODE_ENV === "production"
    //   ? process.env.FRONTEND_URL       // Use real URL in production
    //   : "http://localhost:5173" ,        // Vite's default dev port
    credentials: true,                 // Allow cookies if needed later
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Parse incoming JSON request bodies
// e.g. lets us read req.body in controllers
app.use(express.json({ limit: "10mb" }));

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ── Routes ────────────────────────────────────────────────
// All resume-related routes are grouped under /api/resume
app.use("/api/resume", resumeRoutes);

// ── Health Check Route ────────────────────────────────────
// A simple GET / route to confirm the server is alive.
// Useful for deployment health checks.
app.get("/", (req, res) => {
  res.json({
    message: "🚀 AI Resume Analyzer API is running",
    status: "healthy",
    timestamp: new Date().toISOString(),
    endpoints: {
      upload: "POST /api/resume/upload",
      history: "GET /api/resume/history",
      getOne: "GET /api/resume/:id",
      delete: "DELETE /api/resume/:id",
    },
  });
});

// ── 404 Handler ───────────────────────────────────────────
// If no route matched, send a 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.url} not found`,
  });
});

// ── Global Error Handler ──────────────────────────────────
// Catches any error thrown with next(error) in controllers
// Must have exactly 4 parameters: (err, req, res, next)
app.use((err, req, res, next) => {
  console.error("🔥 Unhandled error:", err.stack);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || "Internal Server Error",
  });
});

// ── Start the Server ──────────────────────────────────────
// We connect to MongoDB FIRST, then start listening.
// This ensures the DB is ready before any requests arrive.
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`🚀 Server running on   http://localhost:${PORT}`);
    console.log(`📋 Health check:       http://localhost:${PORT}/`);
    console.log(`📤 Upload endpoint:    POST /api/resume/upload`);
    console.log(`📚 History endpoint:   GET  /api/resume/history`);
    console.log(`🌍 Environment:        ${process.env.NODE_ENV}`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  });
});