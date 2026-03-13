import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export interface JwtPayload {
  userId: number;
}

export function generateAccessToken(payload: JwtPayload): string {
  // Extended to 7 days for cross-origin Vercel+Render deployment
  // (short expiry causes refresh failures since the refresh_token cookie
  //  is not reliably sent cross-origin in all browsers/configs)
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, { expiresIn: '7d' });
}

export function generateRefreshToken(payload: JwtPayload): string {
  // 30 days as specified
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: '30d' });
}

export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload;
}

export function verifyRefreshToken(token: string): JwtPayload {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as JwtPayload;
}
