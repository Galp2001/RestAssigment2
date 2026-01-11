import type { Request, Response, NextFunction } from 'express';
const { verifyAccessToken } = require('../utils/jwt');

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const auth = req.headers.authorization as string | undefined;
    if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });
    const token = auth.slice(7);
    const payload = verifyAccessToken(token);
    // attach minimal user info
    (req as any).user = { id: payload.sub, username: payload.username };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}
