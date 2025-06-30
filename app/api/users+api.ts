// Users API endpoint
import { userDb, ensureInitialized } from '@/lib/database';
import { ApiResponse, User } from '@/types/api';

// Ensure sample data is initialized
ensureInitialized();

export async function GET(request: Request): Promise<Response> {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('id');
    const email = url.searchParams.get('email');

    if (userId) {
      const user = userDb.findById(userId);
      if (!user) {
        const response: ApiResponse = {
          success: false,
          error: 'User not found',
        };
        return Response.json(response, { status: 404 });
      }

      const response: ApiResponse<User> = {
        success: true,
        data: user,
      };
      return Response.json(response);
    }

    if (email) {
      const user = userDb.findByEmail(email);
      if (!user) {
        const response: ApiResponse = {
          success: false,
          error: 'User not found',
        };
        return Response.json(response, { status: 404 });
      }

      const response: ApiResponse<User> = {
        success: true,
        data: user,
      };
      return Response.json(response);
    }

    // List all users (for admin purposes)
    const users = userDb.list();
    const response: ApiResponse<User[]> = {
      success: true,
      data: users,
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
    if (!body.name || !body.email) {
      const response: ApiResponse = {
        success: false,
        error: 'Name and email are required',
      };
      return Response.json(response, { status: 400 });
    }

    // Check if user already exists
    const existingUser = userDb.findByEmail(body.email);
    if (existingUser) {
      const response: ApiResponse = {
        success: false,
        error: 'User with this email already exists',
      };
      return Response.json(response, { status: 409 });
    }

    // Create new user
    const userData = {
      name: body.name,
      email: body.email,
      selectedStage: body.selectedStage || 't2',
      selectedGoal: body.selectedGoal || '',
      dietaryPreferences: body.dietaryPreferences || [],
      energyBoosters: body.energyBoosters || [],
      energyDrainers: body.energyDrainers || [],
      baselineAnswers: body.baselineAnswers || {},
      permissions: body.permissions || {
        pushReminders: false,
        healthData: false,
      },
      wearables: body.wearables || {
        oura: false,
        whoop: false,
        fitbit: false,
      },
    };

    const user = userDb.create(userData);
    
    const response: ApiResponse<User> = {
      success: true,
      data: user,
      message: 'User created successfully',
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
        error: 'User ID is required',
      };
      return Response.json(response, { status: 400 });
    }

    const user = userDb.update(id, updates);
    if (!user) {
      const response: ApiResponse = {
        success: false,
        error: 'User not found',
      };
      return Response.json(response, { status: 404 });
    }

    const response: ApiResponse<User> = {
      success: true,
      data: user,
      message: 'User updated successfully',
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
    const userId = url.searchParams.get('id');

    if (!userId) {
      const response: ApiResponse = {
        success: false,
        error: 'User ID is required',
      };
      return Response.json(response, { status: 400 });
    }

    const deleted = userDb.delete(userId);
    if (!deleted) {
      const response: ApiResponse = {
        success: false,
        error: 'User not found',
      };
      return Response.json(response, { status: 404 });
    }

    const response: ApiResponse = {
      success: true,
      message: 'User deleted successfully',
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