-- Default Sales Templates for Sidekick
-- Run this in Supabase SQL Editor after running migrations

-- Discovery Call Template
INSERT INTO templates (name, description, category, items, ai_enabled, is_public, is_featured, tags, created_at, updated_at)
VALUES (
  'Discovery Call',
  'Comprehensive discovery call checklist for qualifying prospects and understanding their needs',
  'Sales',
  '[
    {"id": "1", "title": "Introduce yourself and company", "description": "Brief intro of who you are and what your company does", "order": 1},
    {"id": "2", "title": "Set meeting agenda", "description": "Align on what you''ll cover in this call", "order": 2},
    {"id": "3", "title": "Ask about their current situation", "description": "Understand their current setup and processes", "order": 3},
    {"id": "4", "title": "Identify pain points", "description": "What problems are they facing? What''s not working?", "order": 4},
    {"id": "5", "title": "Discuss budget", "description": "Understand their budget and pricing expectations", "order": 5},
    {"id": "6", "title": "Confirm decision-making process", "description": "Who else needs to be involved? What''s the approval process?", "order": 6},
    {"id": "7", "title": "Present high-level solution", "description": "How your product solves their specific problems", "order": 7},
    {"id": "8", "title": "Schedule next steps", "description": "Book demo, proposal call, or next meeting", "order": 8}
  ]'::jsonb,
  true,  -- ai_enabled
  true,  -- is_public
  true,  -- is_featured
  ARRAY['sales', 'discovery', 'qualification'],
  NOW(),
  NOW()
);

-- Product Demo Template
INSERT INTO templates (name, description, category, items, ai_enabled, is_public, is_featured, tags, created_at, updated_at)
VALUES (
  'Product Demo',
  'Complete product demonstration checklist to showcase value and handle objections',
  'Sales',
  '[
    {"id": "1", "title": "Recap previous conversation", "description": "Remind them what you discussed in discovery", "order": 1},
    {"id": "2", "title": "Confirm demo objectives", "description": "What specifically do they want to see?", "order": 2},
    {"id": "3", "title": "Demo key features", "description": "Show the features most relevant to their needs", "order": 3},
    {"id": "4", "title": "Show use case examples", "description": "Real examples of how other customers use it", "order": 4},
    {"id": "5", "title": "Pause for questions", "description": "Check understanding and address concerns", "order": 5},
    {"id": "6", "title": "Discuss pricing and packages", "description": "Present pricing options and value proposition", "order": 6},
    {"id": "7", "title": "Identify concerns/objections", "description": "Surface and address any hesitations", "order": 7},
    {"id": "8", "title": "Propose next steps", "description": "Trial, proof of concept, or move to contract", "order": 8},
    {"id": "9", "title": "Send follow-up resources", "description": "Case studies, documentation, ROI calculator", "order": 9}
  ]'::jsonb,
  true,
  true,
  true,
  ARRAY['sales', 'demo', 'product', 'presentation'],
  NOW(),
  NOW()
);

-- Closing Call Template
INSERT INTO templates (name, description, category, items, ai_enabled, is_public, is_featured, tags, created_at, updated_at)
VALUES (
  'Closing Call',
  'Final steps to close the deal and get contract signed',
  'Sales',
  '[
    {"id": "1", "title": "Review proposal terms", "description": "Walk through the proposal line by line", "order": 1},
    {"id": "2", "title": "Confirm pricing and discounts", "description": "Verify final numbers and any discounts", "order": 2},
    {"id": "3", "title": "Address final objections", "description": "Overcome last-minute concerns", "order": 3},
    {"id": "4", "title": "Review contract details", "description": "Terms, SLA, support, cancellation policy", "order": 4},
    {"id": "5", "title": "Discuss implementation timeline", "description": "When can they start? What''s the onboarding process?", "order": 5},
    {"id": "6", "title": "Get verbal commitment", "description": "Ask for the deal: Are you ready to move forward?", "order": 6},
    {"id": "7", "title": "Send contract for signature", "description": "DocuSign or e-signature link", "order": 7}
  ]'::jsonb,
  true,
  true,
  true,
  ARRAY['sales', 'closing', 'negotiation', 'contract'],
  NOW(),
  NOW()
);

-- Prospecting Call Template
INSERT INTO templates (name, description, category, items, ai_enabled, is_public, tags, created_at, updated_at)
VALUES (
  'Prospecting Call',
  'Cold outreach call to qualify and book discovery meetings',
  'Sales',
  '[
    {"id": "1", "title": "Introduction and permission", "description": "Did I catch you at a good time?", "order": 1},
    {"id": "2", "title": "State reason for call", "description": "Why are you calling them specifically?", "order": 2},
    {"id": "3", "title": "Ask discovery questions", "description": "Are they experiencing [problem]?", "order": 3},
    {"id": "4", "title": "Share brief value prop", "description": "We help [similar companies] achieve [result]", "order": 4},
    {"id": "5", "title": "Gauge interest", "description": "Is this something that would be helpful?", "order": 5},
    {"id": "6", "title": "Book discovery meeting", "description": "Get calendar invite sent", "order": 6}
  ]'::jsonb,
  true,
  true,
  ARRAY['sales', 'prospecting', 'outbound', 'cold-call'],
  NOW(),
  NOW()
);

-- Follow-up Call Template
INSERT INTO templates (name, description, category, items, ai_enabled, is_public, tags, created_at, updated_at)
VALUES (
  'Follow-up Call',
  'Check in after demo or proposal to move deal forward',
  'Sales',
  '[
    {"id": "1", "title": "Reference previous meeting", "description": "Remind them what you discussed", "order": 1},
    {"id": "2", "title": "Ask if they reviewed materials", "description": "Did they look at the proposal/demo recording?", "order": 2},
    {"id": "3", "title": "Answer new questions", "description": "What came up after our last call?", "order": 3},
    {"id": "4", "title": "Check stakeholder feedback", "description": "Have they discussed with their team?", "order": 4},
    {"id": "5", "title": "Address concerns", "description": "What''s holding them back?", "order": 5},
    {"id": "6", "title": "Confirm timeline", "description": "What''s their decision timeline?", "order": 6},
    {"id": "7", "title": "Agree on next action", "description": "What happens next and when?", "order": 7}
  ]'::jsonb,
  true,
  true,
  ARRAY['sales', 'follow-up', 'nurture'],
  NOW(),
  NOW()
);

-- Customer Success Check-in Template
INSERT INTO templates (name, description, category, items, ai_enabled, is_public, tags, created_at, updated_at)
VALUES (
  'Customer Success Check-in',
  'Quarterly business review or check-in call with existing customers',
  'Customer Success',
  '[
    {"id": "1", "title": "Review usage and adoption", "description": "How often are they using it? Who on their team?", "order": 1},
    {"id": "2", "title": "Discuss wins and results", "description": "What value have they achieved?", "order": 2},
    {"id": "3", "title": "Identify challenges", "description": "What''s not working as expected?", "order": 3},
    {"id": "4", "title": "Share new features", "description": "Product updates that might help them", "order": 4},
    {"id": "5", "title": "Explore expansion opportunities", "description": "More seats, upgrades, add-ons?", "order": 5},
    {"id": "6", "title": "Gather feedback", "description": "What would make this even better?", "order": 6},
    {"id": "7", "title": "Schedule next check-in", "description": "Book next QBR or check-in call", "order": 7}
  ]'::jsonb,
  true,
  true,
  ARRAY['customer-success', 'retention', 'upsell', 'qbr'],
  NOW(),
  NOW()
);

-- Print confirmation
SELECT 'Default templates created successfully!' AS message;
SELECT COUNT(*) AS template_count FROM templates WHERE is_public = true;
