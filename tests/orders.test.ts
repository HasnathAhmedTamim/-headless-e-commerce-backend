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

describe("Order Management API", () => {
  let cartId: string;
  let variantId: string;
  let orderId: string;

  beforeAll(async () => {
    // Create a cart and order
    const cartRes = await request(app)
      .post("/api/carts")
      .send();
    cartId = cartRes.body.cart._id;

    const variant = await Variant.findOne();
    if (!variant) throw new Error("No variant found. Please seed the database.");
    variantId = variant._id.toString();

    await request(app)
      .post(`/api/carts/${cartId}/items`)
      .send({ variantId, quantity: 2 });

    const orderRes = await request(app)
      .post("/api/checkout")
      .send({ cartId });
    orderId = orderRes.body.order._id;
  });

  it("should list all orders", async () => {
    const res = await request(app)
      .get("/api/orders")
      .send();
    expect(res.statusCode).toBe(200);
    expect(res.body.orders.length).toBeGreaterThan(0);
  });

  it("should update order status", async () => {
    const res = await request(app)
      .patch(`/api/orders/${orderId}`)
      .send({ status: "paid" });
    expect(res.statusCode).toBe(200);
    expect(res.body.order.status).toBe("paid");
  });

  it("should reject invalid status update", async () => {
    const res = await request(app)
      .patch(`/api/orders/${orderId}`)
      .send({ status: "invalid" });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/Invalid status/);
  });
});
