// Database configuration
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const connectDB = async () => {
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI missing");
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const dbName = process.env.MONGO_URI.split('.mongodb.net/')[1]?.split('?')[0] || 'admin';
    console.log("✅ MongoDB Connected! Using database:", dbName);
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    throw err;
  }
};