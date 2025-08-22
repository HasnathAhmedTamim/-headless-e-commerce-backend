
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectDB } from '../src/config/db';
import Order from '../src/models/Order';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    await connectDB();
    if (req.method === 'GET') {
      try {
        const orders = await Order.find();
        res.status(200).json({ orders });
      } catch (err) {
        console.error('Order fetch error:', err);
        res.status(500).json({ error: 'Failed to fetch orders', details: err instanceof Error ? err.message : String(err), stack: err instanceof Error ? err.stack : undefined });
      }
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (err) {
    console.error('MongoDB connection error:', err);
    res.status(500).json({ error: 'MongoDB connection error', details: err instanceof Error ? err.message : String(err), stack: err instanceof Error ? err.stack : undefined });
  }
}
