/*
  # Add Food Analysis Table

  1. New Tables
    - `food_analysis`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `food_name` (text)
      - `image_url` (text)
      - `portion_size` (integer)
      - `nutrition_data` (jsonb)
      - `created_at` (timestamptz)
      - `saved_to_log` (boolean)
  
  2. Security
    - Enable RLS on `food_analysis` table
    - Add policies for authenticated users to manage their own food analysis records
*/

-- Create food analysis table
CREATE TABLE IF NOT EXISTS food_analysis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  food_name text NOT NULL,
  image_url text,
  portion_size integer NOT NULL,
  nutrition_data jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  saved_to_log boolean DEFAULT false
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_food_analysis_user_id ON food_analysis USING btree (user_id);
CREATE INDEX IF NOT EXISTS idx_food_analysis_created_at ON food_analysis USING btree (created_at);

-- Enable Row Level Security
ALTER TABLE food_analysis ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can insert own food analysis"
  ON food_analysis
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own food analysis"
  ON food_analysis
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own food analysis"
  ON food_analysis
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own food analysis"
  ON food_analysis
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);