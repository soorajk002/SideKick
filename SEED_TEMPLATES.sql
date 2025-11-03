-- =====================================================
-- SEED DEFAULT SALES TEMPLATES
-- =====================================================
-- Run this in your Supabase SQL Editor to add default templates

-- First, create a system organization for templates
-- We'll use a fixed UUID so we can reference it
INSERT INTO organizations (id, name, slug, owner_id, subscription_status, subscription_plan, ai_credits_limit)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'System Templates',
  'system-templates',
  NULL,
  'active',
  'free',
  0
)
ON CONFLICT (id) DO NOTHING;

-- Create default organization for Zoom app meetings
-- The Zoom app uses this UUID as organizationId when creating meetings
INSERT INTO organizations (id, name, slug, owner_id, subscription_status, subscription_plan, ai_credits_limit, monthly_meeting_limit)
VALUES (
  '00000000-0000-0000-0000-000000000002',
  'Zoom App Default',
  'zoom-app-default',
  NULL,
  'active',
  'free',
  100,
  1000
)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- TEMPLATE 1: Discovery Call
-- =====================================================

INSERT INTO templates (
  id,
  name,
  description,
  category,
  items,
  organization_id,
  is_public,
  is_featured,
  usage_count
)
VALUES (
  '10000000-0000-0000-0000-000000000001',
  'Discovery Call',
  'Essential questions for understanding prospect needs and qualifying opportunities',
  'Sales',
  '[]'::jsonb,
  '00000000-0000-0000-0000-000000000001',
  true,
  true,
  0
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  is_public = true,
  is_featured = true;

-- Discovery Call Items
INSERT INTO template_items (template_id, title, description, "order", is_required, ai_keywords)
VALUES
  ('10000000-0000-0000-0000-000000000001', 'Introduction and agenda setting', 'Set the stage for the call and establish rapport', 0, true, ARRAY['intro', 'introduction', 'agenda', 'purpose']),
  ('10000000-0000-0000-0000-000000000001', 'Current challenges and pain points', 'Understand what problems they are trying to solve', 1, true, ARRAY['challenge', 'problem', 'pain', 'issue', 'struggle']),
  ('10000000-0000-0000-0000-000000000001', 'Goals and desired outcomes', 'Identify what success looks like for them', 2, true, ARRAY['goal', 'objective', 'target', 'outcome', 'achieve']),
  ('10000000-0000-0000-0000-000000000001', 'Budget and timeline discussion', 'Qualify the opportunity with budget and timing', 3, true, ARRAY['budget', 'cost', 'price', 'timeline', 'timeframe', 'when']),
  ('10000000-0000-0000-0000-000000000001', 'Decision-making process', 'Understand who makes decisions and approval process', 4, true, ARRAY['decision', 'stakeholder', 'approval', 'authority', 'who decides']),
  ('10000000-0000-0000-0000-000000000001', 'Next steps and follow-up', 'Establish clear next actions and schedule follow-up', 5, true, ARRAY['next step', 'follow up', 'action item', 'schedule'])
ON CONFLICT DO NOTHING;

-- =====================================================
-- TEMPLATE 2: Product Demo
-- =====================================================

INSERT INTO templates (
  id,
  name,
  description,
  category,
  items,
  organization_id,
  is_public,
  is_featured,
  usage_count
)
VALUES (
  '10000000-0000-0000-0000-000000000002',
  'Product Demo',
  'Structured demo flow to showcase value and address specific needs',
  'Sales',
  '[]'::jsonb,
  '00000000-0000-0000-0000-000000000001',
  true,
  true,
  0
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  is_public = true,
  is_featured = true;

-- Product Demo Items
INSERT INTO template_items (template_id, title, description, "order", is_required, ai_keywords)
VALUES
  ('10000000-0000-0000-0000-000000000002', 'Recap needs from discovery', 'Review what was learned in previous conversations', 0, true, ARRAY['recap', 'review', 'summarize', 'understand']),
  ('10000000-0000-0000-0000-000000000002', 'Show key features solving their pain points', 'Demonstrate features that address their specific challenges', 1, true, ARRAY['feature', 'demo', 'show', 'capability', 'solve']),
  ('10000000-0000-0000-0000-000000000002', 'Handle objections and questions', 'Address concerns and clarify any confusion', 2, true, ARRAY['question', 'concern', 'objection', 'worry', 'clarify']),
  ('10000000-0000-0000-0000-000000000002', 'Discuss pricing and ROI', 'Present pricing options and demonstrate return on investment', 3, true, ARRAY['pricing', 'cost', 'ROI', 'return', 'investment', 'value']),
  ('10000000-0000-0000-0000-000000000002', 'Get commitment for next steps', 'Secure agreement on moving forward', 4, true, ARRAY['commit', 'next step', 'move forward', 'proceed', 'advance'])
ON CONFLICT DO NOTHING;

-- =====================================================
-- TEMPLATE 3: Closing Call
-- =====================================================

INSERT INTO templates (
  id,
  name,
  description,
  category,
  items,
  organization_id,
  is_public,
  is_featured,
  usage_count
)
VALUES (
  '10000000-0000-0000-0000-000000000003',
  'Closing Call',
  'Final steps to close the deal and ensure smooth implementation',
  'Sales',
  '[]'::jsonb,
  '00000000-0000-0000-0000-000000000001',
  true,
  true,
  0
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  is_public = true,
  is_featured = true;

-- Closing Call Items
INSERT INTO template_items (template_id, title, description, "order", is_required, ai_keywords)
VALUES
  ('10000000-0000-0000-0000-000000000003', 'Review contract terms', 'Walk through all contract details and terms', 0, true, ARRAY['contract', 'terms', 'agreement', 'review']),
  ('10000000-0000-0000-0000-000000000003', 'Address final concerns', 'Handle any last-minute questions or objections', 1, true, ARRAY['concern', 'question', 'issue', 'final']),
  ('10000000-0000-0000-0000-000000000003', 'Confirm implementation timeline', 'Establish clear timeline for onboarding and implementation', 2, true, ARRAY['timeline', 'implementation', 'onboard', 'start', 'launch']),
  ('10000000-0000-0000-0000-000000000003', 'Introduce customer success team', 'Hand off to the team that will support them', 3, true, ARRAY['introduce', 'team', 'support', 'customer success']),
  ('10000000-0000-0000-0000-000000000003', 'Get signature commitment', 'Secure the signed agreement', 4, true, ARRAY['signature', 'sign', 'commit', 'close', 'agreement'])
ON CONFLICT DO NOTHING;

-- =====================================================
-- TEMPLATE 4: Qualification Call
-- =====================================================

INSERT INTO templates (
  id,
  name,
  description,
  category,
  items,
  organization_id,
  is_public,
  is_featured,
  usage_count
)
VALUES (
  '10000000-0000-0000-0000-000000000004',
  'Qualification Call',
  'Quick assessment to determine if prospect is a good fit',
  'Sales',
  '[]'::jsonb,
  '00000000-0000-0000-0000-000000000001',
  true,
  true,
  0
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  is_public = true,
  is_featured = true;

-- Qualification Call Items
INSERT INTO template_items (template_id, title, description, "order", is_required, ai_keywords)
VALUES
  ('10000000-0000-0000-0000-000000000004', 'Company size and industry', 'Confirm they match ideal customer profile', 0, true, ARRAY['company', 'size', 'industry', 'employees']),
  ('10000000-0000-0000-0000-000000000004', 'Current solution in use', 'Understand what they use today and why they want to change', 1, true, ARRAY['current', 'solution', 'tool', 'using', 'switch']),
  ('10000000-0000-0000-0000-000000000004', 'Budget availability', 'Qualify if they have budget allocated', 2, true, ARRAY['budget', 'allocated', 'funding', 'money']),
  ('10000000-0000-0000-0000-000000000004', 'Decision authority', 'Confirm if they can make the purchase decision', 3, true, ARRAY['authority', 'decision', 'approve', 'power']),
  ('10000000-0000-0000-0000-000000000004', 'Timeline to purchase', 'Understand urgency and timing', 4, true, ARRAY['timeline', 'urgency', 'when', 'timing', 'purchase'])
ON CONFLICT DO NOTHING;

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================

SELECT
  COUNT(*) as template_count,
  'Templates seeded successfully!' as message
FROM templates
WHERE is_public = true;
