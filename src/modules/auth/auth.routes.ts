import { Router } from 'express';
import { authController } from './auth.controller';
import { validateRequest, registerSchema, loginSchema } from './auth.validator';
import { authenticate } from '../../middleware/authMiddleware';

const router = Router();

router.post('/register', validateRequest(registerSchema), authController.register);
router.post('/login', validateRequest(loginSchema), authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);
router.get('/me', authenticate, authController.me);

export default router;
