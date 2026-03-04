import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { videoRepository } from './video.repository';

export const videoController = {
  getVideo: asyncHandler(async (req: Request, res: Response) => {
    const videoId = parseInt(req.params.videoId as string, 10);
    const userId = (req as any).user!.userId;

    const video = await videoRepository.getVideoMeta(videoId, userId);
    if (video.locked) {
        res.status(403).json({ 
            error: 'This video is locked. Please complete previous lessons first.',
            unlock_reason: video.unlock_reason
        });
        return;
    }

    res.json(video);
  })
};
