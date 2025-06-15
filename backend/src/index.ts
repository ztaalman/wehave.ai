import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import businessCardRoutes from './routes/business-cards';
import profileRoutes from './routes/profiles';
import userRoutes from './routes/users';

// Create Express app
const app = express();

/**
 * Render (and most PaaS providers) expose the port your service must listen on
 * via the PORT environment variable. Fall back to 3001 for local development.
 */
const port = Number(process.env.PORT) || 3001;

/**
 * ---------------------------------------------------------------------------
 *  Database (mock-mode toggle)
 * ---------------------------------------------------------------------------
 * While we are still wiring up a real database we allow the backend to start
 * without one. Setting USE_MOCK_DATA=true (recommended for Render testing)
 * skips any Postgres connection logic. When you are ready to connect a real
 * database simply unset that flag and provide a valid DATABASE_URL.
 */
const useMockData = process.env.USE_MOCK_DATA === 'true';

if (useMockData) {
  // eslint-disable-next-line no-console
  console.log('⚠️  WEHAVE.AI backend running in MOCK DATA mode – no database connection');
} else {
  // eslint-disable-next-line no-console
  console.log('ℹ️  WEHAVE.AI backend running in NORMAL mode – database connection expected');
  // Real database pool initialisation should live in /src/config/database.ts
  // and will automatically be used by the model layer.
}

// CORS configuration - allow any origin for now to resolve persistent preflight 404 issues
const corsOptions: cors.CorsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200 // some legacy browsers (IE11) choke on 204
};

// Middleware
app.use(cors(corsOptions));

// Explicit OPTIONS handler (acts as a safety net)
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// Routes
app.use('/api/business-cards', businessCardRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/users', userRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to WeHave.ai API' });
});

// ---------------------------------------------------------------------------
// Start server / diagnostics
// ---------------------------------------------------------------------------

// Helpful diagnostics for remote deployments (e.g. Render)
console.log('---------------------------------------------');
console.log(`NODE_ENV     : ${process.env.NODE_ENV || 'development'}`);
console.log(`USE_MOCK_DATA: ${useMockData}`);
console.log(`PORT         : ${port}`);
console.log('---------------------------------------------');

// ---------------------------------------------------------------------------
// Error-handling middleware & type
// ---------------------------------------------------------------------------

interface ErrorResponse extends Error {
  status?: number;
}

app.use((err: ErrorResponse, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || 'Something went wrong!',
    status
  });
});

// ---------------------------------------------------------------------------
// Start server
// ---------------------------------------------------------------------------

const server = app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 WeHave.ai API server listening on port ${port}`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    // When a real database pool is in use it should be closed here.
    process.exit(0);
  });
});
