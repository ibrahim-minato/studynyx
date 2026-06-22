const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    document: { type: mongoose.Schema.Types.ObjectId, ref: "Document", default: null },
    title: { type: String, required: true },
    questions: [
      {
        question: String,
        options: [String],
        correct: Number,
        explanation: String,
      },
    ],
    score: { type: Number, default: 0 },
    totalQuestions: { type: Number, default: 0 },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Quiz", quizSchema);
