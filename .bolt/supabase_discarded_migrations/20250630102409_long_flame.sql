/*
  # Add sample food preferences data

  This migration only adds sample data to the existing food_preferences table.
  It does NOT create the table or any policies since those already exist.
*/

-- Insert sample data for existing users
INSERT INTO food_preferences (user_id, food_name, preference_type, notes)
VALUES
  ('550e8400-e29b-41d4-a716-446655440000', 'Avocado', 'like', 'Great source of healthy fats'),
  ('550e8400-e29b-41d4-a716-446655440000', 'Lentils', 'like', 'Excellent plant-based iron source'),
  ('550e8400-e29b-41d4-a716-446655440000', 'Shellfish', 'dislike', 'Not preferred during pregnancy'),
  ('550e8400-e29b-41d4-a716-446655440000', 'Soy', 'intolerance', 'Mild digestive discomfort'),
  ('550e8400-e29b-41d4-a716-446655440001', 'Crackers', 'like', 'Helps with morning nausea'),
  ('550e8400-e29b-41d4-a716-446655440001', 'Spicy food', 'dislike', 'Triggers heartburn'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Almonds', 'like', 'Great for energy'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Chocolate', 'like', 'Occasional treat')
ON CONFLICT DO NOTHING;