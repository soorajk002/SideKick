-- =====================================================
-- FIX MEETINGS TABLE - Add Missing Columns
-- =====================================================
-- Run this in Supabase SQL Editor to add missing columns

-- Add participant_count column if it doesn't exist
ALTER TABLE meetings
ADD COLUMN IF NOT EXISTS participant_count INTEGER DEFAULT 1;

-- Verify the column was added
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'meetings'
AND column_name = 'participant_count';
