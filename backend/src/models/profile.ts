import pool from '../config/database';

export interface Profile {
  id: number;
  user_id: number;
  title: string;
  bio: string;
  skills: string[];
  experience: any;
  education: any;
  created_at: Date;
  updated_at: Date;
}

export interface ProfileInput {
  title?: string;
  bio?: string;
  skills?: string[];
  experience?: any;
  education?: any;
}

class ProfileModel {
  async create(userId: number, profileData: ProfileInput): Promise<Profile> {
    const { title, bio, skills, experience, education } = profileData;

    const query = `
      INSERT INTO profiles (user_id, title, bio, skills, experience, education)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;

    const values = [userId, title, bio, skills, experience, education];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  async findByUserId(userId: number): Promise<Profile | null> {
    const query = 'SELECT * FROM profiles WHERE user_id = $1';
    const { rows } = await pool.query(query, [userId]);
    return rows[0] || null;
  }

  async update(userId: number, profileData: ProfileInput): Promise<Profile | null> {
    const updates: string[] = [];
    const values: any[] = [];
    let valueIndex = 1;

    if (profileData.title !== undefined) {
      updates.push(`title = $${valueIndex}`);
      values.push(profileData.title);
      valueIndex++;
    }

    if (profileData.bio !== undefined) {
      updates.push(`bio = $${valueIndex}`);
      values.push(profileData.bio);
      valueIndex++;
    }

    if (profileData.skills !== undefined) {
      updates.push(`skills = $${valueIndex}`);
      values.push(profileData.skills);
      valueIndex++;
    }

    if (profileData.experience !== undefined) {
      updates.push(`experience = $${valueIndex}`);
      values.push(profileData.experience);
      valueIndex++;
    }

    if (profileData.education !== undefined) {
      updates.push(`education = $${valueIndex}`);
      values.push(profileData.education);
      valueIndex++;
    }

    if (updates.length === 0) {
      return null;
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(userId);

    const query = `
      UPDATE profiles
      SET ${updates.join(', ')}
      WHERE user_id = $${valueIndex}
      RETURNING *
    `;

    const { rows } = await pool.query(query, values);
    return rows[0] || null;
  }

  async delete(userId: number): Promise<boolean> {
    const query = 'DELETE FROM profiles WHERE user_id = $1';
    const result = await pool.query(query, [userId]);
    return (result.rowCount ?? 0) > 0;
  }
}

export default new ProfileModel(); 