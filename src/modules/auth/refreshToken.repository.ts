import { pool } from '../../config/db';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';

export const refreshTokenRepository = {
  async create(userId: number, tokenHash: string, expiresAt: Date): Promise<number> {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES (?, ?, ?)',
      [userId, tokenHash, expiresAt]
    );
    return result.insertId;
  },

  async findByHash(tokenHash: string): Promise<any> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM refresh_tokens WHERE token_hash = ? AND revoked_at IS NULL AND expires_at > NOW()',
      [tokenHash]
    );
    return rows.length > 0 ? rows[0] : null;
  },

  async revoke(tokenHash: string): Promise<void> {
    await pool.query(
      'UPDATE refresh_tokens SET revoked_at = NOW() WHERE token_hash = ?',
      [tokenHash]
    );
  }
};
