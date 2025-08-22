
import request from "supertest";
import app from "../src/app";
import mongoose from "mongoose";
import { connectDB } from "../src/config/db";

jest.setTimeout(15000);

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Cart API", () => {
  let cartId: string;

  it("should create a new cart", async () => {
    const res = await request(app)
      .post("/api/carts")
      .send();
    expect(res.statusCode).toBe(201);
    expect(res.body.cart).toBeDefined();
    cartId = res.body.cart._id;
  });

  it("should fetch cart totals", async () => {
    const res = await request(app)
      .get(`/api/carts/${cartId}`)
      .send();
    expect(res.statusCode).toBe(200);
    expect(res.body.cart).toBeDefined();
    expect(res.body.totals).toBeDefined();
  });
});
