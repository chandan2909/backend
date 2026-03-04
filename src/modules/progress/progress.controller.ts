import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { progressRepository } from './progress.repository';

export const progressController = {
  getOverview: asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user!.userId;
    const overview = await progressRepository.getProgressOverview(userId);
    res.json(overview);
  }),

  getSubjectProgress: asyncHandler(async (req: Request, res: Response) => {
    const subjectId = parseInt(req.params.subjectId as string, 10);
    const userId = (req as any).user!.userId;

    const progress = await progressRepository.getSubjectProgress(subjectId, userId);
    res.json(progress);
  }),

  getVideoProgress: asyncHandler(async (req: Request, res: Response) => {
    const videoId = parseInt(req.params.videoId as string, 10);
    const userId = (req as any).user!.userId;

    const progress = await progressRepository.getVideoProgress(videoId, userId);
    res.json(progress);
  }),

  upsertVideoProgress: asyncHandler(async (req: Request, res: Response) => {
    const videoId = parseInt(req.params.videoId as string, 10);
    const userId = (req as any).user!.userId;
    const { last_position_seconds, is_completed } = req.body;

    if (typeof last_position_seconds !== 'number') {
      res.status(400).json({ error: 'last_position_seconds must be a number' });
      return;
    }

    await progressRepository.upsertVideoProgress(videoId, userId, last_position_seconds, is_completed);
    res.json({ success: true });
  })
};
