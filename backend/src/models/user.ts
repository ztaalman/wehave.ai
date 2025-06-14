import bcrypt from 'bcryptjs';
import pool from '../config/database';

export interface User {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  created_at: Date;
  updated_at: Date;
}

export interface UserInput {
  name: string;
  email: string;
  password: string;
}

class UserModel {
  async create(userData: UserInput): Promise<User> {
    const { name, email, password } = userData;
    const password_hash = await bcrypt.hash(password, 10);

    const query = `
      INSERT INTO users (name, email, password_hash)
      VALUES ($1, $2, $3)
      RETURNING *
    `;

    const values = [name, email, password_hash];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  async findByEmail(email: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE email = $1';
    const { rows } = await pool.query(query, [email]);
    return rows[0] || null;
  }

  async findById(id: number): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE id = $1';
    const { rows } = await pool.query(query, [id]);
    return rows[0] || null;
  }

  async verifyPassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password_hash);
  }

  async update(id: number, userData: Partial<UserInput>): Promise<User | null> {
    const updates: string[] = [];
    const values: any[] = [];
    let valueIndex = 1;

    if (userData.name) {
      updates.push(`name = $${valueIndex}`);
      values.push(userData.name);
      valueIndex++;
    }

    if (userData.email) {
      updates.push(`email = $${valueIndex}`);
      values.push(userData.email);
      valueIndex++;
    }

    if (userData.password) {
      const password_hash = await bcrypt.hash(userData.password, 10);
      updates.push(`password_hash = $${valueIndex}`);
      values.push(password_hash);
      valueIndex++;
    }

    if (updates.length === 0) {
      return null;
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = `
      UPDATE users
      SET ${updates.join(', ')}
      WHERE id = $${valueIndex}
      RETURNING *
    `;

    const { rows } = await pool.query(query, values);
    return rows[0] || null;
  }

  async delete(id: number): Promise<boolean> {
    const query = 'DELETE FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return (result.rowCount ?? 0) > 0;
  }
}

export default new UserModel(); 