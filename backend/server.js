require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/auth");
const aiRoutes = require("./routes/ai");
const documentRoutes = require("./routes/documents");
const userRoutes = require("./routes/users");
const transcriptionRoutes = require("./routes/transcription");

const app = express();

// ── CORS — allow all Vercel preview URLs + production ──
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  /\.vercel\.app$/,
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const allowed = allowedOrigins.some(o =>
      typeof o === "string" ? o === origin : o.test(origin)
    );
    if (allowed) callback(null, true);
    else callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
const aiLimiter = rateLimit({ windowMs: 60 * 1000, max: 20 });
app.use("/api/", limiter);
app.use("/api/ai/", aiLimiter);

app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/users", userRoutes);
app.use("/api/transcription", transcriptionRoutes);

app.get("/api/health", (req, res) => res.json({ status: "ok", timestamp: new Date() }));

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 StudyNyx API running on port ${PORT}`));
