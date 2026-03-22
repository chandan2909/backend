import { pool } from '../../config/db.js';

export const progressRepository = {
  async getProgressOverview(userId) {
    const [rows] = await pool.query(
      `SELECT 
        e.subject_id,
        s.title AS subject_title,
        e.created_at AS enrolled_at,
        COUNT(v.id) AS total_videos,
        SUM(CASE WHEN vp.is_completed = 1 THEN 1 ELSE 0 END) AS completed_videos,
        ROUND(
          CASE WHEN COUNT(v.id) > 0 
            THEN (SUM(CASE WHEN vp.is_completed = 1 THEN 1 ELSE 0 END) / COUNT(v.id)) * 100 
            ELSE 0 
          END, 1
        ) AS completion_percentage,
        (
          SELECT CONCAT('https://img.youtube.com/vi/', 
            SUBSTRING_INDEX(SUBSTRING_INDEX(v2.youtube_url, 'v=', -1), '&', 1), 
            '/hqdefault.jpg')
          FROM videos v2 
          JOIN sections sec2 ON v2.section_id = sec2.id 
          WHERE sec2.subject_id = e.subject_id 
          ORDER BY sec2.order_index ASC, v2.order_index ASC 
          LIMIT 1
        ) AS thumbnail_url
      FROM enrollments e
      JOIN subjects s ON e.subject_id = s.id AND s.is_published = 1
      LEFT JOIN sections sec ON sec.subject_id = s.id
      LEFT JOIN videos v ON v.section_id = sec.id
      LEFT JOIN video_progress vp ON vp.video_id = v.id AND vp.user_id = ?
      WHERE e.user_id = ?
      GROUP BY e.subject_id, s.title, e.created_at
      ORDER BY e.created_at DESC`,
      [userId, userId]
    );
    return rows;
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
