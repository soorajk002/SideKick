import { getDb, initializeDatabase } from './index.js';
import { templates } from './schema.js';
import { logger } from '../utils/logger.js';

const defaultTemplates = [
  {
    name: 'Discovery Call',
    description: 'Essential questions for understanding prospect needs',
    category: 'Sales',
    isPublic: true,
    items: [
      { content: 'Introduction and agenda setting', order: 0 },
      { content: 'Current challenges and pain points', order: 1 },
      { content: 'Goals and desired outcomes', order: 2 },
      { content: 'Budget and timeline discussion', order: 3 },
      { content: 'Decision-making process', order: 4 },
      { content: 'Key stakeholders identification', order: 5 },
      { content: 'Current solution evaluation', order: 6 },
      { content: 'Success metrics definition', order: 7 },
      { content: 'Next steps and follow-up', order: 8 },
    ],
  },
  {
    name: 'Product Demo',
    description: 'Structured demo flow to showcase value',
    category: 'Sales',
    isPublic: true,
    items: [
      { content: 'Recap needs from discovery', order: 0 },
      { content: 'Set demo agenda and objectives', order: 1 },
      { content: 'Show key features solving their pain points', order: 2 },
      { content: 'Demonstrate ROI and value proposition', order: 3 },
      { content: 'Handle objections and questions', order: 4 },
      { content: 'Discuss pricing and packages', order: 5 },
      { content: 'Get commitment for next steps', order: 6 },
    ],
  },
  {
    name: 'Closing Call',
    description: 'Final steps to close the deal',
    category: 'Sales',
    isPublic: true,
    items: [
      { content: 'Review contract terms and conditions', order: 0 },
      { content: 'Address final concerns and objections', order: 1 },
      { content: 'Confirm pricing and payment terms', order: 2 },
      { content: 'Discuss implementation timeline', order: 3 },
      { content: 'Introduce customer success team', order: 4 },
      { content: 'Outline onboarding process', order: 5 },
      { content: 'Get signature commitment', order: 6 },
      { content: 'Schedule kickoff meeting', order: 7 },
    ],
  },
  {
    name: 'Follow-up Call',
    description: 'Structured follow-up after initial meeting',
    category: 'Sales',
    isPublic: true,
    items: [
      { content: 'Recap previous meeting highlights', order: 0 },
      { content: 'Address questions from last call', order: 1 },
      { content: 'Share additional resources/case studies', order: 2 },
      { content: 'Discuss stakeholder feedback', order: 3 },
      { content: 'Review proposal or next steps', order: 4 },
      { content: 'Set timeline for decision', order: 5 },
    ],
  },
  {
    name: 'Qualification Call',
    description: 'Qualify leads efficiently',
    category: 'Sales',
    isPublic: true,
    items: [
      { content: 'Verify contact information', order: 0 },
      { content: 'Confirm budget availability', order: 1 },
      { content: 'Identify decision maker', order: 2 },
      { content: 'Understand timeline urgency', order: 3 },
      { content: 'Assess fit with product offering', order: 4 },
      { content: 'Determine next step opportunity', order: 5 },
    ],
  },
];

export async function seedDatabase() {
  try {
    logger.info('Starting database seeding...');

    await initializeDatabase();
    const db = getDb();

    // Insert default templates
    for (const template of defaultTemplates) {
      await db.insert(templates).values(template as any);
      logger.info(`Inserted template: ${template.name}`);
    }

    logger.info('Database seeding completed successfully');
  } catch (error) {
    logger.error('Failed to seed database:', error);
    throw error;
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
