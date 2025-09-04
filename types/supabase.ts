export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      goals: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string
          target_value: number
          current_value: number
          unit: string
          category: string
          color: string
          start_date: string
          target_date: string | null
          is_completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string
          target_value?: number
          current_value?: number
          unit?: string
          category?: string
          color?: string
          start_date?: string
          target_date?: string | null
          is_completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string
          target_value?: number
          current_value?: number
          unit?: string
          category?: string
          color?: string
          start_date?: string
          target_date?: string | null
          is_completed?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          email: string
          name: string
          selected_stage: string
          selected_goal: string
          dietary_preferences: Json
          energy_boosters: Json
          energy_drainers: Json
          baseline_answers: Json
          permissions: Json
          wearables: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          selected_stage?: string
          selected_goal?: string
          dietary_preferences?: Json
          energy_boosters?: Json
          energy_drainers?: Json
          baseline_answers?: Json
          permissions?: Json
          wearables?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          selected_stage?: string
          selected_goal?: string
          dietary_preferences?: Json
          energy_boosters?: Json
          energy_drainers?: Json
          baseline_answers?: Json
          permissions?: Json
          wearables?: Json
          created_at?: string
          updated_at?: string
        }
      }
      meals: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string
          nutrients: Json
          calories: number
          servings: number
          meal_type: string
          logged_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string
          nutrients: Json
          calories?: number
          servings?: number
          meal_type?: string
          logged_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string
          nutrients?: Json
          calories?: number
          servings?: number
          meal_type?: string
          logged_at?: string
          created_at?: string
        }
      }
      daily_logs: {
        Row: {
          id: string
          user_id: string
          date: string
          total_nutrients: Json
          total_calories: number
          water_intake: number
          wellness_score: number
          mood: string | null
          energy_level: number | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          total_nutrients?: Json
          total_calories?: number
          water_intake?: number
          wellness_score?: number
          mood?: string | null
          energy_level?: number | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          total_nutrients?: Json
          total_calories?: number
          water_intake?: number
          wellness_score?: number
          mood?: string | null
          energy_level?: number | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      tracking_settings: {
        Row: {
          id: string
          user_id: string
          selected_metrics: Json
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          selected_metrics?: Json
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          selected_metrics?: Json
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}