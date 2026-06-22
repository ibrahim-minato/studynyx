const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const { protect } = require("../middleware/auth");
const Document = require("../models/Document");

const router = express.Router();

// Multer in-memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = ["application/pdf", "text/plain"];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Only PDF and TXT files are supported"), false);
  },
});

// ── POST /api/documents/upload ──
router.post("/upload", protect, upload.single("file"), async (req, res) => {
  try {
    let content = "";
    const file = req.file;

    if (file) {
      if (file.mimetype === "application/pdf") {
        const pdfData = await pdfParse(file.buffer);
        content = pdfData.text;
      } else {
        content = file.buffer.toString("utf-8");
      }
    } else if (req.body.content) {
      content = req.body.content;
    } else {
      return res.status(400).json({ message: "File or text content required" });
    }

    if (content.length < 20) return res.status(400).json({ message: "Content too short" });

    const doc = await Document.create({
      user: req.user._id,
      title: req.body.title || file?.originalname || "Untitled Document",
      content: content.slice(0, 50000), // limit to 50k chars
      fileType: file ? (file.mimetype === "application/pdf" ? "pdf" : "txt") : "pasted",
      fileSize: file?.size || Buffer.byteLength(content, "utf8"),
    });

    res.status(201).json({ document: doc });
  } catch (err) {
    res.status(500).json({ message: "Upload failed", error: err.message });
  }
});

// ── GET /api/documents ──
router.get("/", protect, async (req, res) => {
  try {
    const docs = await Document.find({ user: req.user._id })
      .select("-content")
      .sort({ createdAt: -1 });
    res.json({ documents: docs });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ── GET /api/documents/:id ──
router.get("/:id", protect, async (req, res) => {
  try {
    const doc = await Document.findOne({ _id: req.params.id, user: req.user._id });
    if (!doc) return res.status(404).json({ message: "Document not found" });
    res.json({ document: doc });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ── DELETE /api/documents/:id ──
router.delete("/:id", protect, async (req, res) => {
  try {
    await Document.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
