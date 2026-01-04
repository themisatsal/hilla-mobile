/*
  # Add more food preferences data

  1. New Data
    - Additional food preferences for existing users
    - More diverse preference types (likes, dislikes, allergies, intolerances)
    - Detailed notes for each preference
  
  2. Data Quality
    - Nutritionally relevant foods for maternal health
    - Stage-appropriate preferences
*/

-- Insert additional food preferences for existing users
INSERT INTO food_preferences (user_id, food_name, preference_type, notes)
VALUES
  -- Sarah (Second Trimester)
  ('550e8400-e29b-41d4-a716-446655440000', 'Lentils', 'like', 'Great plant-based iron source'),
  ('550e8400-e29b-41d4-a716-446655440000', 'Avocado', 'like', 'Healthy fats and folate'),
  ('550e8400-e29b-41d4-a716-446655440000', 'Broccoli', 'like', 'Calcium and fiber rich'),
  ('550e8400-e29b-41d4-a716-446655440000', 'Shellfish', 'dislike', 'Texture issues'),
  ('550e8400-e29b-41d4-a716-446655440000', 'Caffeine', 'dislike', 'Trying to limit during pregnancy'),
  ('550e8400-e29b-41d4-a716-446655440000', 'Tree Nuts', 'allergy', 'Mild reaction - avoid all nuts except almonds'),
  
  -- Emma (First Trimester)
  ('550e8400-e29b-41d4-a716-446655440001', 'Crackers', 'like', 'Helps with morning sickness'),
  ('550e8400-e29b-41d4-a716-446655440001', 'Citrus', 'like', 'Vitamin C boost'),
  ('550e8400-e29b-41d4-a716-446655440001', 'Lemon Water', 'like', 'Helps with nausea'),
  ('550e8400-e29b-41d4-a716-446655440001', 'Spicy Foods', 'dislike', 'Triggers heartburn'),
  ('550e8400-e29b-41d4-a716-446655440001', 'Eggs', 'dislike', 'Aversion during first trimester'),
  ('550e8400-e29b-41d4-a716-446655440001', 'Dairy', 'intolerance', 'Mild lactose intolerance'),
  
  -- Maria (Postpartum)
  ('550e8400-e29b-41d4-a716-446655440002', 'Salmon', 'like', 'DHA for recovery'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Fenugreek', 'like', 'Supports milk production'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Spinach', 'like', 'Iron-rich for recovery'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Garlic', 'dislike', 'Affects breastmilk flavor'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Chocolate', 'dislike', 'Caffeine concerns while breastfeeding'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Soy', 'intolerance', 'Causes digestive issues')
ON CONFLICT DO NOTHING;