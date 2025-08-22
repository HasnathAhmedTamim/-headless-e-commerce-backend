import request from "supertest";
import app from "../src/app";
import mongoose from "mongoose";
import { connectDB } from "../src/config/db";
import Variant from "../src/models/Variant";

jest.setTimeout(15000);

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Cart Promo API", () => {
  let cartId: string;
  let variantId: string;

  beforeAll(async () => {
    // Create a cart
    const cartRes = await request(app)
      .post("/api/carts")
      .send();
    cartId = cartRes.body.cart._id;

    // Get a variant from DB (assumes seed data exists)
    const variant = await Variant.findOne();
    if (!variant) throw new Error("No variant found. Please seed the database.");
    variantId = variant._id.toString();

    // Add item to cart
    await request(app)
      .post(`/api/carts/${cartId}/items`)
      .send({ variantId, quantity: 2 });
  });

  it("should apply a valid promo code", async () => {
    const res = await request(app)
      .post(`/api/carts/${cartId}/apply-promo`)
      .send({ code: "HASNATH25" });
    expect(res.statusCode).toBe(200);
    expect(res.body.cart.promoCode).toBe("HASNATH25");
    expect(res.body.promo).toBeDefined();
  });

  it("should reject an invalid promo code", async () => {
    const res = await request(app)
      .post(`/api/carts/${cartId}/apply-promo`)
      .send({ code: "INVALIDCODE" });
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toMatch(/Promo not found/);
  });
});
