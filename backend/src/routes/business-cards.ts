import express, { Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth';
import { BusinessCardModel, BusinessCardInput } from '../models/business-card';
import { QRCodeService } from '../services/qr-code';

const router = express.Router();

interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
  };
}

// Get user's business card
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const card = await BusinessCardModel.findByUserId(userId);
    if (!card) {
      return res.status(404).json({ error: 'Business card not found' });
    }

    res.json(card);
  } catch (error) {
    console.error('Error fetching business card:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create or update business card
router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const cardData: BusinessCardInput = req.body;
    let card = await BusinessCardModel.findByUserId(userId);

    if (card) {
      card = await BusinessCardModel.update(userId, cardData);
    } else {
      card = await BusinessCardModel.create(userId, cardData);
    }

    // Generate QR code
    const qrCode = await QRCodeService.generateQRCode(card!);
    card = await BusinessCardModel.updateQRCode(userId, qrCode);

    res.json(card);
  } catch (error) {
    console.error('Error creating/updating business card:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get QR code for business card
router.get('/qr-code', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const card = await BusinessCardModel.findByUserId(userId);
    if (!card) {
      return res.status(404).json({ error: 'Business card not found' });
    }

    const qrCode = await QRCodeService.generateQRCode(card!);
    res.json({ qrCode });
  } catch (error) {
    console.error('Error generating QR code:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete business card
router.delete('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const success = await BusinessCardModel.delete(userId);
    if (!success) {
      return res.status(404).json({ error: 'Business card not found' });
    }

    res.json({ message: 'Business card deleted successfully' });
  } catch (error) {
    console.error('Error deleting business card:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router; 