-- =====================================================
-- SIDEKICK SAAS - COMPLETE DATABASE SCHEMA V2
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- USERS & AUTHENTICATION
-- =====================================================

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  email_verified BOOLEAN DEFAULT false,
  password_hash VARCHAR(255), -- NULL for OAuth-only users
  full_name VARCHAR(255),
  avatar_url TEXT,
  timezone VARCHAR(50) DEFAULT 'UTC',

  -- OAuth providers
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
CREATE INDEX idx_users_microsoft_id ON users(microsoft_id);
CREATE INDEX idx_users_zoom_id ON users(zoom_id);

-- =====================================================
-- ORGANIZATIONS & TEAMS
-- =====================================================

CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  logo_url TEXT,

  -- Owner
  owner_id UUID REFERENCES users(id) ON DELETE CASCADE,

  -- Settings
  settings JSONB DEFAULT '{}',

  -- Billing
  stripe_customer_id VARCHAR(255) UNIQUE,
  subscription_status VARCHAR(50) DEFAULT 'trialing', -- trialing, active, past_due, canceled
  subscription_plan VARCHAR(50) DEFAULT 'free', -- free, pro, enterprise
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

CREATE INDEX idx_organizations_slug ON organizations(slug);
CREATE INDEX idx_organizations_owner_id ON organizations(owner_id);
CREATE INDEX idx_organizations_stripe_customer_id ON organizations(stripe_customer_id);

-- =====================================================
-- ORGANIZATION MEMBERS
-- =====================================================

CREATE TABLE IF NOT EXISTS organization_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,

  -- Role: owner, admin, manager, member, guest
  role VARCHAR(50) DEFAULT 'member' NOT NULL,

  -- Permissions (custom per-user overrides)
  permissions JSONB DEFAULT '{}',

  -- Invitation
  invited_by UUID REFERENCES users(id),
  invited_at TIMESTAMP,
  accepted_at TIMESTAMP,

  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL,

  UNIQUE(organization_id, user_id)
);

CREATE INDEX idx_org_members_org_id ON organization_members(organization_id);
CREATE INDEX idx_org_members_user_id ON organization_members(user_id);
CREATE INDEX idx_org_members_role ON organization_members(role);

-- =====================================================
-- TEMPLATES (Enhanced)
-- =====================================================

-- Drop existing table and recreate with new schema
DROP TABLE IF EXISTS templates CASCADE;

CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),

  -- Items with enhanced structure
  items JSONB NOT NULL, -- [{ id, content, order, type, ai_enabled, required }]

  -- Ownership
  created_by UUID REFERENCES users(id),
  organization_id UUID REFERENCES organizations(id), -- NULL for public templates

  -- Visibility
  is_public BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,

  -- Usage stats
  usage_count INTEGER DEFAULT 0,
  avg_completion_rate DECIMAL(5,2),

  -- AI Configuration
  ai_enabled BOOLEAN DEFAULT false,
  ai_prompts JSONB, -- Custom prompts for AI analysis

  -- Tags for categorization
  tags TEXT[],

  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
  deleted_at TIMESTAMP
);

CREATE INDEX idx_templates_category ON templates(category);
CREATE INDEX idx_templates_created_by ON templates(created_by);
CREATE INDEX idx_templates_organization_id ON templates(organization_id);
CREATE INDEX idx_templates_is_public ON templates(is_public);
CREATE INDEX idx_templates_tags ON templates USING GIN(tags);

-- =====================================================
-- MEETINGS
-- =====================================================

CREATE TABLE IF NOT EXISTS meetings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Zoom meeting details
  zoom_meeting_id VARCHAR(255),
  zoom_meeting_uuid VARCHAR(255),

  -- Meeting metadata
  title VARCHAR(255),
  start_time TIMESTAMP,
  end_time TIMESTAMP,
  duration INTEGER, -- in seconds

  -- Participants
  host_user_id UUID REFERENCES users(id),
  organization_id UUID REFERENCES organizations(id),
  participant_count INTEGER DEFAULT 1,
  participants JSONB, -- [{ id, name, email, role }]

  -- Recording
  recording_url TEXT,
  transcript_url TEXT,
  transcript_text TEXT,

  -- Meeting outcome
  outcome VARCHAR(50), -- scheduled, completed, no_show, canceled
  deal_stage VARCHAR(50), -- prospect, qualified, demo, proposal, closed_won, closed_lost
  deal_value DECIMAL(10,2),

  -- AI Analysis
  ai_summary TEXT,
  ai_sentiment VARCHAR(50), -- positive, neutral, negative
  ai_key_points JSONB,
  ai_action_items JSONB,
  ai_analyzed_at TIMESTAMP,

  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
  deleted_at TIMESTAMP
);

CREATE INDEX idx_meetings_zoom_meeting_id ON meetings(zoom_meeting_id);
CREATE INDEX idx_meetings_host_user_id ON meetings(host_user_id);
CREATE INDEX idx_meetings_organization_id ON meetings(organization_id);
CREATE INDEX idx_meetings_start_time ON meetings(start_time);
CREATE INDEX idx_meetings_outcome ON meetings(outcome);

-- =====================================================
-- CHECKLISTS (Enhanced)
-- =====================================================

-- Drop existing and recreate
DROP TABLE IF EXISTS checklists CASCADE;

CREATE TABLE checklists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Links
  template_id UUID REFERENCES templates(id),
  meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  organization_id UUID REFERENCES organizations(id),

  -- Checklist data
  name VARCHAR(255) NOT NULL,
  items JSONB NOT NULL, -- [{ id, content, checked, checked_at, checked_by, ai_checked, confidence, notes }]

  -- Progress
  total_items INTEGER NOT NULL,
  completed_items INTEGER DEFAULT 0,
  completion_percentage DECIMAL(5,2) DEFAULT 0,

  -- AI Auto-checking
  ai_enabled BOOLEAN DEFAULT false,
  ai_analysis JSONB, -- Detailed AI analysis per item

  -- Timestamps
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_checklists_template_id ON checklists(template_id);
CREATE INDEX idx_checklists_meeting_id ON checklists(meeting_id);
CREATE INDEX idx_checklists_user_id ON checklists(user_id);
CREATE INDEX idx_checklists_organization_id ON checklists(organization_id);
CREATE INDEX idx_checklists_created_at ON checklists(created_at);

-- =====================================================
-- MEETING NOTES
-- =====================================================

CREATE TABLE IF NOT EXISTS meeting_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE,
  checklist_item_id UUID, -- Reference to specific checklist item (stored in JSONB)

  -- Note content
  content TEXT NOT NULL,
  content_html TEXT, -- Rich text HTML

  -- Metadata
  created_by UUID REFERENCES users(id),
  note_type VARCHAR(50) DEFAULT 'general', -- general, action_item, objection, insight

  -- AI-generated
  is_ai_generated BOOLEAN DEFAULT false,
  ai_confidence DECIMAL(5,2),

  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
  deleted_at TIMESTAMP
);

CREATE INDEX idx_notes_meeting_id ON meeting_notes(meeting_id);
CREATE INDEX idx_notes_created_by ON meeting_notes(created_by);
CREATE INDEX idx_notes_note_type ON meeting_notes(note_type);

-- =====================================================
-- ACTION ITEMS
-- =====================================================

CREATE TABLE IF NOT EXISTS action_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE,

  -- Action details
  title VARCHAR(255) NOT NULL,
  description TEXT,

  -- Assignment
  assigned_to UUID REFERENCES users(id),
  assigned_by UUID REFERENCES users(id),

  -- Status
  status VARCHAR(50) DEFAULT 'open', -- open, in_progress, completed, canceled
  priority VARCHAR(50) DEFAULT 'medium', -- low, medium, high, urgent

  -- Due date
  due_date DATE,

  -- AI-extracted
  is_ai_generated BOOLEAN DEFAULT false,
  ai_confidence DECIMAL(5,2),

  -- Completion
  completed_at TIMESTAMP,
  completed_by UUID REFERENCES users(id),

  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_action_items_meeting_id ON action_items(meeting_id);
CREATE INDEX idx_action_items_assigned_to ON action_items(assigned_to);
CREATE INDEX idx_action_items_status ON action_items(status);
CREATE INDEX idx_action_items_due_date ON action_items(due_date);

-- =====================================================
-- ANALYTICS EVENTS
-- =====================================================

CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Event identification
  event_name VARCHAR(100) NOT NULL,
  event_type VARCHAR(50) NOT NULL, -- checklist_created, item_checked, meeting_completed, etc.

  -- Context
  user_id UUID REFERENCES users(id),
  organization_id UUID REFERENCES organizations(id),
  meeting_id UUID REFERENCES meetings(id),
  checklist_id UUID REFERENCES checklists(id),

  -- Event properties
  properties JSONB,

  -- Session info
  session_id UUID,
  ip_address INET,
  user_agent TEXT,

  -- Timestamp
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_events_event_name ON analytics_events(event_name);
CREATE INDEX idx_events_event_type ON analytics_events(event_type);
CREATE INDEX idx_events_user_id ON analytics_events(user_id);
CREATE INDEX idx_events_organization_id ON analytics_events(organization_id);
CREATE INDEX idx_events_created_at ON analytics_events(created_at);

-- =====================================================
-- SUBSCRIPTIONS
-- =====================================================

CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE UNIQUE,

  -- Stripe details
  stripe_subscription_id VARCHAR(255) UNIQUE,
  stripe_customer_id VARCHAR(255),
  stripe_price_id VARCHAR(255),

  -- Plan details
  plan VARCHAR(50) NOT NULL, -- free, pro, enterprise
  seats INTEGER DEFAULT 1,
  billing_interval VARCHAR(20), -- monthly, yearly

  -- Status
  status VARCHAR(50) NOT NULL, -- trialing, active, past_due, canceled, unpaid

  -- Dates
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  trial_start TIMESTAMP,
  trial_end TIMESTAMP,
  canceled_at TIMESTAMP,
  ended_at TIMESTAMP,

  -- Usage-based billing
  ai_credits_included INTEGER DEFAULT 0,
  ai_credits_used INTEGER DEFAULT 0,
  meeting_limit INTEGER,
  meetings_used INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_subscriptions_organization_id ON subscriptions(organization_id);
CREATE INDEX idx_subscriptions_stripe_subscription_id ON subscriptions(stripe_subscription_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);

-- =====================================================
-- INVOICES
-- =====================================================

CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES subscriptions(id),

  -- Stripe details
  stripe_invoice_id VARCHAR(255) UNIQUE,

  -- Invoice details
  amount_due INTEGER NOT NULL, -- in cents
  amount_paid INTEGER DEFAULT 0,
  currency VARCHAR(3) DEFAULT 'USD',

  -- Status
  status VARCHAR(50) NOT NULL, -- draft, open, paid, uncollectible, void

  -- PDF
  invoice_pdf TEXT,
  hosted_invoice_url TEXT,

  -- Dates
  period_start TIMESTAMP,
  period_end TIMESTAMP,
  due_date DATE,
  paid_at TIMESTAMP,

  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_invoices_organization_id ON invoices(organization_id);
CREATE INDEX idx_invoices_subscription_id ON invoices(subscription_id);
CREATE INDEX idx_invoices_status ON invoices(status);

-- =====================================================
-- API KEYS
-- =====================================================

CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,

  -- Key details
  key_hash VARCHAR(255) UNIQUE NOT NULL, -- Hashed API key
  key_prefix VARCHAR(10) NOT NULL, -- First chars for identification (e.g., "sk_live_abc...")
  name VARCHAR(255) NOT NULL,

  -- Permissions
  scopes TEXT[], -- ['read:meetings', 'write:checklists', etc.]

  -- Usage
  last_used_at TIMESTAMP,
  usage_count INTEGER DEFAULT 0,

  -- Status
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMP,

  -- Created by
  created_by UUID REFERENCES users(id),

  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  revoked_at TIMESTAMP
);

CREATE INDEX idx_api_keys_organization_id ON api_keys(organization_id);
CREATE INDEX idx_api_keys_key_hash ON api_keys(key_hash);
CREATE INDEX idx_api_keys_is_active ON api_keys(is_active);

-- =====================================================
-- AUDIT LOGS
-- =====================================================

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Actor
  user_id UUID REFERENCES users(id),
  organization_id UUID REFERENCES organizations(id),

  -- Action
  action VARCHAR(100) NOT NULL, -- user.created, template.updated, etc.
  resource_type VARCHAR(50) NOT NULL, -- user, template, meeting, etc.
  resource_id UUID,

  -- Changes
  old_values JSONB,
  new_values JSONB,

  -- Context
  ip_address INET,
  user_agent TEXT,

  -- Timestamp
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_organization_id ON audit_logs(organization_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- =====================================================
-- WEBHOOKS
-- =====================================================

CREATE TABLE IF NOT EXISTS webhooks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,

  -- Webhook configuration
  url TEXT NOT NULL,
  events TEXT[] NOT NULL, -- ['meeting.completed', 'checklist.created', etc.]
  secret VARCHAR(255) NOT NULL, -- For signature verification

  -- Status
  is_active BOOLEAN DEFAULT true,

  -- Stats
  success_count INTEGER DEFAULT 0,
  failure_count INTEGER DEFAULT 0,
  last_success_at TIMESTAMP,
  last_failure_at TIMESTAMP,
  last_failure_reason TEXT,

  -- Created by
  created_by UUID REFERENCES users(id),

  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_webhooks_organization_id ON webhooks(organization_id);
CREATE INDEX idx_webhooks_is_active ON webhooks(is_active);

-- =====================================================
-- SEED DATA - Default Templates
-- =====================================================

-- Insert default public templates
INSERT INTO templates (name, description, category, items, is_public, is_featured, ai_enabled, tags) VALUES
(
  'Discovery Call',
  'Essential questions for understanding prospect needs and pain points',
  'Sales',
  '[
    {"id":"1","content":"Introduction and agenda setting","order":0,"type":"standard","ai_enabled":true,"required":true},
    {"id":"2","content":"Current situation and challenges","order":1,"type":"standard","ai_enabled":true,"required":true},
    {"id":"3","content":"Goals and desired outcomes","order":2,"type":"standard","ai_enabled":true,"required":true},
    {"id":"4","content":"Decision-making process","order":3,"type":"standard","ai_enabled":true,"required":true},
    {"id":"5","content":"Budget and timeline discussion","order":4,"type":"standard","ai_enabled":true,"required":true},
    {"id":"6","content":"Next steps and follow-up","order":5,"type":"standard","ai_enabled":true,"required":true}
  ]',
  true,
  true,
  true,
  ARRAY['sales', 'discovery', 'qualification']
),
(
  'Product Demo',
  'Structured demo flow to showcase value and handle objections',
  'Sales',
  '[
    {"id":"1","content":"Recap prospect needs from discovery","order":0,"type":"standard","ai_enabled":true,"required":true},
    {"id":"2","content":"Demo key features relevant to pain points","order":1,"type":"standard","ai_enabled":true,"required":true},
    {"id":"3","content":"Show ROI and business value","order":2,"type":"standard","ai_enabled":true,"required":true},
    {"id":"4","content":"Handle objections and questions","order":3,"type":"standard","ai_enabled":true,"required":false},
    {"id":"5","content":"Trial or pilot discussion","order":4,"type":"standard","ai_enabled":true,"required":true},
    {"id":"6","content":"Agree on next steps and timeline","order":5,"type":"standard","ai_enabled":true,"required":true}
  ]',
  true,
  true,
  true,
  ARRAY['sales', 'demo', 'product']
),
(
  'Closing Call',
  'Final steps to secure commitment and close the deal',
  'Sales',
  '[
    {"id":"1","content":"Confirm decision criteria met","order":0,"type":"standard","ai_enabled":true,"required":true},
    {"id":"2","content":"Review pricing and contract terms","order":1,"type":"standard","ai_enabled":true,"required":true},
    {"id":"3","content":"Address final concerns","order":2,"type":"standard","ai_enabled":true,"required":true},
    {"id":"4","content":"Get verbal commitment","order":3,"type":"standard","ai_enabled":true,"required":true},
    {"id":"5","content":"Outline implementation timeline","order":4,"type":"standard","ai_enabled":true,"required":true},
    {"id":"6","content":"Send contract and next steps","order":5,"type":"standard","ai_enabled":true,"required":true}
  ]',
  true,
  true,
  true,
  ARRAY['sales', 'closing', 'negotiation']
),
(
  'Follow-up Call',
  'Structured follow-up after initial meeting to maintain momentum',
  'Sales',
  '[
    {"id":"1","content":"Recap previous conversation","order":0,"type":"standard","ai_enabled":true,"required":true},
    {"id":"2","content":"Share promised resources","order":1,"type":"standard","ai_enabled":true,"required":true},
    {"id":"3","content":"Address new questions","order":2,"type":"standard","ai_enabled":true,"required":false},
    {"id":"4","content":"Gauge interest level","order":3,"type":"standard","ai_enabled":true,"required":true},
    {"id":"5","content":"Identify blockers","order":4,"type":"standard","ai_enabled":true,"required":true},
    {"id":"6","content":"Schedule next meeting","order":5,"type":"standard","ai_enabled":true,"required":true}
  ]',
  true,
  true,
  true,
  ARRAY['sales', 'follow-up', 'nurture']
),
(
  'Qualification Call',
  'Quickly qualify leads using BANT or similar framework',
  'Sales',
  '[
    {"id":"1","content":"Budget: Do they have budget allocated?","order":0,"type":"standard","ai_enabled":true,"required":true},
    {"id":"2","content":"Authority: Are we talking to decision maker?","order":1,"type":"standard","ai_enabled":true,"required":true},
    {"id":"3","content":"Need: Is there a clear pain point?","order":2,"type":"standard","ai_enabled":true,"required":true},
    {"id":"4","content":"Timeline: When do they need a solution?","order":3,"type":"standard","ai_enabled":true,"required":true},
    {"id":"5","content":"Competition: What alternatives are they considering?","order":4,"type":"standard","ai_enabled":true,"required":false},
    {"id":"6","content":"Decision: Qualify or disqualify","order":5,"type":"standard","ai_enabled":true,"required":true}
  ]',
  true,
  true,
  true,
  ARRAY['sales', 'qualification', 'bant']
)
ON CONFLICT DO NOTHING;

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_templates_updated_at BEFORE UPDATE ON templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_meetings_updated_at BEFORE UPDATE ON meetings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_checklists_updated_at BEFORE UPDATE ON checklists FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update checklist progress
CREATE OR REPLACE FUNCTION update_checklist_progress()
RETURNS TRIGGER AS $$
DECLARE
  total INTEGER;
  completed INTEGER;
BEGIN
  -- Count total and completed items from JSONB
  SELECT
    jsonb_array_length(NEW.items),
    (SELECT COUNT(*) FROM jsonb_array_elements(NEW.items) item WHERE (item->>'checked')::boolean = true)
  INTO total, completed;

  NEW.total_items = total;
  NEW.completed_items = completed;
  NEW.completion_percentage = CASE WHEN total > 0 THEN (completed::DECIMAL / total::DECIMAL) * 100 ELSE 0 END;

  -- Set completed_at if all items are checked
  IF completed = total AND total > 0 THEN
    NEW.completed_at = NOW();
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_checklist_progress_trigger
BEFORE INSERT OR UPDATE ON checklists
FOR EACH ROW EXECUTE FUNCTION update_checklist_progress();

-- =====================================================
-- ROW LEVEL SECURITY (RLS) - For multi-tenancy
-- =====================================================

-- Enable RLS on key tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE meeting_notes ENABLE ROW LEVEL SECURITY;

-- Policies will be added based on auth implementation

-- =====================================================
-- VIEWS FOR ANALYTICS
-- =====================================================

-- Meeting analytics view
CREATE OR REPLACE VIEW meeting_analytics AS
SELECT
  m.id,
  m.organization_id,
  m.host_user_id,
  m.start_time::DATE as meeting_date,
  m.duration,
  m.outcome,
  m.deal_stage,
  m.deal_value,
  c.completion_percentage,
  c.ai_enabled as ai_auto_check_enabled,
  t.name as template_name,
  t.category as template_category
FROM meetings m
LEFT JOIN checklists c ON c.meeting_id = m.id
LEFT JOIN templates t ON t.id = c.template_id
WHERE m.deleted_at IS NULL;

-- Organization usage stats view
CREATE OR REPLACE VIEW organization_usage AS
SELECT
  o.id as organization_id,
  o.name as organization_name,
  o.subscription_plan,
  o.subscription_status,
  COUNT(DISTINCT m.id) as total_meetings,
  COUNT(DISTINCT c.id) as total_checklists,
  AVG(c.completion_percentage) as avg_completion_rate,
  o.ai_credits_used,
  o.ai_credits_limit
FROM organizations o
LEFT JOIN meetings m ON m.organization_id = o.id AND m.created_at >= date_trunc('month', CURRENT_DATE)
LEFT JOIN checklists c ON c.organization_id = o.id AND c.created_at >= date_trunc('month', CURRENT_DATE)
WHERE o.deleted_at IS NULL
GROUP BY o.id, o.name, o.subscription_plan, o.subscription_status, o.ai_credits_used, o.ai_credits_limit;

-- =====================================================
-- DONE!
-- =====================================================

-- Grant permissions (adjust based on your database user)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_user;
