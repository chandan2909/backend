const mysql = require('mysql2/promise');
require('dotenv').config();

async function reset() {
    const db = await mysql.createConnection({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await db.query('DROP TABLE IF EXISTS knex_migrations_lock;');
        await db.query('DROP TABLE IF EXISTS knex_migrations;');
        await db.query('DROP TABLE IF EXISTS video_progress;');
        await db.query('DROP TABLE IF EXISTS enrollments;');
        await db.query('DROP TABLE IF EXISTS videos;');
        await db.query('DROP TABLE IF EXISTS sections;');
        await db.query('DROP TABLE IF EXISTS subjects;');
        await db.query('DROP TABLE IF EXISTS refresh_tokens;');
        await db.query('DROP TABLE IF EXISTS users;');
        console.log('Successfully dropped all conflicting tables.');
    } catch (error) {
        console.error('Error dropping tables:', error);
    } finally {
        await db.end();
    }
}

reset();
