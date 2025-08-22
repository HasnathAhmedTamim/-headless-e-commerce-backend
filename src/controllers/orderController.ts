import { Request, Response } from "express";
import mongoose from "mongoose";
import Order from "../models/Order";
import Cart from "../models/Cart";
import { computeCartTotals } from "./cart";

// POST /api/checkout - create order from cart
export const createOrder = async (req: Request, res: Response) => {
  try {
    const { cartId } = req.body;
    if (!cartId || !mongoose.Types.ObjectId.isValid(cartId)) return res.status(400).json({ error: "Invalid cart ID" });
    const cart = await Cart.findById(cartId);
    if (!cart) return res.status(404).json({ error: "Cart not found" });
    // Check for empty cart scenarios
    if (!cart.items || !Array.isArray(cart.items) || cart.items.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }
    // Compute real totals using aggregation
    const { subtotal, discount, total } = await computeCartTotals(cartId) || { subtotal: 0, discount: 0, total: 0 };
    // Create order with cart items and totals
    const order = await Order.create({ cart: cart._id, items: cart.items, status: "created", total });
    // Clear cart items after order creation
    cart.items = [];
    await cart.save();
    res.status(201).json({ order });
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
  }
};

// GET /api/order - list all orders
export const listOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find();
    res.status(200).json({ orders });
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
  }
};

// PATCH /api/order/:id/status - update order status
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!['created', 'paid', 'shipped', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }
    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.status(200).json({ order });
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
  }
};
