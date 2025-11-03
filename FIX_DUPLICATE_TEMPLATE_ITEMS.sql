-- =====================================================
-- FIX DUPLICATE TEMPLATE ITEMS
-- =====================================================
-- Run this in Supabase SQL Editor to remove duplicate template items

-- Delete duplicate template items, keeping only the one with the lowest ID
DELETE FROM template_items a
USING template_items b
WHERE a.id > b.id
  AND a.template_id = b.template_id
  AND a.title = b.title
  AND a."order" = b."order";

-- Verify: Count items per template (should be 5-6 items each)
SELECT
  t.name,
  COUNT(ti.id) as item_count
FROM templates t
LEFT JOIN template_items ti ON ti.template_id = t.id
WHERE t.is_public = true
GROUP BY t.id, t.name
ORDER BY t.name;
