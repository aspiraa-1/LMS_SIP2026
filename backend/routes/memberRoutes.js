const express = require("express");
const router = express.Router();
const Member = require("../models/Member");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, async (req, res) => {
  try {
    const { search, active } = req.query;
    let query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }
    if (active !== undefined) query.isActive = active === "true";

    const members = await Member.find(query)
      .populate("borrowedBooks")
      .sort({ createdAt: -1 });
    res.json(members);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id", protect, async (req, res) => {
  try {
    const member = await Member.findById(req.params.id).populate({
      path: "borrowedBooks",
      populate: { path: "book", select: "title author isbn" },
    });
    if (!member) return res.status(404).json({ message: "Member not found" });
    res.json(member);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", protect, async (req, res) => {
  try {
    const exists = await Member.findOne({ email: req.body.email });
    if (exists) return res.status(400).json({ message: "Email already registered" });

    const member = await Member.create(req.body);
    res.status(201).json(member);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put("/:id", protect, async (req, res) => {
  try {
    const member = await Member.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    });
    if (!member) return res.status(404).json({ message: "Member not found" });
    res.json(member);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/:id", protect, async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) return res.status(404).json({ message: "Member not found" });
    if (member.borrowedBooks.length > 0) {
      return res.status(400).json({ message: "Cannot delete: member has active borrowed books" });
    }
    await member.deleteOne();
    res.json({ message: "Member deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;