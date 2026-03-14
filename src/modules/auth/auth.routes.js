import { Router } from 'express';
import { authController } from './auth.controller.js';
import { validateRequest, registerSchema, loginSchema } from './auth.validator.js';
import { authenticate } from '../../middleware/authMiddleware.js';

const router = Router();

router.post('/register', validateRequest(registerSchema), authController.register);
router.post('/login', validateRequest(loginSchema), authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);
router.get('/me', authenticate, authController.me);
router.delete('/me', authenticate, authController.deleteAccount);

export default router;
