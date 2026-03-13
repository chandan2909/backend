import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.warn(`[Auth] Missing/Invalid Token format on ${req.method} ${req.originalUrl} - Header: ${authHeader}`);
      return res.status(401).json({ error: 'Unauthorized: Missing or invalid token format' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);

    (req as any).user = decoded; // Attach user payload to request
    next();
  } catch (error) {
    console.error(`[Auth] Token Error on ${req.method} ${req.originalUrl}:`, error);
    return res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
  }
};
