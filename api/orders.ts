
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectDB } from '../src/config/db';
import Order from '../src/models/Order';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await connectDB();
  if (req.method === 'GET') {
    try {
      const orders = await Order.find();
      res.status(200).json({ orders });
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch orders', details: err instanceof Error ? err.message : String(err) });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
