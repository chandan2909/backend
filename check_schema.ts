import { pool } from './src/config/db';

async function checkSchema() {
  try {
    const [rows]: any = await pool.query('SHOW CREATE TABLE users');
    console.log(rows[0]['Create Table']);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkSchema();
