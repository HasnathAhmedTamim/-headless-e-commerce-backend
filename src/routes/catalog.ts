import express from 'express';
import { listProducts } from '../controllers/catalogController';

const router = express.Router();

// GET /api/catalog
router.get('/', listProducts);

export default router;
