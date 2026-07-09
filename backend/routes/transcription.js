const express = require("express");
const multer = require("multer");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { protect } = require("../middleware/auth");

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
  fileFilter: (req, file, cb) => {
    const allowed = [
      "audio/mpeg", "audio/mp3", "audio/wav", "audio/wave",
      "audio/mp4", "audio/m4a", "audio/ogg", "audio/webm",
      "audio/x-wav", "audio/x-m4a"
    ];
    if (allowed.includes(file.mimetype) || file.mimetype.startsWith("audio/")) {
      cb(null, true);
    } else {
      cb(new Error("Only audio files are supported (MP3, WAV, M4A, OGG)"), false);
    }
  },
});

// POST /api/transcription/audio
router.post("/audio", protect, upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Audio file required" });

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent([
      {
        inlineData: {
          data: req.file.buffer.toString("base64"),
          mimeType: req.file.mimetype,
        },
      },
      "Transcribe this audio accurately and completely. Return only the transcription text with no additional commentary, labels, or formatting.",
    ]);

    const transcription = result.response.text();
    res.json({ transcription, filename: req.file.originalname });
  } catch (err) {
    console.error("Transcription error:", err.message);
    res.status(500).json({ message: "Transcription failed", error: err.message });
  }
});

module.exports = router;
