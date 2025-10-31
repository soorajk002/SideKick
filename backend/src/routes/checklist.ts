import express from 'express';
import { z } from 'zod';
import { getDb } from '../db/index.js';
import { checklists, users } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { AppError } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

// Validation schemas
const createChecklistSchema = z.object({
  templateId: z.string().uuid(),
  meetingId: z.string(),
  userId: z.string(),
});

const createCustomChecklistSchema = z.object({
  name: z.string().min(1),
  items: z.array(z.string()),
  meetingId: z.string(),
  userId: z.string(),
});

// Create checklist from template
router.post('/', async (req, res, next) => {
  try {
    const { templateId, meetingId, userId } = createChecklistSchema.parse(req.body);

    const db = getDb();

    // Get template
    const template = await db.query.templates.findFirst({
      where: (templates, { eq }) => eq(templates.id, templateId),
    });

    if (!template) {
      throw new AppError('Template not found', 404);
    }

    // Ensure user exists or create
    let user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.zoomUserId, userId),
    });

    if (!user) {
      const [newUser] = await db.insert(users).values({
        zoomUserId: userId,
      }).returning();
      user = newUser;
    }

    // Transform template items to checklist items
    const items = (template.items as any[]).map((item, index) => ({
      id: `item-${Date.now()}-${index}`,
      content: item.content,
      description: item.description,
      completed: false,
      autoChecked: false,
      order: item.order || index,
    }));

    // Create checklist
    const [checklist] = await db.insert(checklists).values({
      name: template.name,
      templateId: template.id,
      meetingId,
      userId: user.id,
      items: items as any,
    }).returning();

    logger.info(`Checklist created: ${checklist.id} for meeting ${meetingId}`);

    res.json(checklist);
  } catch (error) {
    next(error);
  }
});

// Create custom checklist
router.post('/custom', async (req, res, next) => {
  try {
    const { name, items: itemContents, meetingId, userId } = createCustomChecklistSchema.parse(req.body);

    const db = getDb();

    // Ensure user exists or create
    let user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.zoomUserId, userId),
    });

    if (!user) {
      const [newUser] = await db.insert(users).values({
        zoomUserId: userId,
      }).returning();
      user = newUser;
    }

    // Create checklist items
    const items = itemContents.map((content, index) => ({
      id: `item-${Date.now()}-${index}`,
      content,
      completed: false,
      autoChecked: false,
      order: index,
    }));

    // Create checklist
    const [checklist] = await db.insert(checklists).values({
      name,
      meetingId,
      userId: user.id,
      items: items as any,
    }).returning();

    logger.info(`Custom checklist created: ${checklist.id} for meeting ${meetingId}`);

    res.json(checklist);
  } catch (error) {
    next(error);
  }
});

// Get checklist by meeting ID
router.get('/meeting/:meetingId', async (req, res, next) => {
  try {
    const { meetingId } = req.params;
    const db = getDb();

    const checklist = await db.query.checklists.findFirst({
      where: (checklists, { eq }) => eq(checklists.meetingId, meetingId),
    });

    if (!checklist) {
      throw new AppError('Checklist not found', 404);
    }

    res.json(checklist);
  } catch (error) {
    next(error);
  }
});

// Update checklist
router.patch('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { items } = req.body;

    const db = getDb();

    const [updatedChecklist] = await db
      .update(checklists)
      .set({ items: items as any, updatedAt: new Date() })
      .where(eq(checklists.id, id))
      .returning();

    if (!updatedChecklist) {
      throw new AppError('Checklist not found', 404);
    }

    res.json(updatedChecklist);
  } catch (error) {
    next(error);
  }
});

export default router;
