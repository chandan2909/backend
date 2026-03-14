
import asyncHandler from 'express-async-handler';
import { subjectRepository } from './subject.repository.js';

export const subjectController = {
  getPublishedSubjects: async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 20;
    const q = req.query.q;

    const subjects = await subjectRepository.findAllPublished(page, pageSize, q);
    res.json(subjects);
  },
  getSubject: async (req, res) => {
    const subjectId = parseInt(req.params.subjectId, 10);
    const subject = await subjectRepository.findById(subjectId);
    
    if (!subject) {
      res.status(404).json({ error: 'Subject not found' });
      return;
    }
    
    res.json(subject);
  },
  getSubjectTree: async (req, res) => {
    const subjectId = parseInt(req.params.subjectId, 10);
    const userId = req.user.userId; // from authMiddleware

    const tree = await subjectRepository.getTree(subjectId, userId);
    if (!tree) {
      res.status(404).json({ error: 'Subject not found' });
      return;
    }

    res.json(tree);
  },
  getFirstVideo: async (req, res) => {
    const subjectId = parseInt(req.params.subjectId, 10);
    const userId = req.user.userId;

    const videoId = await subjectRepository.getFirstUnlockedVideo(subjectId, userId);
    if (!videoId) {
      res.status(404).json({ error: 'No video found for this subject' });
      return;
    }

    res.json({ videoId });
  },
  enroll: async (req, res) => {
    const userId = req.user.userId;
    const { subjectIds } = req.body;

    if (!Array.isArray(subjectIds)) {
      res.status(400).json({ error: 'subjectIds must be an array' });
      return;
    }

    await subjectRepository.enrollUser(userId, subjectIds);
    res.json({ success: true });
  }
};
