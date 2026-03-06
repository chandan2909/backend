import { pool } from './src/config/db';

// Map of video ID → replacement (all verified working via oembed check)
const replacements: Record<string, string> = {
  // CS50
  'q7tlgZg4Q1Q': 'QOOTWRdEXkM',  // Scratch programming
  'g3D7VE9YbYY': 'jjqgqaXeK3I',  // Scratch animation
  'JnCX5RM7rZA': 'bpA7wCmkQSo',  // C string manipulation
  'hnDU1G9FkvI': 'rfscVS0vtbw',  // Python basics

  // MIT Python
  '9H6mioroza0': 'W8-2SDQD09E',  // Debugging
  'V5JPPwOjjok': 'a9__D53WsUs',  // Data visualization
  '_M4_Vc9JWk':  '3XFOvxy2Lfw',  // Stochastic thinking
  '6F9ubFsNORs': 'keJ_s12BVTI',  // Random walks

  // Web Dev
  'dK0lJ3BFGBM': 'wFB7na3D9dE',  // HTML tables
  'EFafSYg-PkI': '68O6eKKYVLI',  // CSS Grid
  '35lXWvCuM8o': 'ELFORM9fmZd',  // React Context & Reducer

  // DSA
  'F-tTb9-HOMg': 'BK7guitxt5s',  // Sparse matrix
  'Q6COtJMISSE': 'A3ZUpyrnCbM',  // Queue data structure
  'GkCLPysLK4M': '_jmF2KVL4_0', // Circular linked list

  // React.js
  'ilmV9ePJFFQ': 'MxIPQR5tigk',  // useCallback and useMemo
  't2ypzz6gzvg': 'fyFEc6SVcpg',  // useRef hook
  'OMQ2QARHBo4': 'Jpphalf9_wM',  // Dynamic routes
  'O-JzNzLGBKU': 'L4E3PPMJlKo',  // React performance
  '1WHb_VoKyTE': 'IkW4jTKoMUU',  // React.memo
  '7dTTFW269jM': '86Gy035z_KA',  // React Testing Library

  // Python DS
  'Qa0-jYtcqyc': 'txeX_has0gI',  // Pandas GroupBy

  // SQL
  '2X0oL6Cqf7Y': 'p3qvj9hO_Bo',  // INSERT UPDATE DELETE
  'G4qo2CaWHhM': 'WEpYH5J5b6k',  // SQL data types
  'QXGiT2hDFpk': 'yl-1TNm5rGE',  // WHERE clause
  'TzB7Ur0_FGQ': 'Uo_7YQIZY5s',  // GROUP BY and HAVING
  'nNrgRCIBYC0': 'GwIo3gDZCVQ',  // Aggregate functions
  'y1F6tXKTCio': 'QLkfCbm5B5E',  // CASE expressions
  'pbXJa5aFBsI': 'G_BNBR5TLUE',  // Self joins
  'K74_FNs6jy0': 'KR_cDpKhqoI',  // CTEs
  'H6OTMoXjNEc': 'Ww71knvVu68',  // Window functions
  'cV-mBRQ8enQ': 'ub7j0WRBdMI',  // Stored procedures
  '_4jj3rwrSQI': 'BHwzDmr6d7s',  // SQL indexes

  // DevOps
  'Kl8LFKukHAg': 'T-D1KVAuvjI',  // Deploy to AWS (replaced duplicated ID)

  // TypeScript
  'WlsTVBOt2OY': 'Nro2jCxMPrA',  // Arrays and Tuples
  // Kl8LFKukHAg already in DevOps; here it was mapped to TypeScript Interfaces  
  'crjIMmz7gRY': 'p5oe9eVjQBk',  // Type Aliases vs Interfaces
  'xPEMup3SBOQ': 'fnuf7dY7OTQ',  // Optional parameters
  'OsFwOQ_RNNE': 'OeCyi0MI79U',  // Classes
  'vPWe3QcKKJo': 'OeCyi0MI79U',  // Access modifiers
  'Pj6COiFlaYM': 'A_fzI-7n734',  // Abstract classes
  '-dHFOFx6_bw': '3Q17BPd0k9E',  // Inheritance
  'o_wI-1seZ9M': '4N6efkqpAIU',  // Union & Intersection types
  'yhUGgAAwJug': '0IB_dDrSniQ',  // Type guards
};

// For the TypeScript Interfaces entry that reuses the DevOps broken ID
// We need to handle it by current_url since two different records had same bad ID
const replacementsByTitle: Record<string, string> = {
  'TypeScript Interfaces': 'zM9UPcIyyhQ',
  'Deploy to AWS with GitHub Actions': 'T-D1KVAuvjI',
};

async function fixBrokenVideos() {
  console.log('Fixing broken YouTube video URLs...\n');
  let fixed = 0;

  // Fix by youtube_url (old broken ID)
  for (const [badId, goodId] of Object.entries(replacements)) {
    const goodUrl = `https://www.youtube.com/watch?v=${goodId}`;
    const [result]: any = await pool.query(
      'UPDATE videos SET youtube_url = ? WHERE youtube_url LIKE ?',
      [goodUrl, `%${badId}%`]
    );
    if (result.affectedRows > 0) {
      console.log(`✅ Fixed ${result.affectedRows} video(s) with ID ${badId} → ${goodId}`);
      fixed += result.affectedRows;
    }
  }

  // Fix by title for records that share the same bad ID
  for (const [title, goodId] of Object.entries(replacementsByTitle)) {
    const goodUrl = `https://www.youtube.com/watch?v=${goodId}`;
    const [result]: any = await pool.query(
      'UPDATE videos SET youtube_url = ? WHERE title = ?',
      [goodUrl, title]
    );
    if (result.affectedRows > 0) {
      console.log(`✅ Fixed "${title}" → ${goodId}`);
      fixed += result.affectedRows;
    }
  }

  console.log(`\n✅ Total fixed: ${fixed} videos`);
  process.exit(0);
}

fixBrokenVideos().catch(err => { console.error(err); process.exit(1); });
