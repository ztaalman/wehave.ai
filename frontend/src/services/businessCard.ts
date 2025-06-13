import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

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
  created_at: string;
  updated_at: string;
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

export const businessCardService = {
  async getCard(): Promise<BusinessCard> {
    const response = await axios.get(`${API_URL}/business-cards`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  },

  async createOrUpdateCard(cardData: BusinessCardInput): Promise<BusinessCard> {
    const response = await axios.post(
      `${API_URL}/business-cards`,
      cardData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    return response.data;
  },

  async getQRCode(): Promise<{ qrCode: string }> {
    const response = await axios.get(`${API_URL}/business-cards/qr-code`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  },

  async deleteCard(): Promise<void> {
    await axios.delete(`${API_URL}/business-cards`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
  },
}; 