const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    isbn: { type: String, required: true, unique: true, trim: true },
    genre: {
      type: String, required: true,
      enum: ["Fiction","Non-Fiction","Science","Technology","History",
             "Biography","Children","Mystery","Romance","Other"],
    },
    description: { type: String, default: "" },
    totalCopies: { type: Number, required: true, min: 1 },
    availableCopies: { type: Number, required: true, min: 0 },
    shelfLocation: { type: String, default: "General" },
    publishedYear: { type: Number },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Book", bookSchema);