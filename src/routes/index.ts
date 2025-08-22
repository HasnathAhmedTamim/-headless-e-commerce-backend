import { Router } from "express";
import cartsRoutes from "./carts";
import catalogRoutes from "./catalog";
import promoRoutes from "./promo";
import orderRoutes from "./order";
import checkoutRoutes from "./checkout";
import variantRoutes from "./variant";

const router = Router();

router.use("/carts", cartsRoutes);
router.use("/catalog", catalogRoutes);
router.use("/promo", promoRoutes);
router.use("/orders", orderRoutes);
router.use("/checkout", checkoutRoutes);
router.use("/variants", variantRoutes);

export default router;
