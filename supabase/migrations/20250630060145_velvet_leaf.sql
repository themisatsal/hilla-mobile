/*
  # Food Preferences Table

  1. New Tables
    - `food_preferences`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `food_name` (text)
      - `preference_type` (text, constrained to specific values)
      - `notes` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
  
  2. Security
    - Enable RLS on `food_preferences` table
    - Add policies for authenticated users to manage their own food preferences
    - Create indexes for performance optimization
*/

-- Create food preferences table if it doesn't exist
CREATE TABLE IF NOT EXISTS food_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  food_name text NOT NULL,
  preference_type text NOT NULL CHECK (preference_type IN ('like', 'dislike', 'allergy', 'intolerance')),
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_food_preferences_user_id ON food_preferences USING btree (user_id);
CREATE INDEX IF NOT EXISTS idx_food_preferences_type ON food_preferences USING btree (preference_type);

-- Enable row level security
ALTER TABLE food_preferences ENABLE ROW LEVEL SECURITY;

-- Create RLS policies only if they don't exist
DO $$
BEGIN
  -- Check if insert policy exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'food_preferences' 
    AND policyname = 'Users can insert own food preferences'
  ) THEN
    CREATE POLICY "Users can insert own food preferences"
      ON food_preferences
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;

  -- Check if select policy exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'food_preferences' 
    AND policyname = 'Users can view own food preferences'
  ) THEN
    CREATE POLICY "Users can view own food preferences"
      ON food_preferences
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;

  -- Check if update policy exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'food_preferences' 
    AND policyname = 'Users can update own food preferences'
  ) THEN
    CREATE POLICY "Users can update own food preferences"
      ON food_preferences
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;

  -- Check if delete policy exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'food_preferences' 
    AND policyname = 'Users can delete own food preferences'
  ) THEN
    CREATE POLICY "Users can delete own food preferences"
      ON food_preferences
      FOR DELETE
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Create trigger for updating the updated_at column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_food_preferences_updated_at'
  ) THEN
    CREATE TRIGGER update_food_preferences_updated_at
      BEFORE UPDATE ON food_preferences
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;