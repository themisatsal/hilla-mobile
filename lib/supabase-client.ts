// Supabase API Client for Hilla
import { supabase, handleSupabaseError, requireAuth } from '@/lib/supabase';
import { Database } from '@/types/supabase';
import { ApiResponse, User, Meal, DailyLog, TrackingSettings, NutrientData } from '@/types/api';

type Tables = Database['public']['Tables'];
type UserRow = Tables['users']['Row'];
type MealRow = Tables['meals']['Row'];
type DailyLogRow = Tables['daily_logs']['Row'];
type TrackingSettingsRow = Tables['tracking_settings']['Row'];

// Helper function to convert database row to API format
const convertUserRow = (row: UserRow): User => ({
  id: row.id,
  name: row.name,
  email: row.email,
  selectedStage: row.selected_stage as any,
  selectedGoal: row.selected_goal,
  dietaryPreferences: (row.dietary_preferences as string[]) || [],
  energyBoosters: (row.energy_boosters as string[]) || [],
  energyDrainers: (row.energy_drainers as string[]) || [],
  baselineAnswers: (row.baseline_answers as Record<string, any>) || {},
  permissions: (row.permissions as any) || { pushReminders: false, healthData: false },
  wearables: (row.wearables as any) || { oura: false, whoop: false, fitbit: false },
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const convertMealRow = (row: MealRow): Meal => ({
  id: row.id,
  userId: row.user_id,
  name: row.name,
  description: row.description,
  nutrients: (row.nutrients as NutrientData) || {},
  calories: row.calories,
  servings: row.servings,
  mealType: row.meal_type as any,
  loggedAt: row.logged_at,
  createdAt: row.created_at,
});

const convertDailyLogRow = (row: DailyLogRow, meals: Meal[] = []): DailyLog => ({
  id: row.id,
  userId: row.user_id,
  date: row.date,
  meals,
  totalNutrients: (row.total_nutrients as NutrientData) || {},
  totalCalories: row.total_calories,
  waterIntake: row.water_intake,
  wellnessScore: row.wellness_score,
  mood: row.mood || undefined,
  energyLevel: row.energy_level || undefined,
  notes: row.notes || undefined,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const convertTrackingSettingsRow = (row: TrackingSettingsRow): TrackingSettings => ({
  userId: row.user_id,
  selectedMetrics: (row.selected_metrics as string[]) || [],
  updatedAt: row.updated_at,
});

export class SupabaseClient {
  // User operations
  async getUser(id: string): Promise<ApiResponse<User>> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        return {
          success: false,
          error: handleSupabaseError(error),
        };
      }

      return {
        success: true,
        data: convertUserRow(data),
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch user',
      };
    }
  }

  async getUserByEmail(email: string): Promise<ApiResponse<User>> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (error) {
        return {
          success: false,
          error: handleSupabaseError(error),
        };
      }

      return {
        success: true,
        data: convertUserRow(data),
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch user',
      };
    }
  }

  async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<User>> {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert({
          email: userData.email,
          name: userData.name,
          selected_stage: userData.selectedStage,
          selected_goal: userData.selectedGoal,
          dietary_preferences: userData.dietaryPreferences,
          energy_boosters: userData.energyBoosters,
          energy_drainers: userData.energyDrainers,
          baseline_answers: userData.baselineAnswers,
          permissions: userData.permissions,
          wearables: userData.wearables,
        })
        .select()
        .single();

      if (error) {
        return {
          success: false,
          error: handleSupabaseError(error),
        };
      }

      return {
        success: true,
        data: convertUserRow(data),
        message: 'User created successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to create user',
      };
    }
  }

  async updateUser(id: string, updates: Partial<User>): Promise<ApiResponse<User>> {
    try {
      const updateData: any = {};
      
      if (updates.name) updateData.name = updates.name;
      if (updates.email) updateData.email = updates.email;
      if (updates.selectedStage) updateData.selected_stage = updates.selectedStage;
      if (updates.selectedGoal) updateData.selected_goal = updates.selectedGoal;
      if (updates.dietaryPreferences) updateData.dietary_preferences = updates.dietaryPreferences;
      if (updates.energyBoosters) updateData.energy_boosters = updates.energyBoosters;
      if (updates.energyDrainers) updateData.energy_drainers = updates.energyDrainers;
      if (updates.baselineAnswers) updateData.baseline_answers = updates.baselineAnswers;
      if (updates.permissions) updateData.permissions = updates.permissions;
      if (updates.wearables) updateData.wearables = updates.wearables;

      const { data, error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return {
          success: false,
          error: handleSupabaseError(error),
        };
      }

      return {
        success: true,
        data: convertUserRow(data),
        message: 'User updated successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to update user',
      };
    }
  }

  // Meal operations
  async getUserMeals(userId: string, limit?: number): Promise<ApiResponse<Meal[]>> {
    try {
      let query = supabase
        .from('meals')
        .select('*')
        .eq('user_id', userId)
        .order('logged_at', { ascending: false });

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) {
        return {
          success: false,
          error: handleSupabaseError(error),
        };
      }

      return {
        success: true,
        data: data.map(convertMealRow),
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch meals',
      };
    }
  }

  async getMealsByDate(userId: string, date: string): Promise<ApiResponse<Meal[]>> {
    try {
      const { data, error } = await supabase
        .from('meals')
        .select('*')
        .eq('user_id', userId)
        .gte('logged_at', `${date}T00:00:00`)
        .lt('logged_at', `${date}T23:59:59`)
        .order('logged_at', { ascending: true });

      if (error) {
        return {
          success: false,
          error: handleSupabaseError(error),
        };
      }

      return {
        success: true,
        data: data.map(convertMealRow),
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch meals',
      };
    }
  }

  async createMeal(mealData: Omit<Meal, 'id' | 'createdAt'>): Promise<ApiResponse<Meal>> {
    try {
      const { data, error } = await supabase
        .from('meals')
        .insert({
          user_id: mealData.userId,
          name: mealData.name,
          description: mealData.description,
          nutrients: mealData.nutrients,
          calories: mealData.calories,
          servings: mealData.servings,
          meal_type: mealData.mealType,
          logged_at: mealData.loggedAt,
        })
        .select()
        .single();

      if (error) {
        return {
          success: false,
          error: handleSupabaseError(error),
        };
      }

      return {
        success: true,
        data: convertMealRow(data),
        message: 'Meal logged successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to create meal',
      };
    }
  }

  // Daily log operations
  async getDailyLog(userId: string, date: string): Promise<ApiResponse<DailyLog>> {
    try {
      // Get daily log
      const { data: logData, error: logError } = await supabase
        .from('daily_logs')
        .select('*')
        .eq('user_id', userId)
        .eq('date', date)
        .single();

      if (logError && logError.code !== 'PGRST116') {
        return {
          success: false,
          error: handleSupabaseError(logError),
        };
      }

      // Get meals for the date
      const mealsResponse = await this.getMealsByDate(userId, date);
      const meals = mealsResponse.success ? mealsResponse.data! : [];

      if (!logData) {
        // Create a new daily log if it doesn't exist
        const totalNutrients = this.calculateTotalNutrients(meals);
        const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);
        const wellnessScore = this.calculateWellnessScore(totalNutrients);

        const { data: newLogData, error: createError } = await supabase
          .from('daily_logs')
          .insert({
            user_id: userId,
            date,
            total_nutrients: totalNutrients,
            total_calories: totalCalories,
            wellness_score: wellnessScore,
          })
          .select()
          .single();

        if (createError) {
          return {
            success: false,
            error: handleSupabaseError(createError),
          };
        }

        return {
          success: true,
          data: convertDailyLogRow(newLogData, meals),
        };
      }

      return {
        success: true,
        data: convertDailyLogRow(logData, meals),
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch daily log',
      };
    }
  }

  // Tracking settings operations
  async getTrackingSettings(userId: string): Promise<ApiResponse<TrackingSettings>> {
    try {
      const { data, error } = await supabase
        .from('tracking_settings')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        return {
          success: false,
          error: handleSupabaseError(error),
        };
      }

      if (!data) {
        // Create default settings
        const { data: newData, error: createError } = await supabase
          .from('tracking_settings')
          .insert({
            user_id: userId,
            selected_metrics: ['iron', 'dha', 'folate'],
          })
          .select()
          .single();

        if (createError) {
          return {
            success: false,
            error: handleSupabaseError(createError),
          };
        }

        return {
          success: true,
          data: convertTrackingSettingsRow(newData),
        };
      }

      return {
        success: true,
        data: convertTrackingSettingsRow(data),
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch tracking settings',
      };
    }
  }

  async updateTrackingSettings(userId: string, selectedMetrics: string[]): Promise<ApiResponse<TrackingSettings>> {
    try {
      const { data, error } = await supabase
        .from('tracking_settings')
        .upsert({
          user_id: userId,
          selected_metrics: selectedMetrics,
        })
        .select()
        .single();

      if (error) {
        return {
          success: false,
          error: handleSupabaseError(error),
        };
      }

      return {
        success: true,
        data: convertTrackingSettingsRow(data),
        message: 'Tracking settings updated successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to update tracking settings',
      };
    }
  }

  // Helper methods
  private calculateTotalNutrients(meals: Meal[]): NutrientData {
    return meals.reduce((totals, meal) => {
      Object.keys(meal.nutrients).forEach(nutrient => {
        const key = nutrient as keyof NutrientData;
        totals[key] = (totals[key] || 0) + (meal.nutrients[key] || 0);
      });
      return totals;
    }, {} as NutrientData);
  }

  private calculateWellnessScore(totalNutrients: NutrientData): number {
    // Simplified wellness score calculation
    const targets = { iron: 25, dha: 1.5, folate: 400, calcium: 1000, protein: 75, fiber: 28 };
    const nutrients = ['iron', 'dha', 'folate', 'calcium', 'protein', 'fiber'] as const;
    
    const scores = nutrients.map(nutrient => {
      const current = totalNutrients[nutrient] || 0;
      const target = targets[nutrient] || 1;
      return Math.min((current / target) * 100, 100);
    });

    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
  }
}

export const supabaseClient = new SupabaseClient();