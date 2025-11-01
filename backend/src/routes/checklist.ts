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
    const { templates } = await import('../db/schema.js');
    const templateResults = await db.select().from(templates).where(eq(templates.id, templateId)).limit(1);
    const template = templateResults[0];

    if (!template) {
      throw new AppError('Template not found', 404);
    }

    // Ensure user exists or create
    const userResults = await db.select().from(users).where(eq(users.zoomUserId, userId)).limit(1);
    let user = userResults[0];

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
    const userResults = await db.select().from(users).where(eq(users.zoomUserId, userId)).limit(1);
    let user = userResults[0];

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

    const checklistResults = await db.select().from(checklists).where(eq(checklists.meetingId, meetingId)).limit(1);
    const checklist = checklistResults[0];

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
