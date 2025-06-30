/*
  # Add goals table and relationships

  1. New Tables
    - `goals`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `title` (text)
      - `description` (text)
      - `target_value` (numeric)
      - `current_value` (numeric)
      - `unit` (text)
      - `category` (text)
      - `color` (text)
      - `start_date` (date)
      - `target_date` (date)
      - `is_completed` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
  2. Security
    - Enable RLS on `goals` table
    - Add policies for authenticated users to manage their own goals
*/

-- Create goals table
CREATE TABLE IF NOT EXISTS goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text DEFAULT '',
  target_value numeric DEFAULT 0,
  current_value numeric DEFAULT 0,
  unit text DEFAULT '',
  category text DEFAULT 'nutrition',
  color text DEFAULT '#007AFF',
  start_date date DEFAULT CURRENT_DATE,
  target_date date,
  is_completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_goals_user_id ON goals(user_id);

-- Enable Row Level Security
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for goals table
CREATE POLICY "Users can read own goals"
  ON goals
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own goals"
  ON goals
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own goals"
  ON goals
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own goals"
  ON goals
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_goals_updated_at
  BEFORE UPDATE ON goals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample goals for existing users
INSERT INTO goals (
  user_id,
  title,
  description,
  target_value,
  current_value,
  unit,
  category,
  color,
  start_date,
  target_date,
  is_completed
) VALUES 
-- Sarah's goals
(
  '550e8400-e29b-41d4-a716-446655440000',
  'Increase Iron',
  'Build iron stores for baby development',
  25,
  18,
  'mg',
  'nutrition',
  '#007AFF',
  CURRENT_DATE - INTERVAL '14 days',
  CURRENT_DATE + INTERVAL '30 days',
  false
),
(
  '550e8400-e29b-41d4-a716-446655440000',
  'Prenatal Vitamins',
  'Take daily prenatal vitamin',
  1,
  1,
  'daily',
  'supplements',
  '#34C759',
  CURRENT_DATE - INTERVAL '30 days',
  CURRENT_DATE + INTERVAL '60 days',
  true
),
(
  '550e8400-e29b-41d4-a716-446655440000',
  'Hydration',
  'Drink 8 glasses of water daily',
  8,
  5,
  'glasses',
  'hydration',
  '#007AFF',
  CURRENT_DATE - INTERVAL '7 days',
  CURRENT_DATE + INTERVAL '60 days',
  false
),
(
  '550e8400-e29b-41d4-a716-446655440000',
  'Omega-3',
  'Increase omega-3 intake for baby brain development',
  1.5,
  1.38,
  'g',
  'nutrition',
  '#FF9500',
  CURRENT_DATE - INTERVAL '10 days',
  CURRENT_DATE + INTERVAL '45 days',
  false
),

-- Emma's goals
(
  '550e8400-e29b-41d4-a716-446655440001',
  'Manage Nausea',
  'Find foods that help with morning sickness',
  5,
  3,
  'meals',
  'wellness',
  '#FF9500',
  CURRENT_DATE - INTERVAL '10 days',
  CURRENT_DATE + INTERVAL '20 days',
  false
),
(
  '550e8400-e29b-41d4-a716-446655440001',
  'Increase Folate',
  'Boost folate intake for neural tube development',
  400,
  350,
  'mcg',
  'nutrition',
  '#34C759',
  CURRENT_DATE - INTERVAL '15 days',
  CURRENT_DATE + INTERVAL '15 days',
  false
),

-- Maria's goals
(
  '550e8400-e29b-41d4-a716-446655440002',
  'Rebuild Iron',
  'Replenish iron stores after delivery',
  20,
  15,
  'mg',
  'nutrition',
  '#FF3B30',
  CURRENT_DATE - INTERVAL '5 days',
  CURRENT_DATE + INTERVAL '25 days',
  false
),
(
  '550e8400-e29b-41d4-a716-446655440002',
  'Protein Intake',
  'Increase protein for recovery and breastfeeding',
  75,
  65,
  'g',
  'nutrition',
  '#007AFF',
  CURRENT_DATE - INTERVAL '7 days',
  CURRENT_DATE + INTERVAL '23 days',
  false
);