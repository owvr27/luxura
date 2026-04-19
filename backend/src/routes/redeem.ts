import { Router, type Request, type Response } from 'express';
import { z } from 'zod';
import { authRequired } from '../middleware.js';
import prisma from '../prisma.js';

const router = Router();
type AuthedRequest = Request & { user: { id: string } };

const redeemSchema = z.object({ code: z.string().min(8) });

router.post('/redeem', authRequired, async (req: Request, res: Response) => {
  const parsed = redeemSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid code' });

  const op = await prisma.operation.findUnique({ where: { codeId: parsed.data.code } });
  if (!op) return res.status(404).json({ error: 'Code not found' });
  if (op.status !== 'Unused') return res.status(409).json({ error: 'Code already used' });
  if (op.expiresAt && op.expiresAt < new Date()) return res.status(410).json({ error: 'Code expired' });

  const userId = (req as AuthedRequest).user.id;

  await prisma.$transaction([
    prisma.operation.update({ where: { codeId: parsed.data.code }, data: { status: 'Used', redeemedByUserId: userId } }),
    prisma.pointsTransaction.create({ data: { userId, operationId: op.id, points: op.points, type: 'earn' } })
  ]);

  res.json({ success: true, pointsAdded: op.points });
});

export default router;