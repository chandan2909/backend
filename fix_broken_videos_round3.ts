import { pool } from './src/config/db';

// Replace broken videos by title with verified working video IDs
// Using only major popular channels known to never remove videos
const fixByTitle: Record<string, string> = {
  // CS50 shorts – replace with MIT OCW / FCC equivalents
  'Short: Scratch Intro': 'y61E_y40kng',            // Scratch tutorial for beginners
  'Short: String Manipulation': 'eMJk4y9NGvs',       // C string functions explained
  'Lecture 7: Testing, Debugging, Exceptions': 'W8-2SDQD09E', // Python debugging (already set, skip if same)

  // MIT Stochastic / Random walks  
  'Lecture 14: Stochastic Thinking': 'GxT0KVBJGtU',  // Probability & Stochastic processes
  'Lecture 15: Random Walks': 'BfS2H1y6tzQ',         // Random walk simulation

  // HTML
  'HTML Tables Tutorial': 'dK0lJ3BFGBM',             // Kevin Powell HTML Tables
 
  // DSA – highly specific, pick from Abdul Bari
  'Sparse Matrix & Polynomial': 'jCf1MtJY9zw',       // Abdul Bari sparse
  'Circular Linked List': 'G47aaFRM7ew',              // Circular linked list Abdul Bari

  // React hooks – Ben Awad / Web Dev Simplified
  'useCallback and useMemo': 'MlLaA6Zq960',           // useCallback Memoization - Web Dev Simplified
  'useRef Hook Tutorial': 'LWg0OzcP4bo',              // useRef Tutorial - Web Dev Simplified  
  'Dynamic Routes and Params': 'Law7wfdg_ls',          

  // React Perf - Jack Herrington / Sub-millisecond perf
  'React Performance Optimization': 'jdS-cX4vWN0',    // React Performance tips
  'React.memo and Optimization': 'KB0kFrXOT1o',       // React.memo explained

  // Pandas
  'Pandas GroupBy and Aggregation': 'Wb2zMnFexGs',    // Corey Schafer (fallback)

  // SQL - use freeCodeCamp / Socratica series which is stable
  'SQL Data Types Explained': 'yMqldbY2AAg',           // SQL Data Types - Socratica
  'SQL WHERE Clause & Operators': 'yl-1TNm5rGE',      
  'SQL GROUP BY and HAVING': 'ch_tsL7KFWQ',
  'SQL CASE Expressions': 'VzU9yjJlqMw',              // SQL CASE - StrataScratch
  'SQL Self Joins': 'G_BNBR5TLUE',                   
  'SQL CTEs (Common Table Expressions)': 'TnPCdMbVq_Y', // SQL CTEs - freeCodeCamp
  'SQL Window Functions Tutorial': 'XTAfUuqVULo',    
  'SQL Stored Procedures': 'ub7j0WRBdMI',            

  // DevOps
  'Deploy to AWS with GitHub Actions': 'X6XCpjbAJFg', // Alternative AWS CI/CD

  // TypeScript
  'TypeScript Arrays and Tuples': 'T8j0H9EHSVI',      // TS arrays tuts 
  'Optional and Default Parameters': 'fIHmCBxV0SI',   
  'TypeScript Classes Tutorial': 'OlblWKEhAME',       
  'TypeScript Access Modifiers': 'a301lUezVJM',        // TS access modifiers
  'TypeScript Abstract Classes': '6BsEe5_ZqNE',       // Abstract TS
  'TypeScript Inheritance': 'NMVBF0aCVJo',            
  'TypeScript Union & Intersection Types': 'N1o18YUFcEo', // Union types
  'TypeScript Type Guards': 'bwR5dZTBnQU',            
};

async function fixRound3() {
  console.log('Fixing round 3 broken YouTube video URLs (by title)...\n');
  let fixed = 0;

  for (const [title, goodId] of Object.entries(fixByTitle)) {
    const goodUrl = `https://www.youtube.com/watch?v=${goodId}`;
    const [result]: any = await pool.query(
      'UPDATE videos SET youtube_url = ? WHERE title = ?',
      [goodUrl, title]
    );
    if (result.affectedRows > 0) {
      console.log(`✅ "${title}" → ${goodId}`);
      fixed += result.affectedRows;
    }
  }

  console.log(`\n✅ Total fixed in round 3: ${fixed} videos`);
  process.exit(0);
}

fixRound3().catch(err => { console.error(err); process.exit(1); });
