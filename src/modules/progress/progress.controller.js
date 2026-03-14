import asyncHandler from 'express-async-handler';
import { progressRepository } from './progress.repository.js';

export const progressController = {
  getOverview: async (req, res) => {
    const userId = req.user.userId;
    const overview = await progressRepository.getProgressOverview(userId);
    res.json(overview);
  },
  getSubjectProgress: async (req, res) => {
    const subjectId = parseInt(req.params.subjectId, 10);
    const userId = req.user.userId;

    const progress = await progressRepository.getSubjectProgress(subjectId, userId);
    res.json(progress);
  },
  getVideoProgress: async (req, res) => {
    const videoId = parseInt(req.params.videoId, 10);
    const userId = req.user.userId;

    const progress = await progressRepository.getVideoProgress(videoId, userId);
    res.json(progress);
  },
  upsertVideoProgress: async (req, res) => {
    const videoId = parseInt(req.params.videoId, 10);
    const userId = req.user.userId;
    const { last_position_seconds, is_completed } = req.body;

    if (typeof last_position_seconds !== 'number') {
      res.status(400).json({ error: 'last_position_seconds must be a number' });
      return;
    }

    await progressRepository.upsertVideoProgress(videoId, userId, last_position_seconds, is_completed);
    res.json({ success: true });
  }
};
