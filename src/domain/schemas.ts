import { z } from "zod";

export const addItemSchema = z.object({
	variantId: z.string().regex(/^[a-fA-F0-9]{24}$/),
	quantity: z.number().min(1)
});

export const applyPromoSchema = z.object({
	code: z.string().min(1)
});

export const cartItemSchema = z.object({
	variantId: z.string().regex(/^[a-fA-F0-9]{24}$/),
	quantity: z.number().min(1),
	snapshot: z.object({
		title: z.string(),
		price: z.number(),
		currency: z.string(),
		attributes: z.record(z.any()).optional()
	})
});

export const cartSchema = z.object({
	token: z.string(),
	items: z.array(cartItemSchema),
	promoCode: z.string().optional()
});

export const productSchema = z.object({
	title: z.string(),
	description: z.string().optional()
});

export const variantSchema = z.object({
	productId: z.string().regex(/^[a-fA-F0-9]{24}$/),
	title: z.string(),
	price: z.number(),
	currency: z.string(),
	stock: z.number(),
	attributes: z.record(z.string()).optional()
});

export const promoSchema = z.object({
	code: z.string(),
	type: z.enum(["percent", "fixed"]),
	value: z.number(),
	startsAt: z.string().optional(),
	endsAt: z.string().optional(),
	active: z.boolean(),
	timesRedeemed: z.number().optional()
});

export const orderItemSchema = cartItemSchema;

export const orderSchema = z.object({
	cartToken: z.string(),
	items: z.array(orderItemSchema),
	subtotal: z.number(),
	discount: z.number(),
	total: z.number(),
	status: z.enum(["created", "paid", "shipped"])
});
