import { pool } from '../../config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface Chat {
  id: string;
  user_id: number;
  title: string;
  created_at: number;
  updated_at: number;
}

export interface ChatMessage {
  id: number;
  chat_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: number;
}

export class ChatRepository {
  static async getChatsForUser(userId: number): Promise<Chat[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM chats WHERE user_id = ? ORDER BY updated_at DESC',
      [userId]
    );
    return rows as Chat[];
  }

  static async getMessagesForChat(chatId: string, userId: number): Promise<ChatMessage[]> {
    // Verify the chat belongs to the user
    const [chatRows] = await pool.query<RowDataPacket[]>(
      'SELECT id FROM chats WHERE id = ? AND user_id = ?',
      [chatId, userId]
    );
    
    if (chatRows.length === 0) return [];

    const [msgRows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM chat_messages WHERE chat_id = ? ORDER BY created_at ASC',
      [chatId]
    );
    return msgRows as ChatMessage[];
  }

  static async createChat(id: string, userId: number, title: string, createdAt: number): Promise<void> {
    // INSERT IGNORE to be safe against duplicate calls
    await pool.query(
      'INSERT IGNORE INTO chats (id, user_id, title, created_at, updated_at) VALUES (?, ?, ?, ?, ?)',
      [id, userId, title, createdAt, createdAt]
    );
  }

  static async updateChatTitle(chatId: string, userId: number, title: string, updatedAt: number): Promise<void> {
    await pool.query(
      'UPDATE chats SET title = ?, updated_at = ? WHERE id = ? AND user_id = ?',
      [title, updatedAt, chatId, userId]
    );
  }

  static async addMessage(chatId: string, userId: number, role: 'user' | 'assistant', content: string, createdAt: number): Promise<number> {
    // Upsert the chat row so the FK constraint never fails, even if a race condition
    // caused the previous POST /chats request to fail silently on the frontend.
    await pool.query(
      'INSERT IGNORE INTO chats (id, user_id, title, created_at, updated_at) VALUES (?, ?, ?, ?, ?)',
      [chatId, userId, 'Chat', createdAt, createdAt]
    );

    // Now update the timestamp and insert the message safely
    await pool.query(
      'UPDATE chats SET updated_at = ? WHERE id = ? AND user_id = ?',
      [createdAt, chatId, userId]
    );

    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO chat_messages (chat_id, role, content, created_at) VALUES (?, ?, ?, ?)',
      [chatId, role, content, createdAt]
    );
    return result.insertId;
  }

  static async deleteChat(chatId: string, userId: number): Promise<void> {
    await pool.query(
      'DELETE FROM chats WHERE id = ? AND user_id = ?',
      [chatId, userId]
    );
  }
}
