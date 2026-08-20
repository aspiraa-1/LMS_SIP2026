const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, required: true },
    address: { type: String, default: "" },
    membershipType: {
      type: String,
      enum: ["Standard", "Premium", "Student"],
      default: "Standard",
    },
    isActive: { type: Boolean, default: true },
    borrowedBooks: [{ type: mongoose.Schema.Types.ObjectId, ref: "BorrowRecord" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Member", memberSchema);