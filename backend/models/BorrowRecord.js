const mongoose = require("mongoose");

const borrowRecordSchema = new mongoose.Schema(
  {
    book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
    member: { type: mongoose.Schema.Types.ObjectId, ref: "Member", required: true },
    borrowDate: { type: Date, default: Date.now },
    dueDate: {
      type: Date, required: true,
      default: () => {
        const d = new Date();
        d.setDate(d.getDate() + 14);
        return d;
      },
    },
    returnDate: { type: Date, default: null },
    status: { type: String, enum: ["Borrowed","Returned","Overdue"], default: "Borrowed" },
    fineAmount: { type: Number, default: 0 },
    finePaid: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("BorrowRecord", borrowRecordSchema);