import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from './schema.js';
import { logger } from '../utils/logger.js';

const { Pool } = pg;

let db: ReturnType<typeof drizzle>;

export async function initializeDatabase() {
  try {
    if (!process.env.DATABASE_URL) {
      logger.warn('DATABASE_URL not set, database will not be available');
      return null;
    }

    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 10, // Reduced for serverless
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });

    db = drizzle(pool, { schema });

    // Test connection
    await pool.query('SELECT NOW()');
    logger.info('Database connection established');

    return db;
  } catch (error) {
    logger.error('Failed to connect to database:', error);
    // Don't throw - let the app start without DB
    return null;
  }
}

export function getDb() {
  if (!db) {
    throw new Error('Database not initialized. Call initializeDatabase first.');
  }
  return db;
}

export { schema };
