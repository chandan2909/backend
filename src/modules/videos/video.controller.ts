import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { videoRepository } from './video.repository';

export const videoController = {
  getVideo: asyncHandler(async (req: Request, res: Response) => {
    const videoId = parseInt(req.params.videoId as string, 10);
    const userId = (req as any).user!.userId;

    const video = await videoRepository.getVideoMeta(videoId, userId);
    if (!video) {
        res.status(404).json({ error: 'Video not found' });
        return;
    }

    res.json(video);
  })
};
