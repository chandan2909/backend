import { pool } from './src/config/db';

async function fixThumbUrls() {
  const [result]: any = await pool.query(
    "UPDATE subjects SET thumbnail_url = REPLACE(thumbnail_url, 'maxresdefault.jpg', 'hqdefault.jpg') WHERE thumbnail_url IS NOT NULL"
  );
  console.log('Updated rows:', result.affectedRows);

  // Verify
  const [rows]: any = await pool.query('SELECT id, title, thumbnail_url FROM subjects WHERE thumbnail_url IS NOT NULL');
  for (const r of rows) console.log(`${r.id} | ${r.title} | ${r.thumbnail_url}`);
  process.exit(0);
}
fixThumbUrls().catch(e => { console.error(e); process.exit(1); });
