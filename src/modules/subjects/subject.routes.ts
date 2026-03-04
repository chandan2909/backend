import { Router } from 'express';
import { subjectController } from './subject.controller';
import { authenticate } from '../../middleware/authMiddleware';

const router = Router();

// Public actions
router.get('/', subjectController.getPublishedSubjects);
router.get('/:subjectId', subjectController.getSubject);

// Authenticated actions
router.get('/:subjectId/tree', authenticate, subjectController.getSubjectTree);
router.get('/:subjectId/first-video', authenticate, subjectController.getFirstVideo);
router.post('/enroll', authenticate, subjectController.enroll);

export default router;
