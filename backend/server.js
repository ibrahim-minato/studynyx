require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const rateLimit = require("express-rate-limit");
const path = require("path");

const authRoutes = require("./routes/auth");
const aiRoutes = require("./routes/ai");
const documentRoutes = require("./routes/documents");
const userRoutes = require("./routes/users");

const app = express();

// ── Middleware ──
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173", credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Rate limiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100, message: "Too many requests" });
const aiLimiter = rateLimit({ windowMs: 60 * 1000, max: 20, message: "AI request limit reached" });
app.use("/api/", limiter);
app.use("/api/ai/", aiLimiter);

// ── Routes ──
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/users", userRoutes);

// Health check
app.get("/api/health", (req, res) => res.json({ status: "ok", timestamp: new Date() }));

// ── MongoDB ──
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// ── Start ──
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 StudyNyx API running on port ${PORT}`));
// already required above — just add the route
