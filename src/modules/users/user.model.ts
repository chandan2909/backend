import { pool } from '../../config/db';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface User {
  id: number;
  email: string;
  password_hash: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export const userRepository = {
  async findByEmail(email: string): Promise<User | null> {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) return null;
    return rows[0] as User;
  },

  async findById(id: number): Promise<User | null> {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM users WHERE id = ?', [id]);
    if (rows.length === 0) return null;
    return rows[0] as User;
  },

  async create(email: string, passwordHash: string, name: string): Promise<number> {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)',
      [email, passwordHash, name]
    );
    return result.insertId;
  },

  async delete(userId: number): Promise<void> {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      
      // Delete in order to respect foreign key constraints
      await connection.query('DELETE FROM video_progress WHERE user_id = ?', [userId]);
      await connection.query('DELETE FROM enrollments WHERE user_id = ?', [userId]);
      await connection.query('DELETE FROM refresh_tokens WHERE user_id = ?', [userId]);
      await connection.query('DELETE FROM users WHERE id = ?', [userId]);
      
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
};
