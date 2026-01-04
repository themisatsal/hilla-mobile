/*
  # Sample Food Preferences Data

  This migration only adds sample data to the food_preferences table.
  It assumes the table and its structure already exist from previous migrations.
  
  1. Sample Data
    - Adds realistic food preferences for existing users
    - Includes likes, dislikes, allergies, and intolerances
    - Each entry has descriptive notes for better context
  
  2. Safety
    - Uses ON CONFLICT DO NOTHING to prevent duplicate entries
*/

-- Insert additional sample data for existing users
INSERT INTO food_preferences (user_id, food_name, preference_type, notes)
VALUES
  -- Sarah's additional preferences
  ('550e8400-e29b-41d4-a716-446655440000', 'Lentils', 'like', 'Great plant-based iron source'),
  ('550e8400-e29b-41d4-a716-446655440000', 'Avocado', 'like', 'Healthy fats and folate'),
  ('550e8400-e29b-41d4-a716-446655440000', 'Shellfish', 'dislike', 'Texture issues'),
  ('550e8400-e29b-41d4-a716-446655440000', 'Soy', 'intolerance', 'Mild digestive discomfort'),
  
  -- Emma's additional preferences
  ('550e8400-e29b-41d4-a716-446655440001', 'Crackers', 'like', 'Helps with morning nausea'),
  ('550e8400-e29b-41d4-a716-446655440001', 'Peppermint tea', 'like', 'Soothes stomach'),
  ('550e8400-e29b-41d4-a716-446655440001', 'Spicy food', 'dislike', 'Triggers heartburn'),
  ('550e8400-e29b-41d4-a716-446655440001', 'Dairy', 'intolerance', 'Mild lactose intolerance'),
  
  -- Maria's additional preferences
  ('550e8400-e29b-41d4-a716-446655440002', 'Almonds', 'like', 'Good snack for energy'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Fenugreek', 'like', 'Supports lactation'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Alcohol', 'dislike', 'Avoiding while breastfeeding'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Eggs', 'allergy', 'Mild allergy - can have small amounts')
ON CONFLICT DO NOTHING;