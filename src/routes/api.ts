import { Router } from "express";
import { addToCart, createCart, updateItem, removeItem, applyPromo, getAllCarts, getCart } from "../controllers/cart";
import { listProducts } from "../controllers/catalogController";
import { listPromos, applyPromo as applyPromoCode } from "../controllers/promoController";
import { createOrder, listOrders, updateOrderStatus } from "../controllers/orderController";
import { createOrder as checkoutOrder } from "../controllers/orderController";
import Variant from "../models/Variant";

const router = Router();

// Cart routes
router.post("/carts", createCart);
router.get("/carts", getAllCarts);
router.get("/carts/:id", getCart);
router.post("/carts/:id/items", addToCart);
router.patch("/carts/:id/items/:itemId", updateItem);
router.delete("/carts/:id/items/:itemId", removeItem);
router.post("/carts/:id/apply-promo", applyPromo);

// Catalog routes
router.get("/catalog", listProducts);

// Promo routes
router.post("/promo/apply", applyPromoCode);
router.get("/promo/all", listPromos);

// Order routes

router.post("/orders/create", createOrder);
router.get("/orders", listOrders);
router.patch("/orders/:id", updateOrderStatus);

// Checkout route
router.post("/checkout", checkoutOrder);

// Variant routes
router.get("/variants", async (req, res) => {
  try {
    const variants = await Variant.find();
    res.json({ variants });
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
  }
});

export default router;
