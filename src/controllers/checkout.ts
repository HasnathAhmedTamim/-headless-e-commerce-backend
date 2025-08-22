import Order from "../models/Order";
// GET /orders → list all orders
export async function listOrders(req: Request, res: Response) {
	try {
		const orders = await Order.find().sort({ createdAt: -1 });
		res.json({ orders });
	} catch (err) {
		res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
	}
}

// PATCH /orders/:id → update order status
export async function updateOrderStatus(req: Request, res: Response) {
	try {
		const orderId = req.params.id;
		const { status } = req.body;
		if (!status || !["created", "paid", "shipped"].includes(status)) {
			return res.status(400).json({ error: "Invalid status" });
		}
		const order = await Order.findById(orderId);
		if (!order) return res.status(404).json({ error: "Order not found" });
		order.status = status;
		await order.save();
		res.json({ order });
	} catch (err) {
		res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
	}
}
import { Request, Response } from "express";

export async function createOrder(req: Request, res: Response) {
	try {
		const { cartId } = req.body;
		if (!cartId) return res.status(400).json({ error: "cartId required" });

		// Find cart
		const cart = await (await import("../models/Cart")).default.findById(cartId);
		if (!cart) return res.status(404).json({ error: "Cart not found" });
		if (!cart.items.length) return res.status(400).json({ error: "Cart is empty" });

		// Compute totals
		const { subtotal = 0, discount = 0, total = 0 } = await (await import("./cart")).computeCartTotals(cartId) || {};

		// Create order
		const Order = (await import("../models/Order")).default;
		const order = await Order.create({
			cartToken: cart.token,
			items: cart.items,
			subtotal,
			discount,
			total,
			status: "created"
		});

	// Optionally clear cart
	cart.items.splice(0, cart.items.length);
	await cart.save();

		res.status(201).json({ order });
	} catch (err) {
		res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
	}
}
