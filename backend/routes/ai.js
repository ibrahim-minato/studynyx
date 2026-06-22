const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { protect } = require("../middleware/auth");
const Flashcard = require("../models/Flashcard");
const Quiz = require("../models/Quiz");

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getModel = () => genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const ask = async (prompt) => {
  const result = await getModel().generateContent(prompt);
  return result.response.text();
};

// ── POST /api/ai/flashcards ──
router.post("/flashcards", protect, async (req, res) => {
  try {
    const { text, title, count = 8, documentId } = req.body;
    if (!text) return res.status(400).json({ message: "Text is required" });

    const prompt = `You are an expert study assistant. Generate exactly ${count} high-quality flashcards from the provided study material.
Return ONLY valid JSON, no markdown, no explanation, no code blocks:
{"flashcards": [{"question": "...", "answer": "..."}, ...]}

Material:
${text}`;

    const raw = await ask(prompt);
    const clean = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    const set = await Flashcard.create({
      user: req.user._id,
      document: documentId || null,
      title: title || "Flashcard Set",
      cards: parsed.flashcards,
    });

    res.json({ flashcardSet: set });
  } catch (err) {
    console.error("Flashcard error:", err.message);
    res.status(500).json({ message: "Failed to generate flashcards", error: err.message });
  }
});

// ── POST /api/ai/quiz ──
router.post("/quiz", protect, async (req, res) => {
  try {
    const { text, title, count = 5, documentId } = req.body;
    if (!text) return res.status(400).json({ message: "Text is required" });

    const prompt = `You are an expert exam creator. Generate exactly ${count} multiple choice questions from the provided material.
Return ONLY valid JSON, no markdown, no explanation, no code blocks:
{"questions": [{"question": "...", "options": ["A) ...", "B) ...", "C) ...", "D) ..."], "correct": 0, "explanation": "..."}]}
'correct' is the 0-based index of the correct option.

Material:
${text}`;

    const raw = await ask(prompt);
    const clean = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    const quiz = await Quiz.create({
      user: req.user._id,
      document: documentId || null,
      title: title || "Practice Quiz",
      questions: parsed.questions,
      totalQuestions: parsed.questions.length,
    });

    res.json({ quiz });
  } catch (err) {
    console.error("Quiz error:", err.message);
    res.status(500).json({ message: "Failed to generate quiz", error: err.message });
  }
});

// ── POST /api/ai/summary ──
router.post("/summary", protect, async (req, res) => {
  try {
    const { text, format = "standard" } = req.body;
    if (!text) return res.status(400).json({ message: "Text is required" });

    const instructions = {
      brief: "Write a 3-sentence summary capturing only the most essential points.",
      standard: "Write a well-structured summary with key concepts and main points. Use bullet points for clarity.",
      detailed: "Write a comprehensive in-depth summary covering all major topics, subtopics, and definitions. Organize with headers.",
    };

    const prompt = `You are an expert academic summarizer. ${instructions[format] || instructions.standard}

Summarize this study material:
${text}`;

    const summary = await ask(prompt);
    res.json({ summary });
  } catch (err) {
    res.status(500).json({ message: "Failed to generate summary", error: err.message });
  }
});

// ── POST /api/ai/tutor ──
router.post("/tutor", protect, async (req, res) => {
  try {
    const { messages, context } = req.body;
    if (!messages?.length) return res.status(400).json({ message: "Messages required" });

    const systemPrompt = context
      ? `You are StudyNyx AI Tutor — an expert, encouraging study assistant. The student is studying the following material:\n\n${context}\n\nAnswer questions about this material clearly. Use examples. If asked to generate flashcards or questions, do so in a structured format.`
      : `You are StudyNyx AI Tutor — an expert, encouraging study assistant. Help students understand any topic clearly and concisely. Break down complex ideas, use examples, and always be supportive.`;

    // Build full prompt with history
    const historyText = messages
      .slice(0, -1)
      .map((m) => `${m.role === "assistant" ? "Tutor" : "Student"}: ${m.content}`)
      .join("\n");

    const lastMessage = messages[messages.length - 1].content;

    const fullPrompt = `${systemPrompt}

${historyText ? `Conversation so far:\n${historyText}\n` : ""}Student: ${lastMessage}
Tutor:`;

    const reply = await ask(fullPrompt);
    res.json({ reply });
  } catch (err) {
    console.error("Tutor error:", err.message);
    res.status(500).json({ message: "Tutor error", error: err.message });
  }
});

// ── GET /api/ai/flashcards ──
router.get("/flashcards", protect, async (req, res) => {
  try {
    const sets = await Flashcard.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ sets });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// ── GET /api/ai/quizzes ──
router.get("/quizzes", protect, async (req, res) => {
  try {
    const quizzes = await Quiz.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ quizzes });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// ── PATCH /api/ai/quiz/:id/score ──
router.patch("/quiz/:id/score", protect, async (req, res) => {
  try {
    const { score } = req.body;
    const quiz = await Quiz.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { score, completed: true },
      { new: true }
    );
    res.json({ quiz });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
