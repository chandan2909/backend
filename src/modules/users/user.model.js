import { pool } from '../../config/db.js';

export const userRepository = {
  async findByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) return null;
    return rows[0];
  },

  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    if (rows.length === 0) return null;
    return rows[0];
  },

  async create(email, passwordHash, name) {
    const [result] = await pool.query(
      'INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)',
      [email, passwordHash, name]
    );
    return result.insertId;
  },

  async delete(userId) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      
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
