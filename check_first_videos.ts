import { pool } from './src/config/db';

async function checkSubjects() {
  const [subjects]: any = await pool.query('SELECT id, title FROM subjects ORDER BY id');
  for (const s of subjects) {
    const [firstVideo]: any = await pool.query(
      `SELECT v.youtube_url FROM videos v
       JOIN sections sec ON v.section_id = sec.id
       WHERE sec.subject_id = ?
       ORDER BY sec.order_index, v.order_index LIMIT 1`,
      [s.id]
    );
    const url = firstVideo[0]?.youtube_url || '';
    const match = url.match(/v=([a-zA-Z0-9_-]{11})/);
    const ytId = match ? match[1] : url.slice(-11);
    console.log(`${s.id}|${s.title}|${ytId}`);
  }
  process.exit(0);
}
checkSubjects().catch(e => { console.error(e); process.exit(1); });
