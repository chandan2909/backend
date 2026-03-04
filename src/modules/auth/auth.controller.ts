import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { authService } from './auth.service';
import { cookieOptions } from '../../config/security';
import { userRepository } from '../users/user.model';

export const authController = {
  register: asyncHandler(async (req: Request, res: Response) => {
    const { email, password, name } = req.body;
    try {
      const { accessToken, refreshToken } = await authService.register(email, password, name);
      res.cookie('refresh_token', refreshToken, cookieOptions);
      res.status(201).json({ accessToken });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }),

  login: asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
      const { accessToken, refreshToken } = await authService.login(email, password);
      res.cookie('refresh_token', refreshToken, cookieOptions);
      res.status(200).json({ accessToken });
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  }),

  refresh: asyncHandler(async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) {
      res.status(401).json({ error: 'No refresh token provided' });
      return;
    }
    try {
      const { accessToken } = await authService.refresh(refreshToken);
      res.status(200).json({ accessToken });
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  }),

  logout: asyncHandler(async (req: Request, res: Response) => {
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
  }),

  me: asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId;
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
  }),

  deleteAccount: asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    await userRepository.delete(userId);
    res.clearCookie('refresh_token', cookieOptions);
    res.status(200).json({ message: 'Account deleted successfully' });
  })
};
