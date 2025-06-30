// Supabase Daily Logs API endpoint
import { supabaseClient } from '@/lib/supabase-client';
import { ApiResponse, DailyLog } from '@/types/api';

export async function GET(request: Request): Promise<Response> {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    const date = url.searchParams.get('date');

    if (!userId || !date) {
      const response: ApiResponse = {
        success: false,
        error: 'User ID and date are required',
      };
      return Response.json(response, { status: 400 });
    }

    const apiResponse = await supabaseClient.getDailyLog(userId, date);
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