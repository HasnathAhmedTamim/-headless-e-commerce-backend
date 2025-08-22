import express from 'express';
import { applyPromo, listPromos } from '../controllers/promoController';

const router = express.Router();

// POST /api/promo/apply
router.post('/apply', applyPromo);

// GET /api/promo/all
router.get('/all', listPromos);

export default router;
