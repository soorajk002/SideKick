import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from './schema.js';
import { logger } from '../utils/logger.js';

const { Pool } = pg;

let db: ReturnType<typeof drizzle>;

export async function initializeDatabase() {
  try {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    db = drizzle(pool, { schema });

    // Test connection
    await pool.query('SELECT NOW()');
    logger.info('Database connection established');

    return db;
  } catch (error) {
    logger.error('Failed to connect to database:', error);
    throw error;
  }
}

export function getDb() {
  if (!db) {
    throw new Error('Database not initialized. Call initializeDatabase first.');
  }
  return db;
}

export { schema };
