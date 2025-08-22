import mongoose from "mongoose";
import { connectDB } from "./config/db";
import Product from "./models/Product";
import Variant from "./models/Variant";
import Promo from "./models/Promo";

(async () => {
	await connectDB();
	await Product.deleteMany({});
	await Variant.deleteMany({});
	await Promo.deleteMany({});

	const product = await Product.create({ title: "T-Shirt", description: "Basic tee" });
	await Variant.create([
		{ productId: product._id, title: "Black M", price: 1200, attributes: { color:"black", size:"M" }, stock:20 },
		{ productId: product._id, title: "White L", price: 1500, attributes: { color:"white", size:"L" }, stock:10 }
	]);

	await Promo.create([
		{ code: "SAVE10", type:"percent", value:10, startsAt:new Date("2025-01-01"), endsAt:new Date("2025-12-31"), active:true },
		{ code: "FLAT200", type:"fixed", value:200, startsAt:new Date("2025-01-01"), endsAt:new Date("2025-12-31"), active:true }
	]);

	console.log("✅ Database seeded");
	process.exit(0);
})();
