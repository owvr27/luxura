import { Router, type Request, type Response } from 'express';
import { z } from 'zod';
import crypto from 'crypto';
import prisma from '../prisma.js';

const router = Router();

const opSchema = z.object({
  binId: z.string().min(4),
  weight: z.number().positive().max(1000),
  timestamp: z.string().datetime(),
  apiKey: z.string().min(32),
  nonce: z.string().min(16),
  signature: z.string().regex(/^[a-f0-9]+$/i),
});
type OperationPayload = z.infer<typeof opSchema>;

router.post('/iot/operation', async (req: Request<unknown, unknown, OperationPayload>, res: Response) => {
  const parsed = opSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid payload' });

  const bin = await prisma.bin.findUnique({ where: { binId: parsed.data.binId } });
  if (!bin || bin.apiKey !== parsed.data.apiKey) return res.status(401).json({ error: 'Unauthorized device' });

  const timestamp = new Date(parsed.data.timestamp);
  if (Number.isNaN(timestamp.getTime())) return res.status(400).json({ error: 'Timestamp must be ISO 8601' });
  const driftMs = Math.abs(Date.now() - timestamp.getTime());
  if (driftMs > 5 * 60 * 1000) return res.status(400).json({ error: 'Timestamp skew too large' });

  const msg = `${parsed.data.binId}|${parsed.data.weight}|${parsed.data.timestamp}|${parsed.data.nonce}`;
  const hmac = crypto.createHmac('sha256', bin.apiKey).update(msg).digest('hex');
  const provided = Buffer.from(parsed.data.signature, 'hex');
  const expected = Buffer.from(hmac, 'hex');
  if (provided.length !== expected.length || !crypto.timingSafeEqual(provided, expected)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  const nonceExists = await prisma.operation.findUnique({ where: { nonce: parsed.data.nonce } });
  if (nonceExists) return res.status(409).json({ error: 'Replay detected' });

  const codeId = crypto.randomUUID();
  const points = Math.round(parsed.data.weight * 10);
  const op = await prisma.operation.create({
    data: {
      codeId,
      binId: parsed.data.binId,
      weight: parsed.data.weight,
      timestamp,
      points,
      status: 'Unused',
      expiresAt: new Date(Date.now() + 24 * 3600 * 1000),
      hmac,
      nonce: parsed.data.nonce,
    }
  });

  await prisma.bin.update({
    where: { binId: parsed.data.binId },
    data: {
      lastOperationAt: timestamp,
      capacityUsed: { increment: parsed.data.weight },
    },
  });

  res.json({ code: op.codeId });
});

export default router;