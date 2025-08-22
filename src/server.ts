// Entry point for Express server
import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import app from "./app";

dotenv.config();

const PORT = process.env.PORT || 5000;

connectDB()
	.then(() => {
		app.listen(PORT, () => {
			console.log(`Server running on port ${PORT}`);
		});
	})
	.catch((err) => {
		console.error("Failed to connect to DB", err);
		process.exit(1);
	});
