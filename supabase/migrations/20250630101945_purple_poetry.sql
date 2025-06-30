/*
  # Add Food Preferences Table

  1. New Tables
    - `food_preferences`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `food_name` (text)
      - `preference_type` (text, check constraint)
      - `notes` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
  
  2. Security
    - Enable RLS on `food_preferences` table
    - Add policies for authenticated users to manage their own food preferences
    - Create indexes for performance optimization
*/

-- Create food preferences table
CREATE TABLE IF NOT EXISTS food_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  food_name text NOT NULL,
  preference_type text NOT NULL CHECK (preference_type IN ('like', 'dislike', 'allergy', 'intolerance')),
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_food_preferences_user_id ON food_preferences USING btree (user_id);
CREATE INDEX IF NOT EXISTS idx_food_preferences_type ON food_preferences USING btree (preference_type);

-- Enable Row Level Security
ALTER TABLE food_preferences ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can insert own food preferences"
  ON food_preferences
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own food preferences"
  ON food_preferences
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own food preferences"
  ON food_preferences
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own food preferences"
  ON food_preferences
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create trigger for updated_at column
CREATE TRIGGER update_food_preferences_updated_at
  BEFORE UPDATE ON food_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

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