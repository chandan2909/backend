import { Router } from 'express';
import { progressController } from './progress.controller.js';
import { authenticate } from '../../middleware/authMiddleware.js';

const router = Router();

router.get('/overview', authenticate, progressController.getOverview);
router.get('/subjects/:subjectId', authenticate, progressController.getSubjectProgress);
router.get('/videos/:videoId', authenticate, progressController.getVideoProgress);
router.post('/videos/:videoId', authenticate, progressController.upsertVideoProgress);

export default router;
