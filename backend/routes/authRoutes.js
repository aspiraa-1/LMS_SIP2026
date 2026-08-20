const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const mongoose = require("mongoose");

// पर्यावरण चर (Environment Variables) लोड करें
dotenv.config();

// एक्सप्रेस ऐप इनिशियलाइज करें
const app = express();

// डेटाबेस कनेक्शन कॉल करें
connectDB();

// मिडलवेयर सेटअप
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

// मुख्य बेस राउट्स
app.use("/api/auth",    require("./routes/authRoutes"));
app.use("/api/books",   require("./routes/bookRoutes"));
app.use("/api/members", require("./routes/memberRoutes"));
app.use("/api/borrow",  require("./routes/borrowRoutes"));

// टेस्टिंग के लिए रूट
app.get("/", (req, res) => {
  res.json({ message: "📚 Library Management API is running perfectly!" });
});

// 404 राउट हैंडलर
app.use((req, res) => {
  res.status(404).json({ message: "Requested terminal route not found" });
});

// ग्लोबल एरर हैंडलर
app.use((err, req, res, next) => {
  console.error("System Error Stack:", err.stack);
  res.status(500).json({ message: "Internal Server Core Error", error: err.message });
});

// सर्वर पोर्ट इनिशियलाइजेशन (यह सुनिश्चित करता है कि प्रोसेस चालू रहे)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 ===================================================`);
  console.log(`🚀 CORE APIS ACTIVE: Running on http://localhost:${PORT}`);
  console.log(`🚀 ===================================================`);
});
