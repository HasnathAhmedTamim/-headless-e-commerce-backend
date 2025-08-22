import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const connectDB = async () => {
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI missing");

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      autoIndex: true,
      serverSelectionTimeoutMS: 5000,
    });

    if (process.env.NODE_ENV !== "production") {
      mongoose.set("debug", true);
    }

    console.log(`✅ MongoDB Connected! Using database: ${conn.connection.name}`);
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    throw err;
  }

  process.on("SIGINT", async () => {
    await mongoose.connection.close();
    console.log("🔌 MongoDB disconnected on app termination");
    process.exit(0);
  });
};