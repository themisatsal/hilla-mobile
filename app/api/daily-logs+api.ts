// Daily Logs API endpoint
import { 
  dailyLogDb, 
  mealDb, 
  userDb, 
  calculateTotalNutrients, 
  calculateWellnessScore, 
  getDailyTargets,
  getDateString,
  ensureInitialized 
} from '@/lib/database';
import { ApiResponse, DailyLog } from '@/types/api';

// Ensure sample data is initialized
ensureInitialized();

export async function GET(request: Request): Promise<Response> {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    const date = url.searchParams.get('date');
    const limit = url.searchParams.get('limit');

    if (!userId) {
      const response: ApiResponse = {
        success: false,
        error: 'User ID is required',
      };
      return Response.json(response, { status: 400 });
    }

    // Verify user exists
    const user = userDb.findById(userId);
    if (!user) {
      const response: ApiResponse = {
        success: false,
        error: 'User not found',
      };
      return Response.json(response, { status: 404 });
    }

    if (date) {
      // Get specific date log
      let dailyLog = dailyLogDb.findByUserIdAndDate(userId, date);
      
      // If no log exists for this date, create one from meals
      if (!dailyLog) {
        const dayMeals = mealDb.findByUserIdAndDate(userId, date);
        const totalNutrients = calculateTotalNutrients(dayMeals);
        const targets = getDailyTargets(user.selectedStage);
        const wellnessScore = calculateWellnessScore(totalNutrients, targets);

        dailyLog = dailyLogDb.create({
          userId,
          date,
          meals: dayMeals,
          totalNutrients,
          totalCalories: dayMeals.reduce((sum, meal) => sum + meal.calories, 0),
          waterIntake: 0,
          wellnessScore,
        });
      }

      const response: ApiResponse<DailyLog> = {
        success: true,
        data: dailyLog,
      };
      return Response.json(response);
    }

    // Get multiple logs
    const limitNum = limit ? parseInt(limit) : undefined;
    const logs = dailyLogDb.findByUserId(userId, limitNum);

    const response: ApiResponse<DailyLog[]> = {
      success: true,
      data: logs,
    };
    return Response.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: 'Internal server error',
    };
    return Response.json(response, { status: 500 });
  }
}

export async function POST(request: Request): Promise<Response> {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.userId || !body.date) {
      const response: ApiResponse = {
        success: false,
        error: 'User ID and date are required',
      };
      return Response.json(response, { status: 400 });
    }

    // Verify user exists
    const user = userDb.findById(body.userId);
    if (!user) {
      const response: ApiResponse = {
        success: false,
        error: 'User not found',
      };
      return Response.json(response, { status: 404 });
    }

    // Check if log already exists
    const existingLog = dailyLogDb.findByUserIdAndDate(body.userId, body.date);
    if (existingLog) {
      const response: ApiResponse = {
        success: false,
        error: 'Daily log for this date already exists',
      };
      return Response.json(response, { status: 409 });
    }

    // Get meals for the date
    const dayMeals = mealDb.findByUserIdAndDate(body.userId, body.date);
    const totalNutrients = calculateTotalNutrients(dayMeals);
    const targets = getDailyTargets(user.selectedStage);
    const wellnessScore = calculateWellnessScore(totalNutrients, targets);

    // Create daily log
    const logData = {
      userId: body.userId,
      date: body.date,
      meals: dayMeals,
      totalNutrients,
      totalCalories: dayMeals.reduce((sum, meal) => sum + meal.calories, 0),
      waterIntake: body.waterIntake || 0,
      wellnessScore,
      mood: body.mood,
      energyLevel: body.energyLevel,
      notes: body.notes,
    };

    const dailyLog = dailyLogDb.create(logData);
    
    const response: ApiResponse<DailyLog> = {
      success: true,
      data: dailyLog,
      message: 'Daily log created successfully',
    };
    return Response.json(response, { status: 201 });
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: 'Internal server error',
    };
    return Response.json(response, { status: 500 });
  }
}

export async function PUT(request: Request): Promise<Response> {
  try {
    const body = await request.json();
    const { userId, date, ...updates } = body;

    if (!userId || !date) {
      const response: ApiResponse = {
        success: false,
        error: 'User ID and date are required',
      };
      return Response.json(response, { status: 400 });
    }

    // Find existing log
    const existingLog = dailyLogDb.findByUserIdAndDate(userId, date);
    if (!existingLog) {
      const response: ApiResponse = {
        success: false,
        error: 'Daily log not found',
      };
      return Response.json(response, { status: 404 });
    }

    // If meals were updated, recalculate totals
    if (updates.meals) {
      const user = userDb.findById(userId);
      if (user) {
        const totalNutrients = calculateTotalNutrients(updates.meals);
        const targets = getDailyTargets(user.selectedStage);
        const wellnessScore = calculateWellnessScore(totalNutrients, targets);
        
        updates.totalNutrients = totalNutrients;
        updates.totalCalories = updates.meals.reduce((sum: number, meal: any) => sum + meal.calories, 0);
        updates.wellnessScore = wellnessScore;
      }
    }

    const dailyLog = dailyLogDb.update(existingLog.id, updates);
    
    const response: ApiResponse<DailyLog> = {
      success: true,
      data: dailyLog,
      message: 'Daily log updated successfully',
    };
    return Response.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: 'Internal server error',
    };
    return Response.json(response, { status: 500 });
  }
}

export async function DELETE(request: Request): Promise<Response> {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    const date = url.searchParams.get('date');

    if (!userId || !date) {
      const response: ApiResponse = {
        success: false,
        error: 'User ID and date are required',
      };
      return Response.json(response, { status: 400 });
    }

    const existingLog = dailyLogDb.findByUserIdAndDate(userId, date);
    if (!existingLog) {
      const response: ApiResponse = {
        success: false,
        error: 'Daily log not found',
      };
      return Response.json(response, { status: 404 });
    }

    const deleted = dailyLogDb.delete(existingLog.id);
    
    const response: ApiResponse = {
      success: true,
      message: 'Daily log deleted successfully',
    };
    return Response.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: 'Internal server error',
    };
    return Response.json(response, { status: 500 });
  }
}