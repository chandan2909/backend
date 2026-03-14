import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export function generateAccessToken(payload) {
  // Extended to 7 days for cross-origin Vercel+Render deployment
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, { expiresIn: '7d' });
}

export function generateRefreshToken(payload) {
  // 30 days
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: '30d' });
}

export function verifyAccessToken(token) {
  return jwt.verify(token, env.JWT_ACCESS_SECRET);
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, env.JWT_REFRESH_SECRET);
}
