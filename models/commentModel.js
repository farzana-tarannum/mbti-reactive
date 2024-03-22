const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  text: String,
  user: String,
  likes: [{ type: String, ref: "User" }],
  votes: [
    {
      system: { type: String, enum: ["MBTI", "Enneagram", "Zodiac"] },
      value: String, // Array of selected values for the system
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = commentSchema;