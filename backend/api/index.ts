import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { logger } from '../src/utils/logger';
import { errorHandler } from '../src/middleware/errorHandler';
import checklistRouter from '../src/routes/checklist';
import templateRouter from '../src/routes/template';
import webhookRouter from '../src/routes/webhook';
import { initializeDatabase } from '../src/db/index';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize database on cold start
let dbInitialized = false;
app.use(async (req, res, next) => {
  if (!dbInitialized) {
    try {
      await initializeDatabase();
      dbInitialized = true;
      logger.info('Database initialized');
    } catch (error) {
      logger.error('Failed to initialize database:', error);
    }
  }
  next();
});

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/checklists', checklistRouter);
app.use('/api/templates', templateRouter);
app.use('/api/webhooks', webhookRouter);

// Error handling
app.use(errorHandler);

// Export for Vercel serverless
export default app;
