

// Register OpenAPI paths for all endpoints (after all schema/registry declarations)
// ...existing code...
// (insert all registry.registerPath calls here, after schema and registry setup)
// Express app setup
import express from "express";
import cookieParser from "cookie-parser";
import router from "./routes/index";
import { validate } from "./middleware/validate";
import errorHandler from "./middleware/errorHandler";

const app = express();

app.use(express.json());
app.use(cookieParser());

// OpenAPI docs setup
import swaggerUi from "swagger-ui-express";
import { OpenAPIRegistry, OpenApiGeneratorV3, extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import * as schemas from "./domain/schemas";

extendZodWithOpenApi(z);

const registry = new OpenAPIRegistry();
const AddItemSchema = registry.register(
	"AddItem",
	schemas.addItemSchema.openapi("AddItem", { description: "Add item to cart" })
);
const ApplyPromoSchema = registry.register(
	"ApplyPromo",
	schemas.applyPromoSchema.openapi("ApplyPromo", { description: "Apply promo code" })
);
const CartItemSchema = registry.register(
	"CartItem",
	schemas.cartItemSchema.openapi("CartItem", { description: "Cart item" })
);
const CartSchema = registry.register(
	"Cart",
	schemas.cartSchema.openapi("Cart", { description: "Cart" })
);
const ProductSchema = registry.register(
	"Product",
	schemas.productSchema.openapi("Product", { description: "Product" })
);
const VariantSchema = registry.register(
	"Variant",
	schemas.variantSchema.openapi("Variant", { description: "Product variant" })
);
const PromoSchema = registry.register(
	"Promo",
	schemas.promoSchema.openapi("Promo", { description: "Promo code" })
);
const OrderItemSchema = registry.register(
	"OrderItem",
	schemas.orderItemSchema.openapi("OrderItem", { description: "Order item" })
);
const OrderSchema = registry.register(
	"Order",
	schemas.orderSchema.openapi("Order", { description: "Order" })
);

const generator = new OpenApiGeneratorV3([
	AddItemSchema,
	ApplyPromoSchema,
	CartItemSchema,
	CartSchema,
	ProductSchema,
	VariantSchema,
	PromoSchema,
	OrderItemSchema,
	OrderSchema
]);
const openApiDoc = generator.generateDocument({
	openapi: "3.0.0",
	info: {
		title: "Headless Shop API",
		version: "1.0.0",
		description: "OpenAPI documentation for Headless Shop API."
	}
});
app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiDoc));

// Main API routes
app.use("/api", router);

// Error handler middleware
app.use(errorHandler);

export default app;
