// In-memory database simulation for Hilla
// In production, this would be replaced with a real database like PostgreSQL, MongoDB, etc.

import { User, Meal, DailyLog, TrackingSettings, NutrientData } from '@/types/api';

// In-memory storage
const users = new Map<string, User>();
const meals = new Map<string, Meal>();
const dailyLogs = new Map<string, DailyLog>();
const trackingSettings = new Map<string, TrackingSettings>();

// Helper function to generate IDs
export const generateId = () => Math.random().toString(36).substr(2, 9);

// Helper function to get current timestamp
export const getCurrentTimestamp = () => new Date().toISOString();

// Helper function to get date string (YYYY-MM-DD)
export const getDateString = (date: Date = new Date()) => {
  return date.toISOString().split('T')[0];
};

// Daily targets based on pregnancy stage
export const getDailyTargets = (stage: string): NutrientData => {
  switch (stage) {
    case 'ttc':
      return { 
        iron: 18, 
        dha: 1.4, 
        folate: 400, 
        calcium: 1000, 
        protein: 46, 
        fiber: 25,
        vitamin_d: 600,
        choline: 450,
        zinc: 8,
        magnesium: 310,
        omega3: 1.4,
        vitamin_b6: 1.3
      };
    case 't1':
    case 't2':
    case 't3':
      return { 
        iron: 25, 
        dha: 1.5, 
        folate: 400, 
        calcium: 1000, 
        protein: 75, 
        fiber: 28,
        vitamin_d: 600,
        choline: 450,
        zinc: 11,
        magnesium: 350,
        omega3: 1.5,
        vitamin_b6: 1.9
      };
    case 'postpartum':
      return { 
        iron: 20, 
        dha: 1.5, 
        folate: 500, 
        calcium: 1000, 
        protein: 71, 
        fiber: 25,
        vitamin_d: 600,
        choline: 550,
        zinc: 12,
        magnesium: 310,
        omega3: 1.5,
        vitamin_b6: 2.0
      };
    default:
      return { 
        iron: 25, 
        dha: 1.5, 
        folate: 400, 
        calcium: 1000, 
        protein: 75, 
        fiber: 28,
        vitamin_d: 600,
        choline: 450,
        zinc: 11,
        magnesium: 350,
        omega3: 1.5,
        vitamin_b6: 1.9
      };
  }
};

// User operations
export const userDb = {
  create: (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): User => {
    const user: User = {
      ...userData,
      id: generateId(),
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
    };
    users.set(user.id, user);
    return user;
  },

  findById: (id: string): User | null => {
    return users.get(id) || null;
  },

  findByEmail: (email: string): User | null => {
    for (const user of users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return null;
  },

  update: (id: string, updates: Partial<User>): User | null => {
    const user = users.get(id);
    if (!user) return null;

    const updatedUser = {
      ...user,
      ...updates,
      updatedAt: getCurrentTimestamp(),
    };
    users.set(id, updatedUser);
    return updatedUser;
  },

  delete: (id: string): boolean => {
    return users.delete(id);
  },

  list: (): User[] => {
    return Array.from(users.values());
  },
};

// Meal operations
export const mealDb = {
  create: (mealData: Omit<Meal, 'id' | 'createdAt'>): Meal => {
    const meal: Meal = {
      ...mealData,
      id: generateId(),
      createdAt: getCurrentTimestamp(),
    };
    meals.set(meal.id, meal);
    return meal;
  },

  findById: (id: string): Meal | null => {
    return meals.get(id) || null;
  },

  findByUserId: (userId: string, limit?: number): Meal[] => {
    const userMeals = Array.from(meals.values())
      .filter(meal => meal.userId === userId)
      .sort((a, b) => new Date(b.loggedAt).getTime() - new Date(a.loggedAt).getTime());
    
    return limit ? userMeals.slice(0, limit) : userMeals;
  },

  findByUserIdAndDate: (userId: string, date: string): Meal[] => {
    return Array.from(meals.values())
      .filter(meal => 
        meal.userId === userId && 
        meal.loggedAt.startsWith(date)
      )
      .sort((a, b) => new Date(a.loggedAt).getTime() - new Date(b.loggedAt).getTime());
  },

  update: (id: string, updates: Partial<Meal>): Meal | null => {
    const meal = meals.get(id);
    if (!meal) return null;

    const updatedMeal = { ...meal, ...updates };
    meals.set(id, updatedMeal);
    return updatedMeal;
  },

  delete: (id: string): boolean => {
    return meals.delete(id);
  },
};

// Daily log operations
export const dailyLogDb = {
  create: (logData: Omit<DailyLog, 'id' | 'createdAt' | 'updatedAt'>): DailyLog => {
    const log: DailyLog = {
      ...logData,
      id: generateId(),
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
    };
    dailyLogs.set(log.id, log);
    return log;
  },

  findByUserIdAndDate: (userId: string, date: string): DailyLog | null => {
    for (const log of dailyLogs.values()) {
      if (log.userId === userId && log.date === date) {
        return log;
      }
    }
    return null;
  },

  findByUserId: (userId: string, limit?: number): DailyLog[] => {
    const userLogs = Array.from(dailyLogs.values())
      .filter(log => log.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    return limit ? userLogs.slice(0, limit) : userLogs;
  },

  update: (id: string, updates: Partial<DailyLog>): DailyLog | null => {
    const log = dailyLogs.get(id);
    if (!log) return null;

    const updatedLog = {
      ...log,
      ...updates,
      updatedAt: getCurrentTimestamp(),
    };
    dailyLogs.set(id, updatedLog);
    return updatedLog;
  },

  delete: (id: string): boolean => {
    return dailyLogs.delete(id);
  },
};

// Tracking settings operations
export const trackingSettingsDb = {
  create: (settingsData: Omit<TrackingSettings, 'updatedAt'>): TrackingSettings => {
    const settings: TrackingSettings = {
      ...settingsData,
      updatedAt: getCurrentTimestamp(),
    };
    trackingSettings.set(settings.userId, settings);
    return settings;
  },

  findByUserId: (userId: string): TrackingSettings | null => {
    return trackingSettings.get(userId) || null;
  },

  update: (userId: string, updates: Partial<TrackingSettings>): TrackingSettings | null => {
    const settings = trackingSettings.get(userId);
    if (!settings) return null;

    const updatedSettings = {
      ...settings,
      ...updates,
      updatedAt: getCurrentTimestamp(),
    };
    trackingSettings.set(userId, updatedSettings);
    return updatedSettings;
  },

  delete: (userId: string): boolean => {
    return trackingSettings.delete(userId);
  },
};

// Utility functions
export const calculateTotalNutrients = (meals: Meal[]): NutrientData => {
  return meals.reduce((totals, meal) => {
    Object.keys(meal.nutrients).forEach(nutrient => {
      const key = nutrient as keyof NutrientData;
      totals[key] = (totals[key] || 0) + (meal.nutrients[key] || 0);
    });
    return totals;
  }, {} as NutrientData);
};

export const calculateWellnessScore = (totalNutrients: NutrientData, targets: NutrientData): number => {
  const nutrients = ['iron', 'dha', 'folate', 'calcium', 'protein', 'fiber'] as const;
  
  const scores = nutrients.map(nutrient => {
    const current = totalNutrients[nutrient] || 0;
    const target = targets[nutrient] || 1;
    return Math.min((current / target) * 100, 100);
  });

  return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
};

// Initialize with some sample data
export const initializeSampleData = () => {
  // Create sample user
  const sampleUser = userDb.create({
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    selectedStage: 't2',
    selectedGoal: 'Build Baby\'s Bones 🦴',
    dietaryPreferences: ['Vegetarian'],
    energyBoosters: ['Morning walk', 'Green smoothie'],
    energyDrainers: ['Late nights', 'Sugary drinks'],
    baselineAnswers: {},
    permissions: {
      pushReminders: true,
      healthData: false,
    },
    wearables: {
      oura: false,
      whoop: false,
      fitbit: false,
    },
  });

  // Create sample tracking settings
  trackingSettingsDb.create({
    userId: sampleUser.id,
    selectedMetrics: ['iron', 'dha', 'folate'],
  });

  // Create sample meals for the last few days
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Morning meal
    const morningMeal = mealDb.create({
      userId: sampleUser.id,
      name: 'Greek Yogurt with Berries',
      description: 'Plain Greek yogurt with mixed berries and granola',
      nutrients: {
        iron: 2.1,
        dha: 0.05,
        folate: 15,
        calcium: 150,
        protein: 15,
        fiber: 3,
        vitamin_d: 40,
        choline: 35,
        zinc: 1.2,
        magnesium: 25,
        omega3: 0.05,
        vitamin_b6: 0.1,
      },
      calories: 180,
      servings: 1,
      mealType: 'breakfast',
      loggedAt: new Date(date.getTime() + 8 * 60 * 60 * 1000).toISOString(), // 8 AM
    });

    // Supplement
    const supplement = mealDb.create({
      userId: sampleUser.id,
      name: 'Prenatal Vitamin',
      description: 'Daily prenatal multivitamin',
      nutrients: {
        iron: 18,
        dha: 0.2,
        folate: 400,
        calcium: 200,
        protein: 0,
        fiber: 0,
        vitamin_d: 400,
        choline: 55,
        zinc: 15,
        magnesium: 50,
        omega3: 0.2,
        vitamin_b6: 1.9,
      },
      calories: 0,
      servings: 1,
      mealType: 'breakfast',
      loggedAt: new Date(date.getTime() + 8.5 * 60 * 60 * 1000).toISOString(), // 8:30 AM
    });

    // Lunch
    const lunchMeal = mealDb.create({
      userId: sampleUser.id,
      name: 'Spinach Salad with Salmon',
      description: 'Fresh spinach salad with grilled salmon and quinoa',
      nutrients: {
        iron: 4.2,
        dha: 1.1,
        folate: 65,
        calcium: 120,
        protein: 28,
        fiber: 6,
        vitamin_d: 360,
        choline: 85,
        zinc: 2.8,
        magnesium: 95,
        omega3: 1.2,
        vitamin_b6: 0.8,
      },
      calories: 420,
      servings: 1,
      mealType: 'lunch',
      loggedAt: new Date(date.getTime() + 13 * 60 * 60 * 1000).toISOString(), // 1 PM
    });

    const dayMeals = [morningMeal, supplement, lunchMeal];
    const totalNutrients = calculateTotalNutrients(dayMeals);
    const targets = getDailyTargets(sampleUser.selectedStage);
    const wellnessScore = calculateWellnessScore(totalNutrients, targets);

    // Create daily log
    dailyLogDb.create({
      userId: sampleUser.id,
      date: getDateString(date),
      meals: dayMeals,
      totalNutrients,
      totalCalories: dayMeals.reduce((sum, meal) => sum + meal.calories, 0),
      waterIntake: 6 + Math.floor(Math.random() * 3), // 6-8 glasses
      wellnessScore,
      mood: ['😊', '😐', '😴', '💪'][Math.floor(Math.random() * 4)],
      energyLevel: 3 + Math.floor(Math.random() * 3), // 3-5
    });
  }

  return sampleUser;
};

// Initialize sample data on first load
let initialized = false;
export const ensureInitialized = () => {
  if (!initialized) {
    initializeSampleData();
    initialized = true;
  }
};