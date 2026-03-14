import { Router } from 'express';
import { videoController } from './video.controller.js';
import { authenticate } from '../../middleware/authMiddleware.js';

const router = Router();

router.get('/:videoId', authenticate, videoController.getVideo);

export default router;
