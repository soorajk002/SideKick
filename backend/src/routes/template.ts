import express from 'express';
import { getDb } from '../db/index.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

// Get all public templates
router.get('/', async (req, res, next) => {
  try {
    const db = getDb();

    const templates = await db.query.templates.findMany({
      where: (templates, { eq }) => eq(templates.isPublic, true),
      orderBy: (templates, { asc }) => [asc(templates.name)],
    });

    res.json(templates);
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

    const template = await db.query.templates.findFirst({
      where: (templates, { eq }) => eq(templates.id, id),
    });

    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }

    res.json(template);
  } catch (error) {
    next(error);
  }
});

export default router;
