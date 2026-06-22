const express = require("express");
const { protect } = require("../middleware/auth");
const User = require("../models/User");
const Document = require("../models/Document");
const Flashcard = require("../models/Flashcard");
const Quiz = require("../models/Quiz");

const router = express.Router();

// GET /api/users/stats
router.get("/stats", protect, async (req, res) => {
  try {
    const [docCount, flashSets, quizzes] = await Promise.all([
      Document.countDocuments({ user: req.user._id }),
      Flashcard.find({ user: req.user._id }),
      Quiz.find({ user: req.user._id, completed: true }),
    ]);
    const totalCards = flashSets.reduce((sum, s) => sum + s.cards.length, 0);
    const avgScore = quizzes.length > 0
      ? Math.round(quizzes.reduce((sum, q) => sum + (q.score / q.totalQuestions) * 100, 0) / quizzes.length)
      : 0;
    res.json({ documents: docCount, flashcardSets: flashSets.length, totalFlashcards: totalCards, quizzesCompleted: quizzes.length, avgQuizScore: avgScore, streak: req.user.studyStreak });
  } catch { res.status(500).json({ message: "Server error" }); }
});

// PATCH /api/users/profile
router.patch("/profile", protect, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name?.trim()) return res.status(400).json({ message: "Name is required" });
    const user = await User.findByIdAndUpdate(req.user._id, { name: name.trim() }, { new: true });
    res.json({ user });
  } catch { res.status(500).json({ message: "Server error" }); }
});

// PATCH /api/users/password
router.patch("/password", protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) return res.status(400).json({ message: "All fields are required" });
    if (newPassword.length < 6) return res.status(400).json({ message: "New password must be at least 6 characters" });

    const user = await User.findById(req.user._id);
    const valid = await user.comparePassword(currentPassword);
    if (!valid) return res.status(401).json({ message: "Current password is incorrect" });

    user.password = newPassword;
    await user.save();
    res.json({ message: "Password updated successfully" });
  } catch { res.status(500).json({ message: "Server error" }); }
});

// DELETE /api/users/account
router.delete("/account", protect, async (req, res) => {
  try {
    const id = req.user._id;
    await Promise.all([
      User.findByIdAndDelete(id),
      Document.deleteMany({ user: id }),
      Flashcard.deleteMany({ user: id }),
      Quiz.deleteMany({ user: id }),
    ]);
    res.json({ message: "Account deleted" });
  } catch { res.status(500).json({ message: "Server error" }); }
});

module.exports = router;
