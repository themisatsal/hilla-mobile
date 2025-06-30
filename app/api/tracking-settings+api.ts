// Tracking Settings API endpoint
import { trackingSettingsDb, userDb, ensureInitialized } from '@/lib/database';
import { ApiResponse, TrackingSettings } from '@/types/api';

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

    // Verify user exists
    const user = userDb.findById(userId);
    if (!user) {
      const response: ApiResponse = {
        success: false,
        error: 'User not found',
      };
      return Response.json(response, { status: 404 });
    }

    let settings = trackingSettingsDb.findByUserId(userId);
    
    // If no settings exist, create default ones
    if (!settings) {
      settings = trackingSettingsDb.create({
        userId,
        selectedMetrics: ['iron', 'dha', 'folate'],
      });
    }

    const response: ApiResponse<TrackingSettings> = {
      success: true,
      data: settings,
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
    if (!body.userId || !Array.isArray(body.selectedMetrics)) {
      const response: ApiResponse = {
        success: false,
        error: 'User ID and selectedMetrics array are required',
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

    // Validate selectedMetrics
    if (body.selectedMetrics.length > 3) {
      const response: ApiResponse = {
        success: false,
        error: 'Maximum 3 metrics can be selected',
      };
      return Response.json(response, { status: 400 });
    }

    // Check if settings already exist
    const existingSettings = trackingSettingsDb.findByUserId(body.userId);
    if (existingSettings) {
      const response: ApiResponse = {
        success: false,
        error: 'Tracking settings already exist for this user',
      };
      return Response.json(response, { status: 409 });
    }

    const settings = trackingSettingsDb.create({
      userId: body.userId,
      selectedMetrics: body.selectedMetrics,
    });
    
    const response: ApiResponse<TrackingSettings> = {
      success: true,
      data: settings,
      message: 'Tracking settings created successfully',
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

    const settings = trackingSettingsDb.update(body.userId, {
      selectedMetrics: body.selectedMetrics,
    });

    if (!settings) {
      const response: ApiResponse = {
        success: false,
        error: 'Tracking settings not found',
      };
      return Response.json(response, { status: 404 });
    }

    const response: ApiResponse<TrackingSettings> = {
      success: true,
      data: settings,
      message: 'Tracking settings updated successfully',
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

    if (!userId) {
      const response: ApiResponse = {
        success: false,
        error: 'User ID is required',
      };
      return Response.json(response, { status: 400 });
    }

    const deleted = trackingSettingsDb.delete(userId);
    if (!deleted) {
      const response: ApiResponse = {
        success: false,
        error: 'Tracking settings not found',
      };
      return Response.json(response, { status: 404 });
    }

    const response: ApiResponse = {
      success: true,
      message: 'Tracking settings deleted successfully',
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