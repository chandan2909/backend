import { pool } from '../../config/db.js';
import { subjectRepository } from '../subjects/subject.repository.js';

export const videoRepository = {
  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM videos WHERE id = ?', [id]);
    return rows.length > 0 ? rows[0] : null;
  },

  async getVideoMeta(videoId, userId) {
    const video = await this.findById(videoId);
    if (!video) return null;

    const [rows] = await pool.query(
      'SELECT section_id FROM videos WHERE id = ?',
      [videoId]
    );
    const sectionId = rows[0].section_id;

    const [sectionRows] = await pool.query(
      'SELECT subject_id FROM sections WHERE id = ?',
      [sectionId]
    );
    const subjectId = sectionRows[0].subject_id;

    const tree = await subjectRepository.getTree(subjectId, userId);
    if (!tree) return null;

    for (const section of tree.sections) {
      const found = section.videos.find(v => v.id === videoId);
      if (found) return found;
    }

    return null;
  }
};
