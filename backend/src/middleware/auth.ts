import { Request, Response, NextFunction } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import userModel from '../models/user';

interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
  };
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: number;
      email: string;
    };
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

export const generateToken = (userId: number): string => {
  const expiresIn: string | number = process.env.JWT_EXPIRES_IN ?? '24h';
  const options: SignOptions = { expiresIn: expiresIn as any } as SignOptions;

  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || 'your-secret-key',
    options
  );
};

export const auth = authenticateToken; 