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
		{
			code: "WELCOME5",
			discountType: "fixed",
			amount: 5,
			validFrom: new Date("2025-08-22T11:05:22.364Z"),
			validTo: new Date("2025-09-21T11:05:22.364Z"),
			active: true
		},
		{
			code: "HASNATH25",
			discountType: "percent",
			amount: 25,
			validFrom: new Date("2025-08-22T11:05:22.364Z"),
			validTo: new Date("2025-09-21T11:05:22.364Z"),
			active: true
		},
		{
			code: "SUMMER10",
			discountType: "percent",
			amount: 10,
			validFrom: new Date("2025-08-22T11:05:22.364Z"),
			validTo: new Date("2025-09-21T11:05:22.364Z"),
			active: true
		}
	]);

	console.log("✅ Database seeded");
	process.exit(0);
})();
