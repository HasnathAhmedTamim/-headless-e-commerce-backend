import express from 'express';
import { createOrder } from '../controllers/orderController';

const router = express.Router();

// POST /api/checkout - create order from cart
router.post('/', createOrder);

export default router;
