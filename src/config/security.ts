import cors from 'cors';
import { env } from './env';

export const corsOptions = {
  origin: env.CORS_ORIGIN,
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
