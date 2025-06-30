// Supabase Meals API endpoint
import { supabaseClient } from '@/lib/supabase-client';
import { ApiResponse, Meal } from '@/types/api';

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

    let apiResponse;

    if (date) {
      // Get meals for specific date
      apiResponse = await supabaseClient.getMealsByDate(userId, date);
    } else {
      // Get recent meals
      const limitNum = limit ? parseInt(limit) : undefined;
      apiResponse = await supabaseClient.getUserMeals(userId, limitNum);
    }

    return Response.json(apiResponse, { 
      status: apiResponse.success ? 200 : 400 
    });
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
    if (!body.userId || !body.name || !body.nutrients) {
      const response: ApiResponse = {
        success: false,
        error: 'User ID, name, and nutrients are required',
      };
      return Response.json(response, { status: 400 });
    }

    // Create meal data
    const mealData = {
      userId: body.userId,
      name: body.name,
      description: body.description || '',
      nutrients: body.nutrients,
      calories: body.calories || 0,
      servings: body.servings || 1,
      mealType: body.mealType || 'snack',
      loggedAt: body.loggedAt || new Date().toISOString(),
    };

    const response = await supabaseClient.createMeal(mealData);
    return Response.json(response, { 
      status: response.success ? 201 : 400 
    });
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: 'Internal server error',
    };
    return Response.json(response, { status: 500 });
  }
}