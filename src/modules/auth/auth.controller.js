
import asyncHandler from 'express-async-handler';
import { authService } from './auth.service.js';
import { cookieOptions } from '../../config/security.js';
import { userRepository } from '../users/user.model.js';

export const authController = {
  register: async (req, res) => {
    const { email, password, name } = req.body;
    try {
      const { accessToken, refreshToken } = await authService.register(email, password, name);
      res.cookie('refresh_token', refreshToken, cookieOptions);
      res.status(201).json({ accessToken });
    } catch (error) {
      res.status(400).json({ error: error.message || error });
    }
  },

  login: async (req, res) => {
    const { email, password } = req.body;
    try {
      const { accessToken, refreshToken } = await authService.login(email, password);
      res.cookie('refresh_token', refreshToken, cookieOptions);
      res.status(200).json({ accessToken });
    } catch (error) {
      res.status(401).json({ error: error.message || error });
    }
  },

  refresh: async (req, res) => {
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) {
      res.status(401).json({ error: 'No refresh token provided' });
      return;
    }
    try {
      const { accessToken } = await authService.refresh(refreshToken);
      res.status(200).json({ accessToken });
    } catch (error) {
      res.status(401).json({ error: error.message || error });
    }
  },

  logout: async (req, res) => {
    const refreshToken = req.cookies.refresh_token;
    if (refreshToken) {
      try {
        await authService.logout(refreshToken);
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
    res.clearCookie('refresh_token', cookieOptions);
    res.status(200).json({ message: 'Logged out successfully' });
  },

  me: async (req, res) => {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const user = await userRepository.findById(userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at
    });
  },

  deleteAccount: async (req, res) => {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    await userRepository.delete(userId);
    res.clearCookie('refresh_token', cookieOptions);
    res.status(200).json({ message: 'Account deleted successfully' });
  }
};
