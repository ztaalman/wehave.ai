import QRCode from 'qrcode';
import { BusinessCard } from '../models/business-card';

export class QRCodeService {
  static async generateQRCode(card: BusinessCard): Promise<string> {
    try {
      // Create a URL-friendly version of the card data
      const cardData = {
        name: card.name,
        title: card.title,
        company: card.company,
        email: card.email,
        phone: card.phone,
        website: card.website,
        address: card.address
      };

      // Convert the card data to a URL
      const cardUrl = `${process.env.FRONTEND_URL}/card/${card.id}`;
      
      // Generate QR code as data URL
      const qrCodeDataUrl = await QRCode.toDataURL(cardUrl, {
        errorCorrectionLevel: 'H',
        margin: 1,
        width: 300,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      });

      return qrCodeDataUrl;
    } catch (error) {
      console.error('Error generating QR code:', error);
      throw new Error('Failed to generate QR code');
    }
  }
} 