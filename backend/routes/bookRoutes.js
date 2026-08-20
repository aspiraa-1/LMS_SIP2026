const express = require("express");
const router = express.Router();
const Book = require("../models/Book");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, async (req, res) => {
  try {
    const { search, genre, available } = req.query;
    let query = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
        { isbn: { $regex: search, $options: "i" } },
      ];
    }
    if (genre) query.genre = genre;
    if (available === "true") query.availableCopies = { $gt: 0 };

    const books = await Book.find(query).sort({ createdAt: -1 });
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id", protect, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", protect, async (req, res) => {
  try {
    const { title, author, isbn, genre, totalCopies, description, shelfLocation, publishedYear } = req.body;
    const exists = await Book.findOne({ isbn });
    if (exists) return res.status(400).json({ message: "Book with this ISBN already exists" });

    const book = await Book.create({
      title, author, isbn, genre, description,
      totalCopies, availableCopies: totalCopies,
      shelfLocation, publishedYear,
    });
    res.status(201).json(book);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put("/:id", protect, async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    });
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json(book);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/:id", protect, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    if (book.availableCopies < book.totalCopies) {
      return res.status(400).json({ message: "Cannot delete: some copies are still borrowed" });
    }
    await book.deleteOne();
    res.json({ message: "Book deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/stats/summary", protect, async (req, res) => {
  try {
    const total = await Book.countDocuments();
    const available = await Book.countDocuments({ availableCopies: { $gt: 0 } });
    const genres = await Book.aggregate([
      { $group: { _id: "$genre", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    res.json({ total, available, borrowed: total - available, genres });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;