// AI Meal Suggestions API endpoint
import { generateMealSuggestions } from '@/lib/openai';
import { userDb, trackingSettingsDb, ensureInitialized } from '@/lib/database';
import { ApiResponse } from '@/types/api';

// Ensure sample data is initialized
ensureInitialized();

export async function GET(request: Request): Promise<Response> {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');

    if (!userId) {
      const response: ApiResponse = {
        success: false,
        error: 'User ID is required',
      };
      return Response.json(response, { status: 400 });
    }

    // Get user context
    const user = userDb.findById(userId);
    if (!user) {
      const response: ApiResponse = {
        success: false,
        error: 'User not found',
      };
      return Response.json(response, { status: 404 });
    }

    // Get tracking settings for nutrient needs
    const trackingSettings = trackingSettingsDb.findByUserId(userId);
    const nutrientNeeds = trackingSettings?.selectedMetrics || ['iron', 'dha', 'folate'];

    // Prepare user context for AI
    const userContext = {
      stage: user.selectedStage,
      goal: user.selectedGoal,
      dietaryPreferences: user.dietaryPreferences,
      nutrientNeeds,
    };

    // Generate meal suggestions
    const suggestions = await generateMealSuggestions(userContext);
    
    const response: ApiResponse<Array<{
      name: string;
      description: string;
      nutrients: Record<string, number>;
      calories: number;
      prepTime: string;
      ingredients: string[];
    }>> = {
      success: true,
      data: suggestions,
    };
    return Response.json(response);
  } catch (error) {
    console.error('AI Meal Suggestions API error:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Failed to generate meal suggestions',
    };
    return Response.json(response, { status: 500 });
  }
}