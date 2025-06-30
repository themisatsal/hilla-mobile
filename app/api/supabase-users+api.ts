// Supabase Users API endpoint
import { supabaseClient } from '@/lib/supabase-client';
import { ApiResponse, User } from '@/types/api';

export async function GET(request: Request): Promise<Response> {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('id');
    const email = url.searchParams.get('email');

    if (userId) {
      const response = await supabaseClient.getUser(userId);
      return Response.json(response, { 
        status: response.success ? 200 : 404 
      });
    }

    if (email) {
      const response = await supabaseClient.getUserByEmail(email);
      return Response.json(response, { 
        status: response.success ? 200 : 404 
      });
    }

    const response: ApiResponse = {
      success: false,
      error: 'User ID or email is required',
    };
    return Response.json(response, { status: 400 });
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

    const response = await supabaseClient.createUser(userData);
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
        error: 'User ID is required',
      };
      return Response.json(response, { status: 400 });
    }

    const response = await supabaseClient.updateUser(id, updates);
    return Response.json(response, { 
      status: response.success ? 200 : 404 
    });
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: 'Internal server error',
    };
    return Response.json(response, { status: 500 });
  }
}