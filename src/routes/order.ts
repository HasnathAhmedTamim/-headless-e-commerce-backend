import express from 'express';
import { createOrder, listOrders, updateOrderStatus } from '../controllers/orderController';

const router = express.Router();

// POST /api/orders/create
router.post('/create', createOrder);

// GET /api/orders
router.get('/', listOrders);

// PATCH /api/orders/:id
router.patch('/:id', updateOrderStatus);

export default router;
