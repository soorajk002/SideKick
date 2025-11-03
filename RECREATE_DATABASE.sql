-- =====================================================
-- SIDEKICK DATABASE SCHEMA RECREATION
-- Run this in Supabase SQL Editor
-- =====================================================

-- Drop all existing tables (clean slate)
DROP TABLE IF EXISTS action_items CASCADE;
DROP TABLE IF EXISTS meeting_notes CASCADE;
DROP TABLE IF EXISTS checklist_items CASCADE;
DROP TABLE IF EXISTS template_items CASCADE;
DROP TABLE IF EXISTS checklists CASCADE;
DROP TABLE IF EXISTS meetings CASCADE;
DROP TABLE IF EXISTS templates CASCADE;
DROP TABLE IF EXISTS organization_members CASCADE;
DROP TABLE IF EXISTS organizations CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- =====================================================
-- USERS TABLE
-- =====================================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255),
  full_name VARCHAR(255),
  avatar_url TEXT,
  timezone VARCHAR(50) DEFAULT 'UTC',

  -- OAuth
  google_id VARCHAR(255) UNIQUE,
  microsoft_id VARCHAR(255) UNIQUE,
  zoom_id VARCHAR(255) UNIQUE,

  -- Preferences
  preferences JSONB DEFAULT '{}',

  -- Status
  is_active BOOLEAN DEFAULT true,
  is_email_verified BOOLEAN DEFAULT false,
  last_login_at TIMESTAMP,

  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
  deleted_at TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_google_id ON users(google_id);

-- =====================================================
-- ORGANIZATIONS TABLE
-- =====================================================
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  logo_url TEXT,

  -- Owner
  owner_id UUID REFERENCES users(id) ON DELETE CASCADE,

  -- Settings
  settings JSONB DEFAULT '{}',

  -- Billing
  stripe_customer_id VARCHAR(255) UNIQUE,
  subscription_status VARCHAR(50) DEFAULT 'trialing',
  subscription_plan VARCHAR(50) DEFAULT 'free',
  subscription_seats INTEGER DEFAULT 1,
  billing_email VARCHAR(255),

  -- Limits
  monthly_meeting_limit INTEGER DEFAULT 5,
  ai_credits_limit INTEGER DEFAULT 0,
  ai_credits_used INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
  deleted_at TIMESTAMP
);

CREATE UNIQUE INDEX idx_organizations_slug ON organizations(slug);

-- =====================================================
-- ORGANIZATION MEMBERS TABLE
-- =====================================================
CREATE TABLE organization_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,

  -- Role
  role VARCHAR(50) DEFAULT 'member' NOT NULL,

  -- Permissions
  permissions JSONB DEFAULT '{}',

  -- Invitation
  invited_by UUID REFERENCES users(id),
  invited_at TIMESTAMP,
  accepted_at TIMESTAMP,

  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_org_members_org_id ON organization_members(organization_id);
CREATE INDEX idx_org_members_user_id ON organization_members(user_id);

-- =====================================================
-- TEMPLATES TABLE
-- =====================================================
CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),

  -- Items
  items JSONB NOT NULL,

  -- Ownership
  created_by UUID REFERENCES users(id),
  organization_id UUID REFERENCES organizations(id),

  -- Visibility
  is_public BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,

  -- Stats
  usage_count INTEGER DEFAULT 0,
  avg_completion_rate DECIMAL(5,2),

  -- AI
  ai_enabled BOOLEAN DEFAULT false,
  ai_prompts JSONB,

  -- Tags
  tags TEXT[],

  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
  deleted_at TIMESTAMP
);

CREATE INDEX idx_templates_category ON templates(category);
CREATE INDEX idx_templates_created_by ON templates(created_by);

-- =====================================================
-- TEMPLATE ITEMS TABLE
-- =====================================================
CREATE TABLE template_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES templates(id) ON DELETE CASCADE NOT NULL,

  title VARCHAR(500) NOT NULL,
  description TEXT,
  "order" INTEGER NOT NULL,

  category VARCHAR(100),
  is_required BOOLEAN DEFAULT false,
  ai_keywords TEXT[],

  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_template_items_template_id ON template_items(template_id);

-- =====================================================
-- MEETINGS TABLE
-- =====================================================
CREATE TABLE meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Zoom details
  zoom_meeting_id VARCHAR(255),
  zoom_meeting_uuid VARCHAR(255),

  -- Metadata
  title VARCHAR(255),
  start_time TIMESTAMP,
  end_time TIMESTAMP,
  duration INTEGER,

  -- Participants
  host_user_id UUID REFERENCES users(id),
  organization_id UUID REFERENCES organizations(id),
  participant_count INTEGER DEFAULT 1,
  participants JSONB,

  -- Recording & Transcript
  recording_url TEXT,
  transcript_url TEXT,
  transcript_text TEXT,

  -- Deal tracking
  deal_stage VARCHAR(100),
  deal_value DECIMAL(12,2),
  outcome VARCHAR(100),

  -- AI Analysis
  ai_summary TEXT,
  ai_sentiment VARCHAR(50),
  ai_key_points JSONB,
  ai_action_items JSONB,
  ai_analyzed_at TIMESTAMP,

  -- Notes
  notes TEXT,

  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
  deleted_at TIMESTAMP
);

CREATE INDEX idx_meetings_zoom_id ON meetings(zoom_meeting_id);
CREATE INDEX idx_meetings_host ON meetings(host_user_id);
CREATE INDEX idx_meetings_org ON meetings(organization_id);

-- =====================================================
-- CHECKLISTS TABLE
-- =====================================================
CREATE TABLE checklists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Links
  template_id UUID REFERENCES templates(id),
  meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  organization_id UUID REFERENCES organizations(id),

  -- Data
  name VARCHAR(255) NOT NULL,
  items JSONB NOT NULL,

  -- Progress
  total_items INTEGER NOT NULL,
  completed_items INTEGER DEFAULT 0,
  completion_percentage DECIMAL(5,2) DEFAULT 0,

  -- AI
  ai_enabled BOOLEAN DEFAULT false,
  ai_analysis JSONB,

  -- Timestamps
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_checklists_meeting ON checklists(meeting_id);
CREATE INDEX idx_checklists_template ON checklists(template_id);

-- =====================================================
-- CHECKLIST ITEMS TABLE
-- =====================================================
CREATE TABLE checklist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  checklist_id UUID REFERENCES checklists(id) ON DELETE CASCADE NOT NULL,
  template_item_id UUID REFERENCES template_items(id),

  title VARCHAR(500) NOT NULL,
  description TEXT,
  "order" INTEGER NOT NULL,

  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP,
  completed_by UUID REFERENCES users(id),

  -- AI
  ai_checked BOOLEAN DEFAULT false,
  ai_confidence DECIMAL(5,2),
  ai_reasoning TEXT,
  ai_evidence JSONB,

  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_checklist_items_checklist_id ON checklist_items(checklist_id);

-- =====================================================
-- MEETING NOTES TABLE
-- =====================================================
CREATE TABLE meeting_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id),

  content TEXT NOT NULL,
  note_type VARCHAR(50),

  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_meeting_notes_meeting ON meeting_notes(meeting_id);

-- =====================================================
-- ACTION ITEMS TABLE
-- =====================================================
CREATE TABLE action_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE NOT NULL,

  title VARCHAR(500) NOT NULL,
  description TEXT,

  assigned_to UUID REFERENCES users(id),
  due_date TIMESTAMP,
  priority VARCHAR(50),
  status VARCHAR(50) DEFAULT 'pending',

  completed_at TIMESTAMP,

  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_action_items_meeting ON action_items(meeting_id);
CREATE INDEX idx_action_items_assigned ON action_items(assigned_to);

-- =====================================================
-- COMPLETE!
-- =====================================================
-- All tables created successfully
-- You can now use the application
