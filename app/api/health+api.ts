// Health check API endpoint
import { ensureInitialized } from '@/lib/database';
import { ApiResponse } from '@/types/api';

// Ensure sample data is initialized
ensureInitialized();

export async function GET(request: Request): Promise<Response> {
  try {
    const response: ApiResponse<{
      status: string;
      timestamp: string;
      version: string;
    }> = {
      success: true,
      data: {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
      },
      message: 'Hilla API is running successfully',
    };
    
    return Response.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: 'Health check failed',
    };
    return Response.json(response, { status: 500 });
  }
}