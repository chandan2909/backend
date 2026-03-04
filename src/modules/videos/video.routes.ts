import { Router } from 'express';
import { videoController } from './video.controller';
import { authenticate } from '../../middleware/authMiddleware';

const router = Router();

router.get('/:videoId', authenticate, videoController.getVideo);

export default router;
