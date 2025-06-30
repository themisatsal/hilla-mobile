// AI Nutrition Advice API endpoint
import { generateNutritionAdvice } from '@/lib/openai';
import { userDb, ensureInitialized } from '@/lib/database';
import { ApiResponse } from '@/types/api';

// Ensure sample data is initialized
ensureInitialized();

export async function POST(request: Request): Promise<Response> {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.userId || !body.prompt) {
      const response: ApiResponse = {
        success: false,
        error: 'User ID and prompt are required',
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
      dietaryPreferences: user.dietaryPreferences,
    };

    // Generate advice
    const advice = await generateNutritionAdvice(body.prompt, userContext);
    
    const response: ApiResponse<{ advice: string }> = {
      success: true,
      data: { advice },
    };
    return Response.json(response);
  } catch (error) {
    console.error('AI Nutrition Advice API error:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Failed to generate nutrition advice',
    };
    return Response.json(response, { status: 500 });
  }
}