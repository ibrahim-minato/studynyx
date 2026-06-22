const mongoose = require("mongoose");

const flashcardSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    document: { type: mongoose.Schema.Types.ObjectId, ref: "Document", default: null },
    title: { type: String, required: true },
    cards: [
      {
        question: { type: String, required: true },
        answer: { type: String, required: true },
        mastered: { type: Boolean, default: false },
        reviewCount: { type: Number, default: 0 },
        nextReview: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Flashcard", flashcardSchema);
