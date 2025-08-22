import { Request, Response } from "express";
import Product from "../models/Product";

// GET /api/catalog - list all products
export const listProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
  }
};
