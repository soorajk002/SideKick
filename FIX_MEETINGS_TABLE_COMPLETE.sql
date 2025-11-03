-- =====================================================
-- FIX MEETINGS TABLE - Add ALL Missing Columns
-- =====================================================
-- Run this in Supabase SQL Editor to add all missing columns at once

-- Add participant_count column
ALTER TABLE meetings
ADD COLUMN IF NOT EXISTS participant_count INTEGER DEFAULT 1;

-- Add ai_key_points column
ALTER TABLE meetings
ADD COLUMN IF NOT EXISTS ai_key_points JSONB;

-- Add ai_action_items column
ALTER TABLE meetings
ADD COLUMN IF NOT EXISTS ai_action_items JSONB;

-- Verify all columns were added
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'meetings'
AND column_name IN ('participant_count', 'ai_key_points', 'ai_action_items')
ORDER BY column_name;
