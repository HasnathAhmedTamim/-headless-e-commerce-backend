
import express from 'express';
import { addToCart, createCart } from '../controllers/cart';

const router = express.Router();

// POST /api/carts - create a new cart
router.post('/', createCart);

// POST /api/cart/add
router.post('/add', addToCart);

export default router;
