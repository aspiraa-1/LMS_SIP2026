const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = 5000;
const JWT_SECRET = "my_ultra_secure_cyber_secret_key_123";

// 📦 Core Simulated Datasets
let databaseBooksCluster = [
  { _id: "b1", title: "The Cyberpunk Matrix", author: "William Gibson", isbn: "978-0441569595" },
  { _id: "b2", title: "Mastering Full-Stack MERN", author: "Douglas Crockford", isbn: "978-1119852345" }
];

let databaseMembersCluster = [
  { _id: "m1", name: "Sarah Connor", email: "sarah@sky.net", membershipId: "MEM-9021" },
  { _id: "m2", name: "Marcus Wright", email: "marcus@project.org", membershipId: "MEM-4412" }
];

let databaseBorrowCluster = [
  { _id: "br1", bookTitle: "The Cyberpunk Matrix", memberName: "Sarah Connor", borrowDate: "2026-06-28", status: "Issued" }
];

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

// 1. Root Connection Verification
app.get("/", (req, res) => {
  res.json({ message: "📚 Library Management API is running perfectly!" });
});

// 2. Authentication Protocol Node
app.post("/api/auth/login", (req, res) => {
  try {
    const { email, password } = req.body;
    const cleanEmail = email ? email.toLowerCase().trim() : "";

    if (cleanEmail === "admin@library.com" && password === "admin123") {
      const token = jwt.sign(
        { id: "dev_static_admin_id", role: "admin" },
        JWT_SECRET,
        { expiresIn: "1d" }
      );
      return res.json({
        token,
        user: { id: "dev_static_admin_id", name: "System Supervisor", email: "admin@library.com", role: "admin" }
      });
    } else {
      return res.status(401).json({ message: "Invalid email identifier or passphrase!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

// 3. Book Handlers
app.get("/api/books", (req, res) => res.json(databaseBooksCluster));
app.post("/api/books", (req, res) => {
  const { title, author, isbn } = req.body;
  if (!title || !author) return res.status(400).json({ message: "Parameters missing!" });
  const newBook = { _id: "book_" + Math.random().toString(36).substr(2, 9), title, author, isbn: isbn || "N/A" };
  databaseBooksCluster.unshift(newBook);
  res.status(201).json(newBook);
});

// 4. Member Handlers
app.get("/api/members", (req, res) => res.json(databaseMembersCluster));
app.post("/api/members", (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) return res.status(400).json({ message: "Parameters missing!" });
  const newMember = { _id: "mem_" + Math.random().toString(36).substr(2, 9), name, email, membershipId: "MEM-" + Math.floor(1000 + Math.random() * 9000) };
  databaseMembersCluster.unshift(newMember);
  res.status(201).json(newMember);
});

// 5. Borrow Registry Action Handlers
app.get("/api/borrow", (req, res) => {
  res.json(databaseBorrowCluster);
});

app.post("/api/borrow", (req, res) => {
  try {
    const { bookId, memberId } = req.body;
    if (!bookId || !memberId) {
      return res.status(400).json({ message: "Missing required core coordinates!" });
    }

    const selectedBook = databaseBooksCluster.find(b => b._id === bookId);
    const selectedMember = databaseMembersCluster.find(m => m._id === memberId);

    if (!selectedBook || !selectedMember) {
      return res.status(404).json({ message: "Target book or member not identified." });
    }

    const newBorrowLog = {
      _id: "borrow_" + Math.random().toString(36).substr(2, 9),
      bookTitle: selectedBook.title,
      memberName: selectedMember.name,
      borrowDate: new Date().toISOString().split('T')[0],
      status: "Issued"
    };

    databaseBorrowCluster.unshift(newBorrowLog);
    res.status(201).json(newBorrowLog);
  } catch (error) {
    res.status(500).json({ message: "Failed to generate checkout contract.", error: error.message });
  }
});

app.post("/api/borrow/return/:id", (req, res) => {
  const { id } = req.params;
  const transaction = databaseBorrowCluster.find(t => t._id === id);
  if (transaction) {
    transaction.status = "Returned";
    return res.json({ message: "Volume marked as returned to vault repository.", transaction });
  }
  res.status(404).json({ message: "Log coordinate entry target missing." });
});

app.listen(PORT, () => {
  console.log(`🚀 ===================================================`);
  console.log(`🚀 ALL CENTRAL BACKEND MODULES FULLY DEPLOYED ONLINE`);
  console.log(`🚀 API PORT: http://localhost:${PORT}`);
  console.log(`🚀 ===================================================`);
});
