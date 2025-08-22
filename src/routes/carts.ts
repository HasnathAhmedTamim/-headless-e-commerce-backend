import express from 'express';
import { addToCart, createCart, updateItem, removeItem, applyPromo, getAllCarts } from '../controllers/cart';

const router = express.Router();


// POST /api/carts - create a new cart
router.post('/', createCart);
// GET /api/carts - list all carts
router.get('/', getAllCarts);

// GET /api/carts/:id - get cart and totals
import { getCart } from '../controllers/cart';
router.get('/:id', getCart);

// POST /api/carts/:id/items - add item to cart
router.post('/:id/items', addToCart);

// PATCH /api/carts/:id/items/:itemId - update item quantity
router.patch('/:id/items/:itemId', updateItem);

// DELETE /api/carts/:id/items/:itemId - remove item from cart
router.delete('/:id/items/:itemId', removeItem);

// POST /api/carts/:id/apply-promo - apply promo code
router.post('/:id/apply-promo', applyPromo);

export default router;
