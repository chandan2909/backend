import { pool } from './src/config/db';

async function verifyVideos() {
  console.log('=== Video Availability Report ===\n');

  const [subjects]: any = await pool.query('SELECT id, title, slug FROM subjects ORDER BY id');

  let totalVideos = 0;
  let totalSections = 0;

  for (const subject of subjects) {
    const [sections]: any = await pool.query(
      'SELECT id, title FROM sections WHERE subject_id = ? ORDER BY order_index',
      [subject.id]
    );

    let subjectVideoCount = 0;
    const sectionDetails: string[] = [];

    for (const section of sections) {
      const [videos]: any = await pool.query(
        'SELECT id, title, youtube_url FROM videos WHERE section_id = ? ORDER BY order_index',
        [section.id]
      );
      subjectVideoCount += videos.length;
      totalSections++;

      const hasValidUrls = videos.every((v: any) => v.youtube_url && v.youtube_url.length > 10);
      sectionDetails.push(`    [${section.title}] ${videos.length} videos ${hasValidUrls ? '✅' : '⚠️ some missing URLs'}`);
    }

    totalVideos += subjectVideoCount;
    const status = subjectVideoCount >= 20 ? '✅' : subjectVideoCount > 0 ? '⚠️' : '❌';
    console.log(`${status} Course: ${subject.title}`);
    console.log(`   Sections: ${sections.length} | Videos: ${subjectVideoCount}`);
    sectionDetails.forEach(d => console.log(d));
    console.log();
  }

  console.log(`\n=== SUMMARY ===`);
  console.log(`Total Courses: ${subjects.length}`);
  console.log(`Total Sections: ${totalSections}`);
  console.log(`Total Videos: ${totalVideos}`);

  process.exit(0);
}

verifyVideos().catch(err => { console.error(err); process.exit(1); });
