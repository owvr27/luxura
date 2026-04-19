import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import env from './config.js';

type JwtPayload = { id: string; role: string };
type AuthenticatedRequest = Request & { user?: JwtPayload };

export function authRequired(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    (req as AuthenticatedRequest).user = payload;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

export function adminOnly(req: Request, res: Response, next: NextFunction) {
  const user = (req as AuthenticatedRequest).user;
  if (!user || user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  next();
}