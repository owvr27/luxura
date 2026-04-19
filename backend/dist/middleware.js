import jwt from 'jsonwebtoken';
import env from './config.js';
export function authRequired(req, res, next) {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token)
        return res.status(401).json({ error: 'Unauthorized' });
    try {
        const payload = jwt.verify(token, env.JWT_SECRET);
        req.user = payload;
        next();
    }
    catch {
        return res.status(401).json({ error: 'Invalid token' });
    }
}
export function adminOnly(req, res, next) {
    const user = req.user;
    if (!user || user.role !== 'admin')
        return res.status(403).json({ error: 'Forbidden' });
    next();
}
