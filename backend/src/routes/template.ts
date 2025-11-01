import express from 'express';
import { eq, asc } from 'drizzle-orm';
import { getDb } from '../db/index.js';
import { templates } from '../db/schema.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

// Get all public templates
router.get('/', async (req, res, next) => {
  try {
    const db = getDb();

    const results = await db.select().from(templates).where(eq(templates.isPublic, true)).orderBy(asc(templates.name));

    res.json(results);
  } catch (error) {
    logger.error('Failed to fetch templates:', error);
    // Return empty array if database is not set up yet
    res.json([]);
  }
});

// Get template by ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const db = getDb();

    const results = await db.select().from(templates).where(eq(templates.id, id)).limit(1);
    const template = results[0];

    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }

    res.json(template);
  } catch (error) {
    next(error);
  }
});

export default router;
