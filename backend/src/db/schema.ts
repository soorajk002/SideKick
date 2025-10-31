import { pgTable, uuid, text, timestamp, boolean, integer, jsonb, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  zoomUserId: varchar('zoom_user_id', { length: 255 }).unique().notNull(),
  email: varchar('email', { length: 255 }),
  name: varchar('name', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Templates table
export const templates = pgTable('templates', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  category: varchar('category', { length: 100 }),
  items: jsonb('items').notNull(), // Array of template items
  isPublic: boolean('is_public').default(false).notNull(),
  createdBy: uuid('created_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Checklists table
export const checklists = pgTable('checklists', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  templateId: uuid('template_id').references(() => templates.id),
  meetingId: varchar('meeting_id', { length: 255 }).notNull(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  items: jsonb('items').notNull(), // Array of checklist items
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Transcriptions table (stores conversation transcripts)
export const transcriptions = pgTable('transcriptions', {
  id: uuid('id').primaryKey().defaultRandom(),
  meetingId: varchar('meeting_id', { length: 255 }).notNull(),
  speaker: varchar('speaker', { length: 255 }),
  speakerId: varchar('speaker_id', { length: 255 }),
  text: text('text').notNull(),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
  analyzedAt: timestamp('analyzed_at'),
});

// Checklist item matches (records when AI matches conversation to checklist items)
export const checklistMatches = pgTable('checklist_matches', {
  id: uuid('id').primaryKey().defaultRandom(),
  checklistId: uuid('checklist_id').references(() => checklists.id).notNull(),
  itemId: varchar('item_id', { length: 255 }).notNull(),
  transcriptionId: uuid('transcription_id').references(() => transcriptions.id),
  confidence: integer('confidence').notNull(), // 0-100
  matchedText: text('matched_text'),
  matchedAt: timestamp('matched_at').defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  checklists: many(checklists),
  templates: many(templates),
}));

export const templatesRelations = relations(templates, ({ one, many }) => ({
  createdBy: one(users, {
    fields: [templates.createdBy],
    references: [users.id],
  }),
  checklists: many(checklists),
}));

export const checklistsRelations = relations(checklists, ({ one, many }) => ({
  user: one(users, {
    fields: [checklists.userId],
    references: [users.id],
  }),
  template: one(templates, {
    fields: [checklists.templateId],
    references: [templates.id],
  }),
  matches: many(checklistMatches),
}));

export const transcriptionsRelations = relations(transcriptions, ({ many }) => ({
  matches: many(checklistMatches),
}));

export const checklistMatchesRelations = relations(checklistMatches, ({ one }) => ({
  checklist: one(checklists, {
    fields: [checklistMatches.checklistId],
    references: [checklists.id],
  }),
  transcription: one(transcriptions, {
    fields: [checklistMatches.transcriptionId],
    references: [transcriptions.id],
  }),
}));
