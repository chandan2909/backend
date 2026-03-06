import { pool } from './src/config/db';
import https from 'https';

// Extract YouTube video ID from a URL or bare ID
function extractId(urlOrId: string): string | null {
  const regExp = /^.*((youtu\.be\/)|(v\/)|(\u002Fu\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = urlOrId.match(regExp);
  if (match && match[7] && match[7].length === 11) return match[7];
  if (/^[a-zA-Z0-9_-]{11}$/.test(urlOrId.trim())) return urlOrId.trim();
  return null;
}

// Check if a YT video is accessible via oembed (no API key needed)
function checkVideo(videoId: string): Promise<boolean> {
  return new Promise((resolve) => {
    const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    https.get(url, (res) => {
      resolve(res.statusCode === 200);
      res.resume();
    }).on('error', () => resolve(false));
  });
}

async function verifyYouTubeIds() {
  console.log('=== YouTube Video ID Verification ===\n');

  const [subjects]: any = await pool.query('SELECT id, title FROM subjects ORDER BY id');
  
  let totalOk = 0, totalBad = 0, totalInvalidId = 0;

  for (const subject of subjects) {
    const [videos]: any = await pool.query(
      `SELECT v.id, v.title, v.youtube_url, s.title AS section_title
       FROM videos v
       JOIN sections s ON v.section_id = s.id
       WHERE s.subject_id = ?
       ORDER BY s.order_index, v.order_index`,
      [subject.id]
    );

    console.log(`\n📚 ${subject.title} (${videos.length} videos)`);

    const results: { id: string; title: string; ytId: string | null; ok: boolean }[] = [];

    // Check in batches of 5 to avoid throttling
    for (let i = 0; i < videos.length; i += 5) {
      const batch = videos.slice(i, i + 5);
      const batchResults = await Promise.all(
        batch.map(async (v: any) => {
          const ytId = extractId(v.youtube_url);
          const ok = ytId ? await checkVideo(ytId) : false;
          return { id: v.id, title: v.title, ytId, ok };
        })
      );
      results.push(...batchResults);
    }

    for (const r of results) {
      if (!r.ytId) {
        console.log(`  ❌ [INVALID ID] ${r.title} → ${r.ytId}`);
        totalInvalidId++;
      } else if (!r.ok) {
        console.log(`  ⚠️  [UNAVAILABLE] ${r.title} → ${r.ytId}`);
        totalBad++;
      } else {
        console.log(`  ✅ ${r.title} → ${r.ytId}`);
        totalOk++;
      }
    }
  }

  console.log('\n=== FINAL SUMMARY ===');
  console.log(`✅ Valid & accessible  : ${totalOk}`);
  console.log(`⚠️  Unavailable/private: ${totalBad}`);
  console.log(`❌ Invalid video ID    : ${totalInvalidId}`);
  console.log(`Total videos checked   : ${totalOk + totalBad + totalInvalidId}`);

  process.exit(0);
}

verifyYouTubeIds().catch(err => { console.error(err); process.exit(1); });
