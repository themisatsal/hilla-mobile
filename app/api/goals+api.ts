// Goals API endpoint
import { ApiResponse, Goal } from '@/types/api';
import { supabaseClient } from '@/lib/supabase-client';

export async function GET(request: Request): Promise<Response> {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    const goalId = url.searchParams.get('id');

    if (!userId && !goalId) {
      const response: ApiResponse = {
        success: false,
        error: 'Either userId or goalId is required',
      };
      return Response.json(response, { status: 400 });
    }

    // Get a specific goal by ID
    if (goalId) {
      // This would need to be implemented in the supabaseClient
      // For now, we'll return a not implemented error
      const response: ApiResponse = {
        success: false,
        error: 'Getting a specific goal by ID is not implemented yet',
      };
      return Response.json(response, { status: 501 });
    }

    // Get all goals for a user
    const response = await supabaseClient.getUserGoals(userId!);
    return Response.json(response, { 
      status: response.success ? 200 : 400 
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
    if (!body.userId || !body.title) {
      const response: ApiResponse = {
        success: false,
        error: 'User ID and title are required',
      };
      return Response.json(response, { status: 400 });
    }

    // Create goal data
    const goalData: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'> = {
      userId: body.userId,
      title: body.title,
      description: body.description || '',
      targetValue: body.targetValue || 0,
      currentValue: body.currentValue || 0,
      unit: body.unit || '',
      category: body.category || 'nutrition',
      color: body.color || '#007AFF',
      startDate: body.startDate || new Date().toISOString().split('T')[0],
      targetDate: body.targetDate,
      isCompleted: body.isCompleted || false,
    };

    const response = await supabaseClient.createGoal(goalData);
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

export async function PUT(request: Request): Promise<Response> {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      const response: ApiResponse = {
        success: false,
        error: 'Goal ID is required',
      };
      return Response.json(response, { status: 400 });
    }

    const response = await supabaseClient.updateGoal(id, updates);
    return Response.json(response, { 
      status: response.success ? 200 : 400 
    });
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
    const goalId = url.searchParams.get('id');

    if (!goalId) {
      const response: ApiResponse = {
        success: false,
        error: 'Goal ID is required',
      };
      return Response.json(response, { status: 400 });
    }

    const response = await supabaseClient.deleteGoal(goalId);
    return Response.json(response, { 
      status: response.success ? 200 : 400 
    });
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: 'Internal server error',
    };
    return Response.json(response, { status: 500 });
  }
}