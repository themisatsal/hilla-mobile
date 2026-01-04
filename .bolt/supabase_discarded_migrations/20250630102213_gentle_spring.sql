/*
  # Additional Food Preferences Sample Data

  This migration adds more diverse food preferences for each user, including:
  - Additional likes for nutritional variety
  - Common food intolerances and allergies
  - Specific preferences for each pregnancy stage
*/

-- Insert additional sample data for existing users
INSERT INTO food_preferences (user_id, food_name, preference_type, notes)
VALUES
  -- Sarah (Second Trimester)
  ('550e8400-e29b-41d4-a716-446655440000', 'Lentils', 'like', 'Great plant-based iron source'),
  ('550e8400-e29b-41d4-a716-446655440000', 'Avocado', 'like', 'Healthy fats and folate'),
  ('550e8400-e29b-41d4-a716-446655440000', 'Broccoli', 'like', 'Rich in calcium and folate'),
  ('550e8400-e29b-41d4-a716-446655440000', 'Shellfish', 'dislike', 'Texture issues'),
  ('550e8400-e29b-41d4-a716-446655440000', 'Soy', 'intolerance', 'Mild digestive discomfort'),
  
  -- Emma (First Trimester)
  ('550e8400-e29b-41d4-a716-446655440001', 'Crackers', 'like', 'Helps with morning nausea'),
  ('550e8400-e29b-41d4-a716-446655440001', 'Lemon water', 'like', 'Reduces morning sickness'),
  ('550e8400-e29b-41d4-a716-446655440001', 'Bananas', 'like', 'Easy on stomach and good potassium'),
  ('550e8400-e29b-41d4-a716-446655440001', 'Coffee', 'dislike', 'Triggers nausea in first trimester'),
  ('550e8400-e29b-41d4-a716-446655440001', 'Eggs', 'dislike', 'Aversion during first trimester'),
  
  -- Maria (Postpartum)
  ('550e8400-e29b-41d4-a716-446655440002', 'Almonds', 'like', 'Good for breastfeeding and energy'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Salmon', 'like', 'Omega-3s for recovery and mood'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Fenugreek', 'like', 'Helps with milk production'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Spicy foods', 'dislike', 'Affects breastmilk taste'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Chocolate', 'dislike', 'Causes baby fussiness when breastfeeding')
ON CONFLICT DO NOTHING;