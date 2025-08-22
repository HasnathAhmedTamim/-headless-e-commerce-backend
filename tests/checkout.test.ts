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

describe("Checkout API", () => {
  let cartId: string;
  let variantId: string;
  let orderId: string;

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

  it("should create an order from cart", async () => {
    const res = await request(app)
      .post("/api/checkout")
      .send({ cartId });
    expect(res.statusCode).toBe(201);
    expect(res.body.order).toBeDefined();
    expect(res.body.order.status).toBe("created");
    orderId = res.body.order._id;
  });

  it("should not create order from empty cart", async () => {
    // Try to checkout the same cart again (should be empty now)
    const res = await request(app)
      .post("/api/checkout")
      .send({ cartId });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/Cart is empty/);
  });
});
