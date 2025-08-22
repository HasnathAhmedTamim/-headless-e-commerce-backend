export const listPromos = async (req: Request, res: Response) => {
  try {
    const promos = await Promo.find();
    res.json(promos);
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
  }
};
import { Request, Response } from "express";
import Promo from "../models/Promo";

// POST /api/promo/apply - apply a promo code
export const applyPromo = async (req: Request, res: Response) => {
  try {
    const { code } = req.body;
    const promo = await Promo.findOne({ code, active: true });
    if (!promo) return res.status(404).json({ error: "Promo not found or inactive" });
    res.json(promo);
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
  }
};
