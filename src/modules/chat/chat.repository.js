import { pool } from '../../config/db.js';

export const ChatRepository = {
  async getChatsForUser(userId) {
    const [rows] = await pool.query(
      'SELECT * FROM chats WHERE user_id = ? ORDER BY updated_at DESC',
      [userId]
    );
    return rows;
  },

  async getMessagesForChat(chatId, userId) {
    const [chatRows] = await pool.query(
      'SELECT id FROM chats WHERE id = ? AND user_id = ?',
      [chatId, userId]
    );
    
    if (chatRows.length === 0) return [];

    const [msgRows] = await pool.query(
      'SELECT * FROM chat_messages WHERE chat_id = ? ORDER BY created_at ASC',
      [chatId]
    );
    return msgRows;
  },

  async createChat(id, userId, title, createdAt) {
    await pool.query(
      'INSERT IGNORE INTO chats (id, user_id, title, created_at, updated_at) VALUES (?, ?, ?, ?, ?)',
      [id, userId, title, createdAt, createdAt]
    );
  },

  async updateChatTitle(chatId, userId, title, updatedAt) {
    await pool.query(
      'UPDATE chats SET title = ?, updated_at = ? WHERE id = ? AND user_id = ?',
      [title, updatedAt, chatId, userId]
    );
  },

  async addMessage(chatId, userId, role, content, createdAt) {
    await pool.query(
      'INSERT IGNORE INTO chats (id, user_id, title, created_at, updated_at) VALUES (?, ?, ?, ?, ?)',
      [chatId, userId, 'Chat', createdAt, createdAt]
    );

    await pool.query(
      'UPDATE chats SET updated_at = ? WHERE id = ? AND user_id = ?',
      [createdAt, chatId, userId]
    );

    const [result] = await pool.query(
      'INSERT INTO chat_messages (chat_id, role, content, created_at) VALUES (?, ?, ?, ?)',
      [chatId, role, content, createdAt]
    );
    return result.insertId;
  },

  async deleteChat(chatId, userId) {
    await pool.query(
      'DELETE FROM chats WHERE id = ? AND user_id = ?',
      [chatId, userId]
    );
  }
};
