import request from "supertest";
import app from "../src/app";
import mongoose from "mongoose";
import { connectDB } from "../src/config/db";
import Variant from "../src/models/Variant";
import Cart from "../src/models/Cart";

jest.setTimeout(15000);

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Cart Items API", () => {
  let cartId: string;
  let variantId: string;
  let itemId: string;

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
  });

  it("should add an item to the cart", async () => {
    const res = await request(app)
      .post(`/api/carts/${cartId}/items`)
      .send({ variantId, quantity: 2 });
    expect(res.statusCode).toBe(200);
    expect(res.body.cart.items.length).toBeGreaterThan(0);
    itemId = res.body.cart.items[0]._id;
  });

  it("should update item quantity", async () => {
    const res = await request(app)
      .patch(`/api/carts/${cartId}/items/${itemId}`)
      .send({ quantity: 5 });
    expect(res.statusCode).toBe(200);
    expect(res.body.cart.items[0].quantity).toBe(5);
  });

  it("should remove item from cart", async () => {
    const res = await request(app)
      .delete(`/api/carts/${cartId}/items/${itemId}`)
      .send();
    expect(res.statusCode).toBe(200);
    expect(res.body.cart.items.length).toBe(0);
  });
});
