import { pool } from '../../config/db';
import type { RowDataPacket } from 'mysql2';
import { buildSubjectTreeWithLocks } from '../../utils/ordering';

export interface Subject {
  id: number;
  title: string;
  slug: string;
  description: string;
  is_published: boolean;
}

export const subjectRepository = {
  async findAllPublished(page: number = 1, pageSize: number = 20, q?: string): Promise<Subject[]> {
    let query = 'SELECT * FROM subjects WHERE is_published = 1';
    const params: any[] = [];
    
    if (q) {
      query += ' AND (title LIKE ? OR description LIKE ?)';
      params.push(`%${q}%`, `%${q}%`);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(pageSize, (page - 1) * pageSize);

    const [rows] = await pool.query<RowDataPacket[]>(query, params);
    return rows as Subject[];
  },

  async findById(id: number): Promise<Subject | null> {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM subjects WHERE id = ?', [id]);
    return rows.length > 0 ? (rows[0] as Subject) : null;
  },

  async getTree(subjectId: number, userId: number): Promise<any> {
    const subject = await this.findById(subjectId);
    if (!subject) return null;

    // Fetch sections
    const [sections] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM sections WHERE subject_id = ? ORDER BY order_index ASC',
      [subjectId]
    );

    if (sections.length === 0) {
      return { ...subject, sections: [] };
    }

    // Fetch videos for this subject via sections
    const sectionIds = sections.map((s) => s.id);
    const [videos] = await pool.query<RowDataPacket[]>(
      'SELECT v.* FROM videos v WHERE v.section_id IN (?) ORDER BY v.section_id ASC, v.order_index ASC',
      [sectionIds]
    );

    // Fetch progress for this user and these videos
    const videoIds = videos.map((v) => v.id);
    let progressRecords: any[] = [];
    if (videoIds.length > 0) {
      const [p] = await pool.query<RowDataPacket[]>(
        'SELECT video_id, is_completed FROM video_progress WHERE user_id = ? AND video_id IN (?)',
        [userId, videoIds]
      );
      progressRecords = p;
    }

    const progressMap = new Map(progressRecords.map(p => [p.video_id, !!p.is_completed]));

    const treeSections = buildSubjectTreeWithLocks(sections as any[], videos as any[], progressMap);

    return {
      id: subject.id,
      title: subject.title,
      sections: treeSections
    };
  },
  
  async getFirstUnlockedVideo(subjectId: number, userId: number): Promise<number | null> {
     const tree = await this.getTree(subjectId, userId);
     if (!tree || !tree.sections) return null;
     
     for (const section of tree.sections) {
       for (const video of section.videos) {
         if (!video.locked && !video.is_completed) {
           return video.id;
         }
       }
     }
     
     // If all completed or none unlocked but exist, just return the first one or last one
     if (tree.sections.length > 0 && tree.sections[0].videos.length > 0) {
         // find first overall
         return tree.sections[0].videos[0].id;
     }

     return null;
  },

  async enrollUser(userId: number, subjectIds: number[]): Promise<void> {
    if (subjectIds.length === 0) return;

    const values = subjectIds.map(id => [userId, id]);
    // Note: Using INSERT IGNORE to skip existing enrollments
    await pool.query(
      'INSERT IGNORE INTO enrollments (user_id, subject_id) VALUES ?',
      [values]
    );
  }
};
