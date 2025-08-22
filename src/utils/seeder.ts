import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../models/Product";
import Promo from "../models/Promo";

dotenv.config();

async function seed() {
  await mongoose.connect(process.env.MONGO_URI || "");

  await Product.deleteMany({});
  await Promo.deleteMany({});
  const Variant = (await import("../models/Variant")).default;
  await Variant.deleteMany({});

  // Create products first
  const tshirt = await Product.create({ name: "T-shirt" });
  const shoes = await Product.create({ name: "Shoes" });

  // Create variants for each product
  await Variant.create([
    { productId: tshirt._id, title: "M", price: 20, currency: "BDT", stock: 100 },
    { productId: tshirt._id, title: "L", price: 22, currency: "BDT", stock: 100 },
    { productId: shoes._id, title: "9", price: 50, currency: "BDT", stock: 50 },
    { productId: shoes._id, title: "10", price: 55, currency: "BDT", stock: 50 }
  ]);

  await Promo.create([
    {
      code: "SUMMER10",
      discountType: "percent",
      amount: 10,
      validFrom: new Date(),
      validTo: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
    },
    {
      code: "WELCOME5",
      discountType: "fixed",
      amount: 5,
      validFrom: new Date(),
      validTo: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
    },
    {
      code: "HASNATH25",
      discountType: "percent",
      amount: 25,
      validFrom: new Date(),
      validTo: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
    }
  ]);

  console.log("Seeded products and promos");
  await mongoose.disconnect();
}

seed();
