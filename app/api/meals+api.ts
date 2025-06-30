// Meals API endpoint
import { mealDb, userDb, ensureInitialized } from '@/lib/database';
import { ApiResponse, Meal } from '@/types/api';

// Ensure sample data is initialized
ensureInitialized();

export async function GET(request: Request): Promise<Response> {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    const mealId = url.searchParams.get('id');
    const date = url.searchParams.get('date');
    const limit = url.searchParams.get('limit');

    if (mealId) {
      const meal = mealDb.findById(mealId);
      if (!meal) {
        const response: ApiResponse = {
          success: false,
          error: 'Meal not found',
        };
        return Response.json(response, { status: 404 });
      }

      const response: ApiResponse<Meal> = {
        success: true,
        data: meal,
      };
      return Response.json(response);
    }

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

    let meals: Meal[];

    if (date) {
      // Get meals for specific date
      meals = mealDb.findByUserIdAndDate(userId, date);
    } else {
      // Get recent meals
      const limitNum = limit ? parseInt(limit) : undefined;
      meals = mealDb.findByUserId(userId, limitNum);
    }

    const response: ApiResponse<Meal[]> = {
      success: true,
      data: meals,
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
    if (!body.userId || !body.name || !body.nutrients) {
      const response: ApiResponse = {
        success: false,
        error: 'User ID, name, and nutrients are required',
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

    const meal = mealDb.create(mealData);
    
    const response: ApiResponse<Meal> = {
      success: true,
      data: meal,
      message: 'Meal logged successfully',
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
    const { id, ...updates } = body;

    if (!id) {
      const response: ApiResponse = {
        success: false,
        error: 'Meal ID is required',
      };
      return Response.json(response, { status: 400 });
    }

    const meal = mealDb.update(id, updates);
    if (!meal) {
      const response: ApiResponse = {
        success: false,
        error: 'Meal not found',
      };
      return Response.json(response, { status: 404 });
    }

    const response: ApiResponse<Meal> = {
      success: true,
      data: meal,
      message: 'Meal updated successfully',
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
    const mealId = url.searchParams.get('id');

    if (!mealId) {
      const response: ApiResponse = {
        success: false,
        error: 'Meal ID is required',
      };
      return Response.json(response, { status: 400 });
    }

    const deleted = mealDb.delete(mealId);
    if (!deleted) {
      const response: ApiResponse = {
        success: false,
        error: 'Meal not found',
      };
      return Response.json(response, { status: 404 });
    }

    const response: ApiResponse = {
      success: true,
      message: 'Meal deleted successfully',
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