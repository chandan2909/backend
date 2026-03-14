
import asyncHandler from 'express-async-handler';
import { videoRepository } from './video.repository.js';

export const videoController = {
  getVideo: async (req, res) => {
    const videoId = parseInt(req.params.videoId, 10);
    const userId = req.user.userId;

    const video = await videoRepository.getVideoMeta(videoId, userId);
    if (!video) {
        res.status(404).json({ error: 'Video not found' });
        return;
    }
    if (video.locked) {
        res.status(403).json({ 
            error: 'This video is locked. Please complete previous lessons first.',
            unlock_reason: video.unlock_reason
        });
        return;
    }

    res.json(video);
  }
};
