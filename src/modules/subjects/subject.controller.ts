import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { subjectRepository } from './subject.repository';

export const subjectController = {
  getPublishedSubjects: asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 20;
    const q = req.query.q as string;

    const subjects = await subjectRepository.findAllPublished(page, pageSize, q);
    res.json(subjects);
  }),

  getSubject: asyncHandler(async (req: Request, res: Response) => {
    const subjectId = parseInt(req.params.subjectId as string, 10);
    const subject = await subjectRepository.findById(subjectId);
    
    if (!subject) {
      res.status(404).json({ error: 'Subject not found' });
      return;
    }
    
    res.json(subject);
  }),

  getSubjectTree: asyncHandler(async (req: Request, res: Response) => {
    const subjectId = parseInt(req.params.subjectId as string, 10);
    const userId = (req as any).user!.userId; // from authMiddleware

    const tree = await subjectRepository.getTree(subjectId, userId);
    if (!tree) {
      res.status(404).json({ error: 'Subject not found' });
      return;
    }

    res.json(tree);
  }),

  getFirstVideo: asyncHandler(async (req: Request, res: Response) => {
    const subjectId = parseInt(req.params.subjectId as string, 10);
    const userId = (req as any).user!.userId;

    const videoId = await subjectRepository.getFirstUnlockedVideo(subjectId, userId);
    if (!videoId) {
      res.status(404).json({ error: 'No video found for this subject' });
      return;
    }

    res.json({ videoId });
  }),

  enroll: asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user!.userId;
    const { subjectIds } = req.body;

    if (!Array.isArray(subjectIds)) {
      res.status(400).json({ error: 'subjectIds must be an array' });
      return;
    }

    await subjectRepository.enrollUser(userId, subjectIds);
    res.json({ success: true });
  })
};
