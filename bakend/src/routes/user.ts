import { Router, type Request, type Response } from 'express';
import { authRequired } from '../middleware.js';
import prisma from '../prisma.js';

const router = Router();
type AuthedRequest = Request & { user: { id: string; role: string } };

router.get('/me', authRequired, async (req: Request, res: Response) => {
  const userId = (req as AuthedRequest).user.id;
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, name: true, email: true, role: true } });
  res.json(user);
});

router.get('/wallet', authRequired, async (req: Request, res: Response) => {
  const userId = (req as AuthedRequest).user.id;
  const transactions = await prisma.pointsTransaction.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
  const balance = transactions.reduce(
    (sum: number, t: (typeof transactions)[number]) => sum + (t.type === 'earn' ? t.points : -t.points),
    0
  );
  res.json({ balance, transactions });
});

router.get('/bins', async (_req: Request, res: Response) => {
  const bins = await prisma.bin.findMany({ select: { binId: true, lat: true, lng: true, status: true, capacityUsed: true, acceptsRecycling: true } });
  res.json(bins);
});

router.get('/rewards', async (_req: Request, res: Response) => {
  const rewards = await prisma.reward.findMany({ orderBy: { createdAt: 'desc' } });
  res.json(rewards);
});

export default router;