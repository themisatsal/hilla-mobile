// API Types for Hilla Backend

export interface User {
  id: string;
  name: string;
  email: string;
  selectedStage: 'ttc' | 't1' | 't2' | 't3' | 'postpartum';
  selectedGoal: string;
  dietaryPreferences: string[];
  energyBoosters: string[];
  energyDrainers: string[];
  baselineAnswers: Record<string, any>;
  permissions: {
    pushReminders: boolean;
    healthData: boolean;
  };
  wearables: {
    oura: boolean;
    whoop: boolean;
    fitbit: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Goal {
  id: string;
  userId: string;
  title: string;
  description?: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  category: string;
  color: string;
  startDate: string;
  targetDate?: string;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NutrientData {
  iron: number;
  dha: number;
  folate: number;
  calcium: number;
  protein: number;
  fiber: number;
  vitamin_d?: number;
  choline?: number;
  zinc?: number;
  magnesium?: number;
  omega3?: number;
  vitamin_b6?: number;
}

export interface Meal {
  id: string;
  userId: string;
  name: string;
  description?: string;
  nutrients: NutrientData;
  calories: number;
  servings: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  loggedAt: string;
  createdAt: string;
}

export interface DailyLog {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD format
  meals: Meal[];
  totalNutrients: NutrientData;
  totalCalories: number;
  waterIntake: number; // glasses
  wellnessScore: number;
  mood?: string;
  energyLevel?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TrackingSettings {
  userId: string;
  selectedMetrics: string[];
  updatedAt: string;
}

export interface AnalyticsData {
  userId: string;
  period: '7d' | '30d' | '3m';
  nutrient: string;
  data: Array<{
    date: string;
    value: number;
  }>;
  average: number;
  target: number;
  targetPercentage: number;
  streak: number;
  change: number;
  insights: Array<{
    type: 'success' | 'improvement' | 'attention' | 'recommendation';
    title: string;
    description: string;
    color: string;
  }>;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}