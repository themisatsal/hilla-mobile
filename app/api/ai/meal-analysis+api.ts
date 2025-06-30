// AI Meal Analysis API endpoint
import { analyzeMeal } from '@/lib/openai';
import { userDb, ensureInitialized } from '@/lib/database';
import { ApiResponse } from '@/types/api';

// Ensure sample data is initialized
ensureInitialized();

export async function POST(request: Request): Promise<Response> {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.userId || !body.mealDescription) {
      const response: ApiResponse = {
        success: false,
        error: 'User ID and meal description are required',
      };
      return Response.json(response, { status: 400 });
    }

    // Get user context
    const user = userDb.findById(body.userId);
    if (!user) {
      const response: ApiResponse = {
        success: false,
        error: 'User not found',
      };
      return Response.json(response, { status: 404 });
    }

    // Prepare user context for AI
    const userContext = {
      stage: user.selectedStage,
      goal: user.selectedGoal,
    };

    // Analyze meal
    const analysis = await analyzeMeal(body.mealDescription, userContext);
    
    const response: ApiResponse<{
      nutrients: Record<string, number>;
      calories: number;
      analysis: string;
    }> = {
      success: true,
      data: analysis,
    };
    return Response.json(response);
  } catch (error) {
    console.error('AI Meal Analysis API error:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Failed to analyze meal',
    };
    return Response.json(response, { status: 500 });
  }
}