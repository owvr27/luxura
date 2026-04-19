import { Router, type Request, type Response } from 'express';
import { adminOnly, authRequired } from '../middleware.js';
import { z } from 'zod';
import { randomBytes } from 'crypto';
import prisma from '../prisma.js';

const router = Router();

// Dashboard metrics
router.get('/admin/dashboard', authRequired, adminOnly, async (_req: Request, res: Response) => {
  const [users, ops, bins, pointsSum] = await Promise.all([
    prisma.user.count(),
    prisma.operation.count(),
    prisma.bin.count(),
    prisma.pointsTransaction.aggregate({ _sum: { points: true } })
  ]);
  res.json({
    totalUsers: users,
    totalOperations: ops,
    totalBins: bins,
    pointsDistributed: pointsSum._sum.points || 0
  });
});

// Manage bins
const binSchema = z.object({
  binId: z.string().min(4),
  lat: z.number().refine((val) => val >= -90 && val <= 90, 'Latitude out of bounds'),
  lng: z.number().refine((val) => val >= -180 && val <= 180, 'Longitude out of bounds'),
  status: z.enum(['Available', 'PartiallyFull', 'Full', 'Offline']).optional(),
  acceptsRecycling: z.boolean().optional(),
});
type BinPayload = z.infer<typeof binSchema>;
router.post('/admin/bins', authRequired, adminOnly, async (req: Request<unknown, unknown, BinPayload>, res: Response) => {
  const parsed = binSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid bin data' });
  const apiKey = randomBytes(32).toString('hex');
  try {
    const bin = await prisma.bin.create({
      data: {
        ...parsed.data,
        capacityUsed: 0,
        acceptsRecycling: parsed.data.acceptsRecycling ?? true,
        apiKey,
      },
    });
    res.json(bin);
  } catch (err) {
    if (err instanceof Error && err.message.includes('Unique constraint failed')) {
      return res.status(409).json({ error: 'Bin ID already exists' });
    }
    throw err;
  }
});

router.get('/admin/operations', authRequired, adminOnly, async (_req: Request, res: Response) => {
  const ops = await prisma.operation.findMany({ orderBy: { timestamp: 'desc' } });
  res.json(ops);
});

export default router;