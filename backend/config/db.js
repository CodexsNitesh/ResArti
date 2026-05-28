// config/db.js
// ─────────────────────────────────────────────────────────
// This file handles connecting our app to MongoDB.
// We export a function called connectDB() that server.js calls
// once when the app starts.
// ─────────────────────────────────────────────────────────

import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    // mongoose.connect() returns a connection object
    // We store it in 'conn' so we can log the host name
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // These options suppress deprecation warnings in newer Mongoose
      serverSelectionTimeoutMS: 5000, // Timeout after 5s if can't connect
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📦 Database: ${conn.connection.name}`);

  } catch (error) {
    console.error(`❌ MongoDB Connection Failed!`);
    console.error(`   Error: ${error.message}`);
    console.error(`\n💡 Check your MONGO_URI in the .env file`);

    // process.exit(1) stops the entire Node.js app
    // We do this because there's no point running the server
    // if the database isn't working
    process.exit(1);
  }
};