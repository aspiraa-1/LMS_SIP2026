const mongoose = require("mongoose");

const connectDB = async () => {
  try {

    const conn = await mongoose.connect(
      process.env.MONGO_URI || "mongodb://127.0.0.1:27017/library_management"
    );
    
    console.log(`💾 ===================================================`);
    console.log(`💾 MONGO_DB CONNECTED: ${conn.connection.host}`);
    console.log(`💾 DATABASE NAME: ${conn.connection.name}`);
    console.log(`💾 ===================================================`);
  } catch (error) {
    console.error(`❌ DATABASE CONNECTION ERROR: ${error.message}`);

  
  }
};

module.exports = connectDB;
