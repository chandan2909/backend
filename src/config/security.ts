import cors from 'cors';
import { env } from './env';

const rawOrigins = (env.FRONTEND_URL || env.CORS_ORIGIN || 'http://localhost:3000,http://localhost:5173,https://chandanpathak.dev,https://kodemy.chandanpathak.dev,https://frontend-react-steel.vercel.app').split(',').map(o => o.trim());
const origins = rawOrigins.map(origin => {
  if (origin.startsWith('http://') || origin.startsWith('https://')) {
    return origin;
  }
  // Default to https for production-like domains, http for localhost
  if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
    return `http://${origin}`;
  }
  return `https://${origin}`;
});

console.log('🛡️  CORS Origins allowed:', origins);

export const corsOptions = {
  origin: origins.length === 1 ? origins[0] : origins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

import type { CookieOptions } from 'express';

export const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'lax', // For local dev it's often better to use 'lax' or 'strict' if not https
  domain: env.COOKIE_DOMAIN,
};

// If in production, use sameSite: 'none' and secure: true for cross-domain cookies
if (env.NODE_ENV === 'production') {
  cookieOptions.sameSite = 'none';
  cookieOptions.secure = true;
}
