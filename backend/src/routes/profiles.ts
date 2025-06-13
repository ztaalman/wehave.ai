import express, { Request, Response } from 'express';
import profileModel from '../models/profile';
import aiService from '../services/ai';
import { auth } from '../middleware/auth';

interface AuthRequest extends Request {
  user?: any;
}

const router = express.Router();

// Create or update profile
router.post('/', auth, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const profileData = req.body;

    // Generate AI-enhanced profile content
    const aiProfile = await aiService.generateProfile({
      name: req.user.name,
      skills: profileData.skills || [],
      experience: JSON.stringify(profileData.experience || {}),
      education: JSON.stringify(profileData.education || {}),
      interests: profileData.interests || [],
    });

    // Update profile with AI-generated content
    const updatedData = {
      ...profileData,
      bio: aiProfile,
    };

    // Check if profile exists
    const existingProfile = await profileModel.findByUserId(userId);
    let profile;

    if (existingProfile) {
      profile = await profileModel.update(userId, updatedData);
    } else {
      profile = await profileModel.create(userId, updatedData);
    }

    res.json(profile);
  } catch (error) {
    res.status(400).json({ error: 'Error creating/updating profile' });
  }
});

// Get user profile
router.get('/', auth, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const profile = await profileModel.findByUserId(userId);

    if (!profile) {
      res.status(404).json({ error: 'Profile not found' });
      return;
    }

    res.json(profile);
  } catch (error) {
    res.status(400).json({ error: 'Error fetching profile' });
  }
});

// Update profile
router.patch('/', auth, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const updates = req.body;

    const profile = await profileModel.update(userId, updates);
    if (!profile) {
      res.status(404).json({ error: 'Profile not found' });
      return;
    }

    res.json(profile);
  } catch (error) {
    res.status(400).json({ error: 'Error updating profile' });
  }
});

// Delete profile
router.delete('/', auth, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const deleted = await profileModel.delete(userId);

    if (!deleted) {
      res.status(404).json({ error: 'Profile not found' });
      return;
    }

    res.json({ message: 'Profile deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Error deleting profile' });
  }
});

export default router; 