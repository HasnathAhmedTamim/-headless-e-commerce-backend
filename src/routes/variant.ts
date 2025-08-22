import express from 'express';
import Variant from '../models/Variant';

const router = express.Router();

// GET /api/variants - list all variants
router.get('/', async (req, res) => {
  try {
    const variants = await Variant.find();
    res.json({ variants });
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
  }
});

export default router;
