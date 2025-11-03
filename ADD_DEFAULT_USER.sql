-- =====================================================
-- ADD DEFAULT ZOOM GUEST USER
-- =====================================================
-- Run this in Supabase SQL Editor to create a default user for Zoom app

-- Create a default "Zoom Guest" user for the Zoom app to use
-- when actual user information is not available
INSERT INTO users (
  id,
  email,
  full_name,
  is_active,
  is_email_verified
)
VALUES (
  '00000000-0000-0000-0000-000000000003',
  'zoom-guest@joinsidekick.ai',
  'Zoom Guest User',
  true,
  false
)
ON CONFLICT (id) DO NOTHING;

-- Verify the user was created
SELECT id, email, full_name, is_active
FROM users
WHERE id = '00000000-0000-0000-0000-000000000003';
