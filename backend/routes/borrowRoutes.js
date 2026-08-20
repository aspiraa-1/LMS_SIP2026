const express = require("express");
const router = express.Router();
const BorrowRecord = require("../models/BorrowRecord");
const Book = require("../models/Book");
const Member = require("../models/Member");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};
    if (status) query.status = status;

    const records = await BorrowRecord.find(query)
      .populate("book", "title author isbn")
      .populate("member", "name email phone")
      .sort({ borrowDate: -1 });

    const updated = records.map((r) => {
      if (r.status === "Borrowed" && new Date() > r.dueDate) {
        const days = Math.floor((new Date() - r.dueDate) / (1000 * 60 * 60 * 24));
        r.status = "Overdue";
        r.fineAmount = days * 5;
      }
      return r;
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", protect, async (req, res) => {
  try {
    const { bookId, memberId, dueDate } = req.body;

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });
    if (book.availableCopies < 1)
      return res.status(400).json({ message: "No copies available" });

    const member = await Member.findById(memberId);
    if (!member) return res.status(404).json({ message: "Member not found" });
    if (!member.isActive) return res.status(400).json({ message: "Member account is inactive" });

    const existing = await BorrowRecord.findOne({
      book: bookId, member: memberId, status: { $in: ["Borrowed", "Overdue"] },
    });
    if (existing) return res.status(400).json({ message: "Member already has this book" });

    const record = await BorrowRecord.create({
      book: bookId,
      member: memberId,
      dueDate: dueDate || undefined,
    });

    book.availableCopies -= 1;
    await book.save();

    member.borrowedBooks.push(record._id);
    await member.save();

    await record.populate("book", "title author isbn");
    await record.populate("member", "name email");
    res.status(201).json(record);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put("/:id/return", protect, async (req, res) => {
  try {
    const record = await BorrowRecord.findById(req.params.id);
    if (!record) return res.status(404).json({ message: "Borrow record not found" });
    if (record.status === "Returned")
      return res.status(400).json({ message: "Book already returned" });

    const returnDate = new Date();
    let fineAmount = 0;
    if (returnDate > record.dueDate) {
      const daysOverdue = Math.floor((returnDate - record.dueDate) / (1000 * 60 * 60 * 24));
      fineAmount = daysOverdue * 5;
    }

    record.returnDate = returnDate;
    record.status = "Returned";
    record.fineAmount = fineAmount;
    await record.save();

    await Book.findByIdAndUpdate(record.book, { $inc: { availableCopies: 1 } });

    await Member.findByIdAndUpdate(record.member, {
      $pull: { borrowedBooks: record._id },
    });

    await record.populate("book", "title author");
    await record.populate("member", "name email");
    res.json({ record, fineAmount, message: fineAmount > 0 ? `Fine: ₹${fineAmount}` : "Returned on time!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/stats/overview", protect, async (req, res) => {
  try {
    const total = await BorrowRecord.countDocuments();
    const active = await BorrowRecord.countDocuments({ status: "Borrowed" });
    const overdue = await BorrowRecord.countDocuments({
      status: { $in: ["Borrowed", "Overdue"] },
      dueDate: { $lt: new Date() },
    });
    const returned = await BorrowRecord.countDocuments({ status: "Returned" });
    res.json({ total, active, overdue, returned });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;