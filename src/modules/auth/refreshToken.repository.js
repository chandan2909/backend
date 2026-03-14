import { pool } from '../../config/db.js';

export const refreshTokenRepository = {
  async findByHash(hash) {
    const [rows] = await pool.query(
      'SELECT * FROM refresh_tokens WHERE token_hash = ? AND expires_at > NOW() AND revoked = 0',
      [hash]
    );
    return rows.length > 0 ? rows[0] : null;
  },

  async create(userId, hash, expiresAt) {
    await pool.query(
      'INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES (?, ?, ?)',
      [userId, hash, expiresAt]
    );
  },

  async revoke(hash) {
    await pool.query(
      'UPDATE refresh_tokens SET revoked = 1 WHERE token_hash = ?',
      [hash]
    );
  }
};
