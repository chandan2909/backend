import { pool } from './src/config/db';

// Use YouTube video thumbnails (maxresdefault) from each course's representative video
// Format: https://img.youtube.com/vi/{VIDEO_ID}/maxresdefault.jpg
const courseThumbnails: Record<number, string> = {
  12: 'https://img.youtube.com/vi/8mAITcNt710/maxresdefault.jpg',   // CS50
  13: 'https://img.youtube.com/vi/nykOeWgQcHM/maxresdefault.jpg',   // MIT Python
  14: 'https://img.youtube.com/vi/UB1O30fR-EE/maxresdefault.jpg',   // Web Dev Beginners
  15: 'https://img.youtube.com/vi/0IAPZzGSbME/maxresdefault.jpg',   // DSA
  16: 'https://img.youtube.com/vi/GwIo3gDZCVQ/maxresdefault.jpg',   // Machine Learning
  17: 'https://img.youtube.com/vi/w7ejDZ8SWv8/maxresdefault.jpg',   // React.js
  18: 'https://img.youtube.com/vi/_uQrJ0TkZlc/maxresdefault.jpg',   // Python for DS
  19: 'https://img.youtube.com/vi/HXV3zeQKqGY/maxresdefault.jpg',   // SQL
  20: 'https://img.youtube.com/vi/fqMOX6JJhGo/maxresdefault.jpg',   // DevOps (Docker main video)
  21: 'https://img.youtube.com/vi/BwuLxPH8IDs/maxresdefault.jpg',   // TypeScript
};

async function addThumbnails() {
  console.log('Adding thumbnail_url column to subjects table...');

  // Add column if it doesn't already exist
  try {
    await pool.query(`ALTER TABLE subjects ADD COLUMN thumbnail_url VARCHAR(500) DEFAULT NULL`);
    console.log('✅ Added thumbnail_url column');
  } catch (e: any) {
    if (e.code === 'ER_DUP_FIELDNAME') {
      console.log('ℹ️  thumbnail_url column already exists, skipping ALTER');
    } else {
      throw e;
    }
  }

  console.log('\nSeeding thumbnail URLs...');
  for (const [id, url] of Object.entries(courseThumbnails)) {
    const [result]: any = await pool.query(
      'UPDATE subjects SET thumbnail_url = ? WHERE id = ?',
      [url, Number(id)]
    );
    console.log(`✅ Course ${id}: ${result.affectedRows} row(s) updated`);
  }

  console.log('\n✅ Done! Thumbnails added.');
  process.exit(0);
}

addThumbnails().catch(e => { console.error(e); process.exit(1); });
