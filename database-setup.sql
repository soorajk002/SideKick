-- Sidekick Database Setup Script
-- Run this in your Supabase SQL Editor

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  zoom_user_id VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255),
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Templates table
CREATE TABLE IF NOT EXISTS templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  items JSONB NOT NULL,
  is_public BOOLEAN DEFAULT false NOT NULL,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Checklists table
CREATE TABLE IF NOT EXISTS checklists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  template_id UUID REFERENCES templates(id),
  meeting_id VARCHAR(255) NOT NULL,
  user_id UUID REFERENCES users(id) NOT NULL,
  items JSONB NOT NULL,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Transcriptions table (stores conversation transcripts)
CREATE TABLE IF NOT EXISTS transcriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id VARCHAR(255) NOT NULL,
  speaker VARCHAR(255),
  speaker_id VARCHAR(255),
  text TEXT NOT NULL,
  timestamp TIMESTAMP DEFAULT NOW() NOT NULL,
  analyzed_at TIMESTAMP
);

-- Checklist matches table (records when AI matches conversation to checklist items)
CREATE TABLE IF NOT EXISTS checklist_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  checklist_id UUID REFERENCES checklists(id) NOT NULL,
  item_id VARCHAR(255) NOT NULL,
  transcription_id UUID REFERENCES transcriptions(id),
  confidence INTEGER NOT NULL,
  matched_text TEXT,
  matched_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Seed default sales playbook templates
INSERT INTO templates (name, description, category, items, is_public) VALUES
  (
    'Discovery Call',
    'Essential questions for understanding prospect needs',
    'Sales',
    '[
      {"content":"Introduction and agenda setting","order":0},
      {"content":"Current challenges and pain points","order":1},
      {"content":"Goals and desired outcomes","order":2},
      {"content":"Budget and timeline discussion","order":3},
      {"content":"Decision-making process","order":4},
      {"content":"Key stakeholders identification","order":5},
      {"content":"Current solution evaluation","order":6},
      {"content":"Success metrics definition","order":7},
      {"content":"Next steps and follow-up","order":8}
    ]'::jsonb,
    true
  ),
  (
    'Product Demo',
    'Structured demo flow to showcase value',
    'Sales',
    '[
      {"content":"Recap needs from discovery","order":0},
      {"content":"Set demo agenda and objectives","order":1},
      {"content":"Show key features solving their pain points","order":2},
      {"content":"Demonstrate ROI and value proposition","order":3},
      {"content":"Handle objections and questions","order":4},
      {"content":"Discuss pricing and packages","order":5},
      {"content":"Get commitment for next steps","order":6}
    ]'::jsonb,
    true
  ),
  (
    'Closing Call',
    'Final steps to close the deal',
    'Sales',
    '[
      {"content":"Review contract terms and conditions","order":0},
      {"content":"Address final concerns and objections","order":1},
      {"content":"Confirm pricing and payment terms","order":2},
      {"content":"Discuss implementation timeline","order":3},
      {"content":"Introduce customer success team","order":4},
      {"content":"Outline onboarding process","order":5},
      {"content":"Get signature commitment","order":6},
      {"content":"Schedule kickoff meeting","order":7}
    ]'::jsonb,
    true
  ),
  (
    'Follow-up Call',
    'Structured follow-up after initial meeting',
    'Sales',
    '[
      {"content":"Recap previous meeting highlights","order":0},
      {"content":"Address questions from last call","order":1},
      {"content":"Share additional resources/case studies","order":2},
      {"content":"Discuss stakeholder feedback","order":3},
      {"content":"Review proposal or next steps","order":4},
      {"content":"Set timeline for decision","order":5}
    ]'::jsonb,
    true
  ),
  (
    'Qualification Call',
    'Qualify leads efficiently',
    'Sales',
    '[
      {"content":"Verify contact information","order":0},
      {"content":"Confirm budget availability","order":1},
      {"content":"Identify decision maker","order":2},
      {"content":"Understand timeline urgency","order":3},
      {"content":"Assess fit with product offering","order":4},
      {"content":"Determine next step opportunity","order":5}
    ]'::jsonb,
    true
  )
ON CONFLICT DO NOTHING;
