const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // .env फ़ाइल से MONGO_URI लेगा, अगर नहीं मिली तो लोकल MongoDB से कनेक्ट करेगा
    const conn = await mongoose.connect(
      process.env.MONGO_URI || "mongodb://127.0.0.1:27017/library_management"
    );
    
    console.log(`💾 ===================================================`);
    console.log(`💾 MONGO_DB CONNECTED: ${conn.connection.host}`);
    console.log(`💾 DATABASE NAME: ${conn.connection.name}`);
    console.log(`💾 ===================================================`);
  } catch (error) {
    console.error(`❌ DATABASE CONNECTION ERROR: ${error.message}`);
    // यहाँ process.exit(1) नहीं लिख रहे हैं ताकि सर्वर क्रैश होकर बंद न हो
  }
};

module.exports = connectDB;
