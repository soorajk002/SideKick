-- =====================================================
-- FIX DUPLICATE ITEMS - Complete Clean Up
-- =====================================================
-- Run this in Supabase SQL Editor to clean up all duplicates

-- Step 1: Delete all existing checklists and their items (testing data)
-- This removes the foreign key references
DELETE FROM checklist_items;
DELETE FROM checklists;

-- Step 2: Now delete duplicate template items
-- Keeps only the one with the lowest ID for each unique (template_id, title, order) combination
DELETE FROM template_items a
USING template_items b
WHERE a.id > b.id
  AND a.template_id = b.template_id
  AND a.title = b.title
  AND a."order" = b."order";

-- Step 3: Verify templates have correct item counts
SELECT
  t.name,
  COUNT(ti.id) as item_count
FROM templates t
LEFT JOIN template_items ti ON ti.template_id = t.id
WHERE t.is_public = true
GROUP BY t.id, t.name
ORDER BY t.name;

-- You should see:
-- Discovery Call: 6 items
-- Product Demo: 5 items
-- Closing Call: 5 items
-- Qualification Call: 5 items
