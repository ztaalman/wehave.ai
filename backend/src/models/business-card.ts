import { pool } from '../config/database';

export interface BusinessCard {
  id: number;
  user_id: number;
  name: string;
  title: string;
  company: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  qr_code: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface BusinessCardInput {
  name: string;
  title: string;
  company: string;
  email: string;
  phone: string;
  website: string;
  address: string;
}

export class BusinessCardModel {
  static async create(userId: number, cardData: BusinessCardInput): Promise<BusinessCard> {
    const { name, title, company, email, phone, website, address } = cardData;
    
    const result = await pool.query(
      `INSERT INTO business_cards 
       (user_id, name, title, company, email, phone, website, address) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING *`,
      [userId, name, title, company, email, phone, website, address]
    );

    return result.rows[0];
  }

  static async findByUserId(userId: number): Promise<BusinessCard | null> {
    const result = await pool.query(
      'SELECT * FROM business_cards WHERE user_id = $1',
      [userId]
    );

    return result.rows[0] || null;
  }

  static async update(userId: number, cardData: BusinessCardInput): Promise<BusinessCard | null> {
    const { name, title, company, email, phone, website, address } = cardData;
    
    const result = await pool.query(
      `UPDATE business_cards 
       SET name = $1, title = $2, company = $3, email = $4, 
           phone = $5, website = $6, address = $7, updated_at = NOW() 
       WHERE user_id = $8 
       RETURNING *`,
      [name, title, company, email, phone, website, address, userId]
    );

    return result.rows[0] || null;
  }

  static async updateQRCode(userId: number, qrCode: string): Promise<BusinessCard | null> {
    const result = await pool.query(
      `UPDATE business_cards 
       SET qr_code = $1, updated_at = NOW() 
       WHERE user_id = $2 
       RETURNING *`,
      [qrCode, userId]
    );

    return result.rows[0] || null;
  }

  static async delete(userId: number): Promise<boolean> {
    const result = await pool.query(
      'DELETE FROM business_cards WHERE user_id = $1',
      [userId]
    );

    return (result.rowCount ?? 0) > 0;
  }
} 