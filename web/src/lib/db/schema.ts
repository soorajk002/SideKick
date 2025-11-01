import { pgTable, uuid, varchar, text, boolean, timestamp, integer, decimal, jsonb, index, uniqueIndex } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// =====================================================
// USERS
// =====================================================

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  emailVerified: boolean('email_verified').default(false),
  passwordHash: varchar('password_hash', { length: 255 }),
  fullName: varchar('full_name', { length: 255 }),
  avatarUrl: text('avatar_url'),
  timezone: varchar('timezone', { length: 50 }).default('UTC'),

  // OAuth
  googleId: varchar('google_id', { length: 255 }).unique(),
  microsoftId: varchar('microsoft_id', { length: 255 }).unique(),
  zoomId: varchar('zoom_id', { length: 255 }).unique(),

  // Preferences
  preferences: jsonb('preferences').default({}),

  // Status
  isActive: boolean('is_active').default(true),
  isEmailVerified: boolean('is_email_verified').default(false),
  lastLoginAt: timestamp('last_login_at'),

  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
}, (table) => ({
  emailIdx: index('idx_users_email').on(table.email),
  googleIdIdx: index('idx_users_google_id').on(table.googleId),
}))

// =====================================================
// ORGANIZATIONS
// =====================================================

export const organizations = pgTable('organizations', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  logoUrl: text('logo_url'),

  // Owner
  ownerId: uuid('owner_id').references(() => users.id, { onDelete: 'cascade' }),

  // Settings
  settings: jsonb('settings').default({}),

  // Billing
  stripeCustomerId: varchar('stripe_customer_id', { length: 255 }).unique(),
  subscriptionStatus: varchar('subscription_status', { length: 50 }).default('trialing'),
  subscriptionPlan: varchar('subscription_plan', { length: 50 }).default('free'),
  subscriptionSeats: integer('subscription_seats').default(1),
  billingEmail: varchar('billing_email', { length: 255 }),

  // Limits
  monthlyMeetingLimit: integer('monthly_meeting_limit').default(5),
  aiCreditsLimit: integer('ai_credits_limit').default(0),
  aiCreditsUsed: integer('ai_credits_used').default(0),

  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
}, (table) => ({
  slugIdx: uniqueIndex('idx_organizations_slug').on(table.slug),
}))

// =====================================================
// ORGANIZATION MEMBERS
// =====================================================

export const organizationMembers = pgTable('organization_members', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),

  // Role
  role: varchar('role', { length: 50 }).default('member').notNull(),

  // Permissions
  permissions: jsonb('permissions').default({}),

  // Invitation
  invitedBy: uuid('invited_by').references(() => users.id),
  invitedAt: timestamp('invited_at'),
  acceptedAt: timestamp('accepted_at'),

  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  orgIdx: index('idx_org_members_org_id').on(table.organizationId),
  userIdx: index('idx_org_members_user_id').on(table.userId),
}))

// =====================================================
// TEMPLATES
// =====================================================

export const templates = pgTable('templates', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  category: varchar('category', { length: 100 }),

  // Items
  items: jsonb('items').notNull(),

  // Ownership
  createdBy: uuid('created_by').references(() => users.id),
  organizationId: uuid('organization_id').references(() => organizations.id),

  // Visibility
  isPublic: boolean('is_public').default(false),
  isFeatured: boolean('is_featured').default(false),

  // Stats
  usageCount: integer('usage_count').default(0),
  avgCompletionRate: decimal('avg_completion_rate', { precision: 5, scale: 2 }),

  // AI
  aiEnabled: boolean('ai_enabled').default(false),
  aiPrompts: jsonb('ai_prompts'),

  // Tags
  tags: text('tags').array(),

  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
}, (table) => ({
  categoryIdx: index('idx_templates_category').on(table.category),
  createdByIdx: index('idx_templates_created_by').on(table.createdBy),
}))

// =====================================================
// MEETINGS
// =====================================================

export const meetings = pgTable('meetings', {
  id: uuid('id').primaryKey().defaultRandom(),

  // Zoom details
  zoomMeetingId: varchar('zoom_meeting_id', { length: 255 }),
  zoomMeetingUuid: varchar('zoom_meeting_uuid', { length: 255 }),

  // Metadata
  title: varchar('title', { length: 255 }),
  startTime: timestamp('start_time'),
  endTime: timestamp('end_time'),
  duration: integer('duration'),

  // Participants
  hostUserId: uuid('host_user_id').references(() => users.id),
  organizationId: uuid('organization_id').references(() => organizations.id),
  participantCount: integer('participant_count').default(1),
  participants: jsonb('participants'),

  // Recording
  recordingUrl: text('recording_url'),
  transcriptUrl: text('transcript_url'),
  transcriptText: text('transcript_text'),

  // Outcome
  outcome: varchar('outcome', { length: 50 }),
  dealStage: varchar('deal_stage', { length: 50 }),
  dealValue: decimal('deal_value', { precision: 10, scale: 2 }),

  // AI Analysis
  aiSummary: text('ai_summary'),
  aiSentiment: varchar('ai_sentiment', { length: 50 }),
  aiKeyPoints: jsonb('ai_key_points'),
  aiActionItems: jsonb('ai_action_items'),
  aiAnalyzedAt: timestamp('ai_analyzed_at'),

  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
}, (table) => ({
  zoomIdIdx: index('idx_meetings_zoom_meeting_id').on(table.zoomMeetingId),
  hostIdx: index('idx_meetings_host_user_id').on(table.hostUserId),
  orgIdx: index('idx_meetings_organization_id').on(table.organizationId),
}))

// =====================================================
// CHECKLISTS
// =====================================================

export const checklists = pgTable('checklists', {
  id: uuid('id').primaryKey().defaultRandom(),

  // Links
  templateId: uuid('template_id').references(() => templates.id),
  meetingId: uuid('meeting_id').references(() => meetings.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').references(() => users.id),
  organizationId: uuid('organization_id').references(() => organizations.id),

  // Data
  name: varchar('name', { length: 255 }).notNull(),
  items: jsonb('items').notNull(),

  // Progress
  totalItems: integer('total_items').notNull(),
  completedItems: integer('completed_items').default(0),
  completionPercentage: decimal('completion_percentage', { precision: 5, scale: 2 }).default('0'),

  // AI
  aiEnabled: boolean('ai_enabled').default(false),
  aiAnalysis: jsonb('ai_analysis'),

  // Timestamps
  startedAt: timestamp('started_at'),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  templateIdx: index('idx_checklists_template_id').on(table.templateId),
  meetingIdx: index('idx_checklists_meeting_id').on(table.meetingId),
  userIdx: index('idx_checklists_user_id').on(table.userId),
}))

// Export types
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert

export type Organization = typeof organizations.$inferSelect
export type NewOrganization = typeof organizations.$inferInsert

export type Template = typeof templates.$inferSelect
export type NewTemplate = typeof templates.$inferInsert

export type Meeting = typeof meetings.$inferSelect
export type NewMeeting = typeof meetings.$inferInsert

export type Checklist = typeof checklists.$inferSelect
export type NewChecklist = typeof checklists.$inferInsert
