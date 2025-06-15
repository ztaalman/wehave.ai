import { Request, Response, NextFunction } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
// Select correct user model depending on environment flag (currently unused here,
// but required to satisfy the instruction and future-proof the middleware).
import postgresUserModel from '../models/user';
import mockUserModel from '../models/user-mock';

const userModel =
  process.env.USE_MOCK_DATA === 'true' ? mockUserModel : postgresUserModel;

interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
  };
}

/**
 * JWT secret handling
 * ---------------------------------------------------------------------------
 * In production you **must** supply `JWT_SECRET`. If it’s missing we fall back
 * to a hard-coded value so the app can still run in test / mock mode, while
 * printing a warning to the console.
 */
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-test-secret';
if (!process.env.JWT_SECRET) {
  // eslint-disable-next-line no-console
  console.warn(
    '⚠️  JWT_SECRET is not set – falling back to an insecure test secret. ' +
      'Set JWT_SECRET in production!'
  );
}

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
    JWT_SECRET,
    options
  );
};

export const auth = authenticateToken; 