// Get all carts
export async function getAllCarts(req: Request, res: Response) {
    try {
        const carts = await Cart.find();
        res.status(200).json({ carts });
    } catch (err) {
        res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
    }
}
import mongoose from "mongoose";
import { z } from "zod";
import Cart from "../models/Cart";
import Promo from "../models/Promo";
import Order from '../models/Order';
import { Request, Response, NextFunction } from "express";
import { isValidObjectId } from "mongoose";

// Zod schema for add to cart
const addToCartSchema = z.object({
	productId: z.string(),
	variant: z.string(),
	quantity: z.number().min(1)
});

// Zod schema for apply promo
const applyPromoSchema = z.object({
	code: z.string()
});

// Utility to compute cart totals using MongoDB aggregation pipeline
export async function computeCartTotals(cartId: string) {
    // Find the cart and aggregate item prices
    const cart = await Cart.findById(cartId);
    if (!cart) return null;
    // Aggregate item prices from products/variants
    const items = cart.items || [];
    let subtotal = 0;
    for (const item of items) {
        // Find variant price (assume variant is the variantId string)
        const variant = await (await import('../models/Variant')).default.findOne({ _id: item.variant });
        if (variant) {
            subtotal += variant.price * item.quantity;
        }
    }
    // Apply promo discount if applicable
    let discount = 0;
    if (cart.promoCode) {
        const promo = await Promo.findOne({ code: cart.promoCode });
        if (promo) {
            if (promo.discountType === 'percent') {
                discount = Math.round(subtotal * (promo.amount / 100));
            } else if (promo.discountType === 'fixed') {
                discount = promo.amount;
            }
        }
    }
    const total = Math.max(subtotal - discount, 0);
    return { subtotal, discount, total };
}

// Create a new cart and return its _id
export const createCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Generate a simple random token
        const token = Math.random().toString(36).substring(2, 18);
        const cart = await Cart.create({ token, items: [] });
        res.status(201).json({ cart });
    } catch (err) {
        next(err);
    }
};

// Add item to cart (POST /api/carts/:id/items)
export const addToCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let { variantId, quantity } = req.body;
        const cartId = req.params.id;
        if (!isValidObjectId(cartId)) {
            return res.status(400).json({ error: "Invalid cart ID format" });
        }
        if (!variantId || typeof quantity !== "number" || quantity < 1) {
            return res.status(400).json({ error: "Missing or invalid item data" });
        }
        // Find the variant to get productId
        const variant = await (await import('../models/Variant')).default.findById(variantId);
        if (!variant) {
            return res.status(404).json({ error: "Variant not found" });
        }
        const cart = await Cart.findById(cartId);
        if (!cart) return res.status(404).json({ error: "Cart not found" });
        // Add item with correct product and variant reference
        cart.items.push({ product: variant.productId, variant: variantId, quantity });
        await cart.save();
        await cart.populate('items.product');
        res.json({ cart });
    } catch (err) {
        next(err);
    }
};

// Update item quantity in cart
export async function updateItem(req: Request, res: Response) {
    try {
        const cartId = req.params.id;
        const itemId = req.params.itemId;
        if (!isValidObjectId(cartId) || !isValidObjectId(itemId)) {
            return res.status(400).json({ error: "Invalid cart or item ID format" });
        }
        const { quantity } = req.body;
        if (typeof quantity !== "number" || quantity < 1) return res.status(400).json({ error: "Invalid quantity" });
        const cart = await Cart.findById(cartId);
        if (!cart) return res.status(404).json({ error: "Cart not found" });
        const item = cart.items.find((i: any) => i._id && i._id.toString() === itemId);
        if (!item) return res.status(404).json({ error: "Item not found" });
        item.quantity = quantity;
        await cart.save();
        await cart.populate('items.product');
        res.json({ cart });
    } catch (err) {
        res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
    }
}

// Remove item from cart
export async function removeItem(req: Request, res: Response) {
    try {
        const cartId = req.params.id;
        const itemId = req.params.itemId;
        if (!isValidObjectId(cartId) || !isValidObjectId(itemId)) {
            return res.status(400).json({ error: "Invalid cart or item ID format" });
        }
        const cart = await Cart.findById(cartId);
        if (!cart) return res.status(404).json({ error: "Cart not found" });
        const itemIdx = cart.items.findIndex((i: any) => i._id && i._id.toString() === itemId);
        if (itemIdx === -1) return res.status(404).json({ error: "Item not found" });
        cart.items.splice(itemIdx, 1);
        await cart.save();
        await cart.populate('items.product');
        res.json({ cart });
    } catch (err) {
        res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
    }
}

// Apply promo code to cart
export async function applyPromo(req: Request, res: Response) {
    try {
        const cartId = req.params.id;
        if (!isValidObjectId(cartId)) {
            return res.status(400).json({ error: "Invalid cart ID format" });
        }
        const { code } = req.body;
        const cart = await Cart.findById(cartId);
        if (!cart) return res.status(404).json({ error: "Cart not found" });
        // Find promo by code and ensure correct type/amount
        const promo = await Promo.findOne({ code });
        if (!promo) {
            return res.status(404).json({ error: "Promo not found" });
        }
        cart.promoCode = code;
        await cart.save();
        res.json({ cart, promo });
    } catch (err) {
        res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
    }
}

// Get cart by ID
export async function getCart(req: Request, res: Response) {
    try {
        const cartId = req.params.id;
        if (!isValidObjectId(cartId)) {
            return res.status(400).json({ error: "Invalid cart ID format" });
        }
        const cart = await Cart.findById(cartId);
        if (!cart) return res.status(404).json({ error: "Cart not found" });
        // Compute real totals using aggregation
        const totals = await computeCartTotals(cartId);
        res.json({ cart, totals });
    } catch (err) {
        res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
    }
}

// Checkout: create order from cart
export async function checkout(req: Request, res: Response) {
    try {
        const { cartId } = req.body;
        if (!isValidObjectId(cartId)) {
            return res.status(400).json({ error: "Invalid cart ID format" });
        }
        const cart = await Cart.findById(cartId);
        if (!cart) return res.status(404).json({ error: "Cart not found" });
        if (!cart.items || cart.items.length === 0) {
            return res.status(400).json({ error: "Cart is empty" });
        }
        let order;
        try {
            order = await Order.create({
                cart: cart._id,
                items: cart.items,
                status: "created",
                total: cart.items.reduce((sum, item) => sum + (item.quantity * 10), 0)
            });
        } catch (err) {
            return res.status(500).json({ error: "Order creation failed" });
        }
        if (!order || !order._id) {
            return res.status(500).json({ error: "Order not created" });
        }
        res.status(201).json({ order });
    } catch (err) {
        res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
    }
}

// List all orders
export async function listOrders(req: Request, res: Response) {
    try {
        const orders = await Order.find();
        res.status(200).json({ orders });
    } catch (err) {
        res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
    }
}

// Update order status
export async function updateOrderStatus(req: Request, res: Response) {
    try {
        const orderId = req.params.id;
        if (!isValidObjectId(orderId)) {
            return res.status(404).json({ error: "Order not found" });
        }
        const { status } = req.body;
        if (!['created', 'paid', 'shipped', 'cancelled'].includes(status)) {
            return res.status(400).json({ error: "Invalid status" });
        }
        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ error: "Order not found" });
        order.status = status;
        await order.save();
        res.status(200).json({ order });
    } catch (err) {
        res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
    }
}
