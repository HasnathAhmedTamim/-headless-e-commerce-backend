// Database configuration
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const connectDB = async () => {
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI missing");
  const uri = process.env.MONGO_URI;
  const host = uri.includes('@') ? uri.split('@')[1].split('/')[0] : uri;
  console.log("Connecting to MongoDB host:", host);
  await mongoose.connect(uri);
  console.log("✅ MongoDB Connected (runtime)");
};