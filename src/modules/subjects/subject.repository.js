import { pool } from '../../config/db.js';
import { buildSubjectTreeWithLocks } from '../../utils/ordering.js';

export const subjectRepository = {
  async findAllPublished(page = 1, pageSize = 20, q) {
    let query = 'SELECT * FROM subjects WHERE is_published = 1';
    const params = [];
    
    if (q) {
      query += ' AND (title LIKE ? OR description LIKE ?)';
      params.push(`%${q}%`, `%${q}%`);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(pageSize, (page - 1) * pageSize);

    const [rows] = await pool.query(query, params);
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM subjects WHERE id = ?', [id]);
    return rows.length > 0 ? rows[0] : null;
  },

  async getTree(subjectId, userId) {
    const subject = await this.findById(subjectId);
    if (!subject) return null;

    const [sections] = await pool.query(
      'SELECT * FROM sections WHERE subject_id = ? ORDER BY order_index ASC',
      [subjectId]
    );

    if (sections.length === 0) {
      return { ...subject, sections };
    }

    const sectionIds = sections.map((s) => s.id);
    const [videos] = await pool.query(
      'SELECT v.* FROM videos v WHERE v.section_id IN (?) ORDER BY v.section_id ASC, v.order_index ASC',
      [sectionIds]
    );

    const videoIds = videos.map((v) => v.id);
    let progressRecords = [];
    if (videoIds.length > 0) {
      const [p] = await pool.query(
        'SELECT video_id, is_completed FROM video_progress WHERE user_id = ? AND video_id IN (?)',
        [userId, videoIds]
      );
      progressRecords = p;
    }

    const progressMap = new Map(progressRecords.map(p => [p.video_id, !!p.is_completed]));
    const treeSections = buildSubjectTreeWithLocks(sections, videos, progressMap);

    return {
      ...subject,
      sections: treeSections
    };
  },
  
  async getFirstUnlockedVideo(subjectId, userId) {
     const tree = await this.getTree(subjectId, userId);
     if (!tree || !tree.sections) return null;
     
     for (const section of tree.sections) {
       for (const video of section.videos) {
         if (!video.locked && !video.is_completed) {
           return video.id;
         }
       }
     }
     
     if (tree.sections.length > 0 && tree.sections[0].videos.length > 0) {
         return tree.sections[0].videos[0].id;
     }

     return null;
  },

  async enrollUser(userId, subjectIds) {
    if (subjectIds.length === 0) return;

    const values = subjectIds.map(id => [userId, id]);
    await pool.query(
      'INSERT IGNORE INTO enrollments (user_id, subject_id) VALUES ?',
      [values]
    );
  }
};
