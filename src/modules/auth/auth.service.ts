import { userRepository } from '../users/user.model';
import { hashPassword, comparePassword } from '../../utils/password';
import { generateAccessToken, generateRefreshToken } from '../../utils/jwt';
import { refreshTokenRepository } from './refreshToken.repository';
import crypto from 'crypto';

export const authService = {
  async register(email: string, passwordPlain: string, name: string) {
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('Email already in use');
    }

    const hashed = await hashPassword(passwordPlain);
    const userId = await userRepository.create(email, hashed, name);

    return this.generateTokensForUser(userId);
  },

  async login(email: string, passwordPlain: string) {
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

  async refresh(refreshToken: string) {
    const hash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    const tokenRecord = await refreshTokenRepository.findByHash(hash);
    
    if (!tokenRecord) {
      throw new Error('Invalid or expired refresh token');
    }

    const accessToken = generateAccessToken({ userId: tokenRecord.user_id });
    return { accessToken };
  },

  async logout(refreshToken: string) {
    const hash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    await refreshTokenRepository.revoke(hash);
  },

  async generateTokensForUser(userId: number) {
    const accessToken = generateAccessToken({ userId });
    const refreshToken = generateRefreshToken({ userId });

    const hash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 days

    await refreshTokenRepository.create(userId, hash, expiresAt);

    return { accessToken, refreshToken };
  }
};
