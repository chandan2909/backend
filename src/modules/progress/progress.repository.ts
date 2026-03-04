import { pool } from '../../config/db';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';

export const progressRepository = {
  async getProgressOverview(userId: number): Promise<any[]> {
    const [rows] = await pool.query<RowDataPacket[]>(`
      SELECT 
        s.id as subject_id,
        s.title as subject_title,
        COUNT(v.id) as total_videos,
        SUM(CASE WHEN vp.is_completed = 1 THEN 1 ELSE 0 END) as completed_videos,
        COUNT(vp.id) as accessed_videos
      FROM subjects s
      JOIN sections sec ON sec.subject_id = s.id
      JOIN videos v ON v.section_id = sec.id
      LEFT JOIN video_progress vp ON vp.video_id = v.id AND vp.user_id = ?
      GROUP BY s.id, s.title
      HAVING accessed_videos > 0
    `, [userId]);

    return rows.map(r => {
      const total = parseInt(r.total_videos) || 0;
      const completed = parseInt(r.completed_videos) || 0;
      return {
        subject_id: r.subject_id,
        subject_title: r.subject_title,
        total_videos: total,
        completed_videos: completed,
        completion_percentage: total > 0 ? (completed / total) * 100 : 0
      };
    });
  },

  async getSubjectProgress(subjectId: number, userId: number): Promise<any> {
    const [stats] = await pool.query<RowDataPacket[]>(`
      SELECT 
        COUNT(v.id) as total_videos,
        SUM(CASE WHEN vp.is_completed = 1 THEN 1 ELSE 0 END) as completed_videos
      FROM videos v
      JOIN sections s ON v.section_id = s.id
      LEFT JOIN video_progress vp ON vp.video_id = v.id AND vp.user_id = ?
      WHERE s.subject_id = ?
    `, [userId, subjectId]);

    const total = parseInt(stats[0].total_videos) || 0;
    const completed = parseInt(stats[0].completed_videos) || 0;

    const [lastWatch] = await pool.query<RowDataPacket[]>(`
      SELECT vp.video_id, vp.last_position_seconds
      FROM video_progress vp
      JOIN videos v ON vp.video_id = v.id
      JOIN sections s ON v.section_id = s.id
      WHERE s.subject_id = ? AND vp.user_id = ?
      ORDER BY vp.updated_at DESC
      LIMIT 1
    `, [subjectId, userId]);

    return {
      total_videos: total,
      completed_videos: completed,
      percent_complete: total > 0 ? Math.round((completed / total) * 100) : 0,
      last_video_id: lastWatch.length > 0 ? lastWatch[0].video_id : null,
      last_position_seconds: lastWatch.length > 0 ? lastWatch[0].last_position_seconds : null
    };
  },

  async getVideoProgress(videoId: number, userId: number): Promise<any> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT last_position_seconds, is_completed FROM video_progress WHERE user_id = ? AND video_id = ?',
      [userId, videoId]
    );

    if (rows.length === 0) {
      return { last_position_seconds: 0, is_completed: false };
    }
    return {
      last_position_seconds: rows[0].last_position_seconds,
      is_completed: !!rows[0].is_completed
    };
  },

  async upsertVideoProgress(videoId: number, userId: number, lastPositionSeconds: number, isCompleted: boolean | undefined): Promise<void> {
    // Validate position against duration if known
    const [videoData] = await pool.query<RowDataPacket[]>(
      'SELECT duration_seconds FROM videos WHERE id = ?',
      [videoId]
    );
    let duration = null;
    if (videoData.length > 0) {
      duration = videoData[0].duration_seconds;
    }

    let cappedPosition = Math.max(0, lastPositionSeconds);
    if (duration !== null && cappedPosition > duration) {
      cappedPosition = duration;
    }

    const [existing] = await pool.query<RowDataPacket[]>(
      'SELECT id, is_completed FROM video_progress WHERE user_id = ? AND video_id = ?',
      [userId, videoId]
    );

    const completeFlag = isCompleted !== undefined ? isCompleted : (existing.length > 0 ? !!existing[0].is_completed : false);
    const completedAtChunk = (completeFlag && (!existing.length || !existing[0].is_completed)) ? ', completed_at = NOW()' : '';

    if (existing.length > 0) {
      // update
      await pool.query(`
        UPDATE video_progress 
        SET last_position_seconds = ?, is_completed = ?, updated_at = NOW() ${completedAtChunk}
        WHERE id = ?
      `, [cappedPosition, completeFlag ? 1 : 0, existing[0].id]);
    } else {
      // insert
      const insertCompletedAt = completeFlag ? 'NOW()' : 'NULL';
      await pool.query(`
        INSERT INTO video_progress (user_id, video_id, last_position_seconds, is_completed, completed_at, updated_at)
        VALUES (?, ?, ?, ?, ${insertCompletedAt}, NOW())
      `, [userId, videoId, cappedPosition, completeFlag ? 1 : 0]);
    }
  }
};
