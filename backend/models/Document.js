const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    fileType: { type: String, enum: ["pdf", "docx", "txt", "pasted"], default: "pasted" },
    fileSize: { type: Number, default: 0 },
    status: { type: String, enum: ["processing", "ready"], default: "ready" },
    summary: { type: String, default: "" },
    flashcardCount: { type: Number, default: 0 },
    quizCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Document", documentSchema);
