/*
  # Sample Data Migration

  1. Sample Users
    - Creates 3 test users with different life stages and preferences
    - Sarah (T2), Emma (T1), Maria (Postpartum)

  2. Tracking Settings
    - Sets up personalized nutrient tracking for each user

  3. Sample Meals
    - Generates 7 days of realistic meal data for Sarah
    - Includes breakfast, prenatal vitamins, and lunch

  4. Daily Logs
    - Calculates daily nutrition totals from meals
    - Generates wellness scores and health metrics
*/

-- Insert sample users (using fixed UUIDs for consistency)
INSERT INTO users (
  id,
  email,
  name,
  selected_stage,
  selected_goal,
  dietary_preferences,
  energy_boosters,
  energy_drainers,
  baseline_answers,
  permissions,
  wearables
) VALUES 
(
  '550e8400-e29b-41d4-a716-446655440000',
  'sarah@example.com',
  'Sarah Johnson',
  't2',
  'Build Baby''s Bones 🦴',
  '["Vegetarian"]'::jsonb,
  '["Morning walk", "Green smoothie"]'::jsonb,
  '["Late nights", "Sugary drinks"]'::jsonb,
  '{}'::jsonb,
  '{"pushReminders": true, "healthData": false}'::jsonb,
  '{"oura": false, "whoop": false, "fitbit": false}'::jsonb
),
(
  '550e8400-e29b-41d4-a716-446655440001',
  'emma@example.com',
  'Emma Wilson',
  't1',
  'Ease Morning Sickness 🤢',
  '["Gluten-free"]'::jsonb,
  '["Meditation", "Protein snack"]'::jsonb,
  '["Doom-scrolling", "Heavy meal"]'::jsonb,
  '{}'::jsonb,
  '{"pushRemissions": true, "healthData": true}'::jsonb,
  '{"oura": true, "whoop": false, "fitbit": false}'::jsonb
),
(
  '550e8400-e29b-41d4-a716-446655440002',
  'maria@example.com',
  'Maria Garcia',
  'postpartum',
  'Recover Postpartum 💪',
  '["None"]'::jsonb,
  '["Power nap", "Journaling"]'::jsonb,
  '["Processed snacks", "Over-caffeine"]'::jsonb,
  '{}'::jsonb,
  '{"pushReminders": false, "healthData": true}'::jsonb,
  '{"oura": false, "whoop": true, "fitbit": false}'::jsonb
)
ON CONFLICT (email) DO NOTHING;

-- Insert sample tracking settings
INSERT INTO tracking_settings (user_id, selected_metrics) VALUES 
('550e8400-e29b-41d4-a716-446655440000', '["iron", "dha", "folate"]'::jsonb),
('550e8400-e29b-41d4-a716-446655440001', '["folate", "protein", "fiber"]'::jsonb),
('550e8400-e29b-41d4-a716-446655440002', '["iron", "protein", "calcium"]'::jsonb)
ON CONFLICT (user_id) DO NOTHING;

-- Insert sample meals for the past week
DO $$
DECLARE
  target_user_id uuid := '550e8400-e29b-41d4-a716-446655440000';
  day_offset integer;
  meal_date timestamptz;
BEGIN
  FOR day_offset IN 0..6 LOOP
    meal_date := (CURRENT_DATE - day_offset * INTERVAL '1 day') + INTERVAL '8 hours';
    
    -- Morning meal
    INSERT INTO meals (
      user_id,
      name,
      description,
      nutrients,
      calories,
      servings,
      meal_type,
      logged_at
    ) VALUES (
      target_user_id,
      'Greek Yogurt with Berries',
      'Plain Greek yogurt with mixed berries and granola',
      '{
        "iron": 2.1,
        "dha": 0.05,
        "folate": 15,
        "calcium": 150,
        "protein": 15,
        "fiber": 3,
        "vitamin_d": 40,
        "choline": 35,
        "zinc": 1.2,
        "magnesium": 25,
        "omega3": 0.05,
        "vitamin_b6": 0.1
      }'::jsonb,
      180,
      1,
      'breakfast',
      meal_date
    );
    
    -- Prenatal vitamin
    INSERT INTO meals (
      user_id,
      name,
      description,
      nutrients,
      calories,
      servings,
      meal_type,
      logged_at
    ) VALUES (
      target_user_id,
      'Prenatal Vitamin',
      'Daily prenatal multivitamin',
      '{
        "iron": 18,
        "dha": 0.2,
        "folate": 400,
        "calcium": 200,
        "protein": 0,
        "fiber": 0,
        "vitamin_d": 400,
        "choline": 55,
        "zinc": 15,
        "magnesium": 50,
        "omega3": 0.2,
        "vitamin_b6": 1.9
      }'::jsonb,
      0,
      1,
      'breakfast',
      meal_date + INTERVAL '30 minutes'
    );
    
    -- Lunch meal
    INSERT INTO meals (
      user_id,
      name,
      description,
      nutrients,
      calories,
      servings,
      meal_type,
      logged_at
    ) VALUES (
      target_user_id,
      'Spinach Salad with Salmon',
      'Fresh spinach salad with grilled salmon and quinoa',
      '{
        "iron": 4.2,
        "dha": 1.1,
        "folate": 65,
        "calcium": 120,
        "protein": 28,
        "fiber": 6,
        "vitamin_d": 360,
        "choline": 85,
        "zinc": 2.8,
        "magnesium": 95,
        "omega3": 1.2,
        "vitamin_b6": 0.8
      }'::jsonb,
      420,
      1,
      'lunch',
      meal_date + INTERVAL '5 hours'
    );
  END LOOP;
END $$;

-- Create daily logs based on meals
DO $$
DECLARE
  target_user_id uuid := '550e8400-e29b-41d4-a716-446655440000';
  day_offset integer;
  log_date date;
  total_calories integer;
  wellness_score integer;
  iron_total numeric;
  dha_total numeric;
  folate_total numeric;
  calcium_total numeric;
  protein_total numeric;
  fiber_total numeric;
  vitamin_d_total numeric;
  choline_total numeric;
  zinc_total numeric;
  magnesium_total numeric;
  omega3_total numeric;
  vitamin_b6_total numeric;
BEGIN
  FOR day_offset IN 0..6 LOOP
    log_date := CURRENT_DATE - day_offset;
    
    -- Calculate totals from meals for this date
    SELECT 
      COALESCE(SUM(calories), 0),
      COALESCE(SUM((nutrients->>'iron')::numeric), 0),
      COALESCE(SUM((nutrients->>'dha')::numeric), 0),
      COALESCE(SUM((nutrients->>'folate')::numeric), 0),
      COALESCE(SUM((nutrients->>'calcium')::numeric), 0),
      COALESCE(SUM((nutrients->>'protein')::numeric), 0),
      COALESCE(SUM((nutrients->>'fiber')::numeric), 0),
      COALESCE(SUM((nutrients->>'vitamin_d')::numeric), 0),
      COALESCE(SUM((nutrients->>'choline')::numeric), 0),
      COALESCE(SUM((nutrients->>'zinc')::numeric), 0),
      COALESCE(SUM((nutrients->>'magnesium')::numeric), 0),
      COALESCE(SUM((nutrients->>'omega3')::numeric), 0),
      COALESCE(SUM((nutrients->>'vitamin_b6')::numeric), 0)
    INTO 
      total_calories,
      iron_total,
      dha_total,
      folate_total,
      calcium_total,
      protein_total,
      fiber_total,
      vitamin_d_total,
      choline_total,
      zinc_total,
      magnesium_total,
      omega3_total,
      vitamin_b6_total
    FROM meals
    WHERE meals.user_id = target_user_id
    AND DATE(logged_at) = log_date;
    
    -- Calculate wellness score based on iron intake (simplified)
    wellness_score := LEAST(100, GREATEST(0, (iron_total / 25.0 * 100)::integer));
    
    -- Insert daily log with aggregated nutrients
    INSERT INTO daily_logs (
      user_id,
      date,
      total_nutrients,
      total_calories,
      water_intake,
      wellness_score,
      mood,
      energy_level
    ) VALUES (
      target_user_id,
      log_date,
      jsonb_build_object(
        'iron', iron_total,
        'dha', dha_total,
        'folate', folate_total,
        'calcium', calcium_total,
        'protein', protein_total,
        'fiber', fiber_total,
        'vitamin_d', vitamin_d_total,
        'choline', choline_total,
        'zinc', zinc_total,
        'magnesium', magnesium_total,
        'omega3', omega3_total,
        'vitamin_b6', vitamin_b6_total
      ),
      total_calories,
      6 + (random() * 3)::integer, -- 6-8 glasses
      COALESCE(wellness_score, 70 + (random() * 25)::integer),
      (ARRAY['😊', '😐', '😴', '💪'])[1 + (random() * 3)::integer],
      3 + (random() * 3)::integer -- 3-5 energy level
    )
    ON CONFLICT (user_id, date) DO NOTHING;
  END LOOP;
END $$;