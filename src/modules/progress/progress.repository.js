import { pool } from '../../config/db.js';

export const progressRepository = {
  async getProgressOverview(userId) {
    const [rows] = await pool.query(
      `SELECT 
        COUNT(DISTINCT s.id) as total_subjects,
        COUNT(DISTINCT e.subject_id) as enrolled_subjects,
        (SELECT COUNT(*) FROM video_progress vp WHERE vp.user_id = ? AND vp.is_completed = 1) as completed_videos
      FROM subjects s
      LEFT JOIN enrollments e ON s.id = e.subject_id AND e.user_id = ?
      WHERE s.is_published = 1`,
      [userId, userId]
    );
    return rows[0];
  },

  async getSubjectProgress(subjectId, userId) {
    const [rows] = await pool.query(
      `SELECT 
        COUNT(v.id) as total_videos,
        SUM(CASE WHEN vp.is_completed = 1 THEN 1 ELSE 0 END) as completed_videos
      FROM sections s
      JOIN videos v ON s.id = v.section_id
      LEFT JOIN video_progress vp ON v.id = vp.video_id AND vp.user_id = ?
      WHERE s.subject_id = ?`,
      [userId, subjectId]
    );
    const result = rows[0];
    return {
      total_videos: result.total_videos || 0,
      completed_videos: result.completed_videos || 0,
      percentage: result.total_videos > 0 ? (result.completed_videos / result.total_videos) * 100 : 0
    };
  },

  async getVideoProgress(videoId, userId) {
    const [rows] = await pool.query(
      'SELECT * FROM video_progress WHERE video_id = ? AND user_id = ?',
      [videoId, userId]
    );
    return rows.length > 0 ? rows[0] : null;
  },

  async upsertVideoProgress(videoId, userId, lastPosition, isCompleted) {
    await pool.query(
      `INSERT INTO video_progress (video_id, user_id, last_position_seconds, is_completed)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE 
       last_position_seconds = ?, 
       is_completed = GREATEST(is_completed, ?),
       updated_at = CURRENT_TIMESTAMP`,
      [videoId, userId, lastPosition, isCompleted ? 1 : 0, lastPosition, isCompleted ? 1 : 0]
    );
  }
};
