/*
  # Initial Hilla Database Schema

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `name` (text)
      - `selected_stage` (text)
      - `selected_goal` (text)
      - `dietary_preferences` (jsonb)
      - `energy_boosters` (jsonb)
      - `energy_drainers` (jsonb)
      - `baseline_answers` (jsonb)
      - `permissions` (jsonb)
      - `wearables` (jsonb)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `meals`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `name` (text)
      - `description` (text)
      - `nutrients` (jsonb)
      - `calories` (integer)
      - `servings` (decimal)
      - `meal_type` (text)
      - `logged_at` (timestamp)
      - `created_at` (timestamp)
    
    - `daily_logs`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `date` (date)
      - `total_nutrients` (jsonb)
      - `total_calories` (integer)
      - `water_intake` (integer)
      - `wellness_score` (integer)
      - `mood` (text)
      - `energy_level` (integer)
      - `notes` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `tracking_settings`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `selected_metrics` (jsonb)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  selected_stage text DEFAULT 't2',
  selected_goal text DEFAULT '',
  dietary_preferences jsonb DEFAULT '[]'::jsonb,
  energy_boosters jsonb DEFAULT '[]'::jsonb,
  energy_drainers jsonb DEFAULT '[]'::jsonb,
  baseline_answers jsonb DEFAULT '{}'::jsonb,
  permissions jsonb DEFAULT '{"pushReminders": false, "healthData": false}'::jsonb,
  wearables jsonb DEFAULT '{"oura": false, "whoop": false, "fitbit": false}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create meals table
CREATE TABLE IF NOT EXISTS meals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text DEFAULT '',
  nutrients jsonb NOT NULL DEFAULT '{}'::jsonb,
  calories integer DEFAULT 0,
  servings decimal DEFAULT 1,
  meal_type text DEFAULT 'snack',
  logged_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create daily_logs table
CREATE TABLE IF NOT EXISTS daily_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date date NOT NULL,
  total_nutrients jsonb DEFAULT '{}'::jsonb,
  total_calories integer DEFAULT 0,
  water_intake integer DEFAULT 0,
  wellness_score integer DEFAULT 0,
  mood text,
  energy_level integer,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Create tracking_settings table
CREATE TABLE IF NOT EXISTS tracking_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  selected_metrics jsonb DEFAULT '["iron", "dha", "folate"]'::jsonb,
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_meals_user_id ON meals(user_id);
CREATE INDEX IF NOT EXISTS idx_meals_logged_at ON meals(logged_at);
CREATE INDEX IF NOT EXISTS idx_daily_logs_user_id ON daily_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_logs_date ON daily_logs(date);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracking_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for users table
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own data"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create RLS policies for meals table
CREATE POLICY "Users can read own meals"
  ON meals
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own meals"
  ON meals
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own meals"
  ON meals
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own meals"
  ON meals
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create RLS policies for daily_logs table
CREATE POLICY "Users can read own daily logs"
  ON daily_logs
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own daily logs"
  ON daily_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own daily logs"
  ON daily_logs
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own daily logs"
  ON daily_logs
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create RLS policies for tracking_settings table
CREATE POLICY "Users can read own tracking settings"
  ON tracking_settings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tracking settings"
  ON tracking_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tracking settings"
  ON tracking_settings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tracking settings"
  ON tracking_settings
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_logs_updated_at
  BEFORE UPDATE ON daily_logs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tracking_settings_updated_at
  BEFORE UPDATE ON tracking_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();