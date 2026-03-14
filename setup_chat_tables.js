import { pool } from './src/config/db.js';

async function setupChatTables() {
  try {
    console.log('Creating chat tables...');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS chats (
        id VARCHAR(36) PRIMARY KEY,
        user_id BIGINT UNSIGNED NOT NULL,
        title VARCHAR(255) NOT NULL,
        created_at BIGINT NOT NULL,
        updated_at BIGINT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS chat_messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        chat_id VARCHAR(36) NOT NULL,
        role ENUM('user', 'assistant') NOT NULL,
        content TEXT NOT NULL,
        created_at BIGINT NOT NULL,
        FOREIGN KEY (chat_id) REFERENCES chats(id) ON DELETE CASCADE
      );
    `);

    console.log('✅ Chat tables created successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Failed to create chat tables:', err);
    process.exit(1);
  }
}

setupChatTables();
