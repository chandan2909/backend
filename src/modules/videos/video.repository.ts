import { pool } from '../../config/db';
import type { RowDataPacket } from 'mysql2';
import { subjectRepository } from '../subjects/subject.repository';

export const videoRepository = {
  async getVideoMeta(videoId: number, userId: number): Promise<any> {
    const [rows] = await pool.query<RowDataPacket[]>(`
      SELECT 
        v.id, v.title, v.description, v.youtube_url, v.order_index, v.duration_seconds,
        s.id as section_id, s.title as section_title,
        sub.id as subject_id, sub.title as subject_title
      FROM videos v
      JOIN sections s ON v.section_id = s.id
      JOIN subjects sub ON s.subject_id = sub.id
      WHERE v.id = ?
    `, [videoId]);

    if (rows.length === 0) return null;
    const videoData = rows[0];

    // Compute locked status based on the entire tree
    const tree = await subjectRepository.getTree(videoData.subject_id, userId);
    
    let previousVideoId: number | null = null;
    let nextVideoId: number | null = null;
    let locked = false;
    let isCompleted = false;
    let unlockReason = '';

    if (tree && tree.sections) {
      const flattenedVideos = tree.sections.flatMap((s: any) => s.videos);
      const currentIndex = flattenedVideos.findIndex((v: any) => v.id === videoId);

      if (currentIndex !== -1) {
        locked = flattenedVideos[currentIndex].locked;
        isCompleted = flattenedVideos[currentIndex].is_completed || false;
        if (locked) unlockReason = 'Complete previous video';
        
        if (currentIndex > 0) {
          previousVideoId = flattenedVideos[currentIndex - 1].id;
        }
        if (currentIndex < flattenedVideos.length - 1) {
          nextVideoId = flattenedVideos[currentIndex + 1].id;
        }
      }
    }

    return {
      ...videoData,
      previous_video_id: previousVideoId,
      next_video_id: nextVideoId,
      locked,
      is_completed: isCompleted,
      unlock_reason: unlockReason
    };
  }
};
