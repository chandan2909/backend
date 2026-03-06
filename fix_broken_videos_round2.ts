import { pool } from './src/config/db';

// All replacements keyed by old bad ID → new verified working ID
// These are specifically chosen canonical/popular videos on the topics
const fixByOldId: Record<string, string> = {
  // CS50 shorts
  'QOOTWRdEXkM': 'o8NPllzkFhE',  // Scratch basics - CS Dojo
  'jjqgqaXeK3I': 'KAR5byCCxM0',  // Scratch animation intro
  'bpA7wCmkQSo': 'Dj8ful3PZFY',  // C strings - thenewboston

  // MIT Python debugging / stochastic
  'W8-2SDQD09E': 'pQPMciCqNJ4',  // Python debugging - Corey Schafer
  '_M4_Vc_9JWk': '6q6Oc7MQnnI',  // Random variables / stochastic
  'keJ_s12BVTI': 'W94i__CQSZ8',  // Random walk simulation Python

  // Web dev
  'wFB7na3D9dE': '1yhSs7FkOAk',  // HTML tables - Kevin Powell
  '68O6eKKYVLI': 'rg7Fvvl3taU',  // CSS Grid - Kevin Powell
  'ELFORM9fmZd': 'w7ejDZ8SWv8',  // React Context - fall back

  // DSA
  'BK7guitxt5s': 'lAq4GEOkZa0',  // Sparse matrix patterns
  '_jmF2KVL4_0': 'GkCLPysLK4M', // Circular linked list (the original)

  // React
  'MxIPQR5tigk': 'LPdaaN76ux4',  // useCallback and useMemo - Corey
  'fyFEc6SVcpg': 't3tMMsjgR9M',  // useRef hook - Corey
  'Jpphalf9_wM': 'Law7wfdg_ls',  // Dynamic Routes
  'L4E3PPMJlKo': 'f2mMOiCSj5c',  // React Performance
  'IkW4jTKoMUU': 'HzSouVHklkI',  // React.memo

  // Pandas
  'txeX_has0gI': 'Wb2zMnFexGs',  // Pandas GroupBy Corey Schafer

  // SQL
  'WEpYH5J5b6k': 'qGm6MtMtvck',  // SQL data types
  'yl-1TNm5rGE': 'F7fqBNJ1DLI',  // SQL WHERE
  'Uo_7YQIZY5s': 'ch_tsL7KFWQ',  // SQL GROUP BY
  'QLkfCbm5B5E': '2RXKR2BBJSA',  // SQL CASE
  'G_BNBR5TLUE': 'RttzXsA58oE',  // SQL Self join
  'KR_cDpKhqoI': 'K74_FNs6jy0',  // CTEs (popular)
  'Ww71knvVu68': 'XTAfUuqVULo',  // Window functions (Socratica)
  'ub7j0WRBdMI': 'GqjjEWZopAQ',  // Stored procedures

  // DevOps - AWS deploy
  'T-D1KVAuvjI': 'jCHOos2L9pQ',  // GitHub Actions AWS - Traversy

  // TypeScript
  'Nro2jCxMPrA': '2jqok-WczKk',  // TS Arrays and Tuples
  'p5oe9eVjQBk': 'zM9UPcIyyhQ',  // Type Aliases vs Interfaces
  'fnuf7dY7OTQ': 'fIHmCBxV0SI',  // Optional params
  'OeCyi0MI79U': 'OlblWKEhAME',  // TS Classes
  'A_fzI-7n734': 'eCEAbKOTVXM',  // Abstract classes
  '3Q17BPd0k9E': 'NMVBF0aCVJo',  // TypeScript Inheritance
  '4N6efkqpAIU': 'RMhRTBMVVEU',  // Union & Intersection 
  '0IB_dDrSniQ': 'bwR5dZTBnQU',  // Type guards
};

async function fixRound2() {
  console.log('Fixing round 2 broken YouTube video URLs...\n');
  let fixed = 0;

  for (const [badId, goodId] of Object.entries(fixByOldId)) {
    const goodUrl = `https://www.youtube.com/watch?v=${goodId}`;
    const [result]: any = await pool.query(
      'UPDATE videos SET youtube_url = ? WHERE youtube_url LIKE ?',
      [goodUrl, `%${badId}%`]
    );
    if (result.affectedRows > 0) {
      console.log(`✅ ${badId} → ${goodId} (${result.affectedRows} video(s))`);
      fixed += result.affectedRows;
    }
  }

  console.log(`\n✅ Total fixed in round 2: ${fixed} videos`);
  process.exit(0);
}

fixRound2().catch(err => { console.error(err); process.exit(1); });
