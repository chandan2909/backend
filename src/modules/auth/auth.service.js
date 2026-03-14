import { userRepository } from '../users/user.model.js';
import { hashPassword, comparePassword } from '../../utils/password.js';
import { generateAccessToken, generateRefreshToken } from '../../utils/jwt.js';
import { refreshTokenRepository } from './refreshToken.repository.js';
import crypto from 'crypto';

export const authService = {
  async register(email, passwordPlain, name) {
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('Email already in use');
    }

    const hashed = await hashPassword(passwordPlain);
    const userId = await userRepository.create(email, hashed, name);

    return this.generateTokensForUser(userId);
  },

  async login(email, passwordPlain) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValid = await comparePassword(passwordPlain, user.password_hash);
    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    return this.generateTokensForUser(user.id);
  },

  async refresh(refreshToken) {
    const hash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    const tokenRecord = await refreshTokenRepository.findByHash(hash);
    
    if (!tokenRecord) {
      throw new Error('Invalid or expired refresh token');
    }

    const accessToken = generateAccessToken({ userId: tokenRecord.user_id });
    return { accessToken };
  },

  async logout(refreshToken) {
    const hash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    await refreshTokenRepository.revoke(hash);
  },

  async generateTokensForUser(userId) {
    const accessToken = generateAccessToken({ userId });
    const refreshToken = generateRefreshToken({ userId });

    const hash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 days

    await refreshTokenRepository.create(userId, hash, expiresAt);

    return { accessToken, refreshToken };
  }
};
