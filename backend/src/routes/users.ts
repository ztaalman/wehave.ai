import express, { Request, Response } from 'express';
import userModel from '../models/user';
import { auth, generateToken } from '../middleware/auth';

interface AuthRequest extends Request {
  user?: any;
}

const router = express.Router();

// Register a new user
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await userModel.findByEmail(email);
    if (existingUser) {
      res.status(400).json({ error: 'Email already registered' });
      return;
    }

    // Create new user
    const user = await userModel.create({ name, email, password });
    const token = generateToken(user.id);

    res.status(201).json({ user, token });
  } catch (error) {
    res.status(400).json({ error: 'Error creating user' });
  }
});

// Login user
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await userModel.findByEmail(email);
    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // Verify password
    const isPasswordValid = await userModel.verifyPassword(user, password);
    if (!isPasswordValid) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // Generate token
    const token = generateToken(user.id);

    res.json({ user, token });
  } catch (error) {
    res.status(400).json({ error: 'Error logging in' });
  }
});

// Get user profile
router.get('/profile', auth, async (req: AuthRequest, res: Response) => {
  try {
    const user = await userModel.findById(req.user.id);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: 'Error fetching profile' });
  }
});

// Update user profile
router.patch('/profile', auth, async (req: AuthRequest, res: Response) => {
  try {
    const updates = req.body;
    const user = await userModel.update(req.user.id, updates);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: 'Error updating profile' });
  }
});

// Delete user account
router.delete('/profile', auth, async (req: AuthRequest, res: Response) => {
  try {
    const deleted = await userModel.delete(req.user.id);
    if (!deleted) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Error deleting account' });
  }
});

export default router; 