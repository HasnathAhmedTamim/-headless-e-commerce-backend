import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../models/Product";
import Promo from "../models/Promo";

dotenv.config();

async function seed() {
  await mongoose.connect(process.env.MONGO_URI || "");

  await Product.deleteMany({});
  await Promo.deleteMany({});

  await Product.create([
    {
      name: "T-shirt",
      variants: [
        { name: "M", price: 20 },
        { name: "L", price: 22 }
      ]
    },
    {
      name: "Shoes",
      variants: [
        { name: "9", price: 50 },
        { name: "10", price: 55 }
      ]
    }
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
