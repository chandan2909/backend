import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { corsOptions } from './config/security';
import authRoutes from './modules/auth/auth.routes';
import subjectRoutes from './modules/subjects/subject.routes';
import videoRoutes from './modules/videos/video.routes';
import progressRoutes from './modules/progress/progress.routes';
import chatRoutes from './modules/chat/chat.routes';

const app = express();

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Basic health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Modular routes
app.use('/api/auth', authRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/chats', chatRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

export default app;
