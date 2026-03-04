import cors from 'cors';
import { env } from './env';

const origins = (env.FRONTEND_URL || env.CORS_ORIGIN || 'http://localhost:3000').split(',').map(o => o.trim());
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
