/*
  # Sample Food Preferences Data

  This migration only inserts sample food preference data for existing users.
  The food_preferences table structure, indexes, and policies were already created
  in previous migrations.
*/

-- Insert sample data for existing users
INSERT INTO food_preferences (user_id, food_name, preference_type, notes)
VALUES
  ('550e8400-e29b-41d4-a716-446655440000', 'Spinach', 'like', 'Great source of iron'),
  ('550e8400-e29b-41d4-a716-446655440000', 'Salmon', 'like', 'Excellent for DHA'),
  ('550e8400-e29b-41d4-a716-446655440000', 'Dairy', 'dislike', 'Causes mild bloating'),
  ('550e8400-e29b-41d4-a716-446655440000', 'Peanuts', 'allergy', 'Severe allergy - avoid all traces'),
  ('550e8400-e29b-41d4-a716-446655440001', 'Ginger', 'like', 'Helps with morning sickness'),
  ('550e8400-e29b-41d4-a716-446655440001', 'Gluten', 'intolerance', 'Causes digestive issues'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Oatmeal', 'like', 'Good for milk production'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Caffeine', 'dislike', 'Affects sleep quality')
ON CONFLICT DO NOTHING;