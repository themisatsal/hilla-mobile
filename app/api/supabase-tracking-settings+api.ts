// Supabase Tracking Settings API endpoint
import { supabaseClient } from '@/lib/supabase-client';
import { ApiResponse, TrackingSettings } from '@/types/api';

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

    const apiResponse = await supabaseClient.getTrackingSettings(userId);
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

export async function PUT(request: Request): Promise<Response> {
  try {
    const body = await request.json();
    
    if (!body.userId) {
      const response: ApiResponse = {
        success: false,
        error: 'User ID is required',
      };
      return Response.json(response, { status: 400 });
    }

    // Validate selectedMetrics if provided
    if (body.selectedMetrics && body.selectedMetrics.length > 3) {
      const response: ApiResponse = {
        success: false,
        error: 'Maximum 3 metrics can be selected',
      };
      return Response.json(response, { status: 400 });
    }

    const apiResponse = await supabaseClient.updateTrackingSettings(
      body.userId, 
      body.selectedMetrics || []
    );
    
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