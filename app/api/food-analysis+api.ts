// Food Analysis API endpoint
import { ApiResponse } from '@/types/api';
import { supabase } from '@/lib/supabase';

// GET - Retrieve food analysis records for a user
export async function GET(request: Request): Promise<Response> {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    const id = url.searchParams.get('id');
    const limit = url.searchParams.get('limit');

    if (!userId) {
      const response: ApiResponse = {
        success: false,
        error: 'User ID is required',
      };
      return Response.json(response, { status: 400 });
    }

    let query = supabase
      .from('food_analysis')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (id) {
      query = query.eq('id', id);
    }

    if (limit) {
      query = query.limit(parseInt(limit));
    }

    const { data, error } = await query;

    if (error) {
      const response: ApiResponse = {
        success: false,
        error: error.message,
      };
      return Response.json(response, { status: 500 });
    }

    const response: ApiResponse = {
      success: true,
      data: data,
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

// POST - Save a new food analysis record
export async function POST(request: Request): Promise<Response> {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.userId || !body.foodName || !body.portionSize || !body.nutritionData) {
      const response: ApiResponse = {
        success: false,
        error: 'User ID, food name, portion size, and nutrition data are required',
      };
      return Response.json(response, { status: 400 });
    }

    const { data, error } = await supabase
      .from('food_analysis')
      .insert({
        user_id: body.userId,
        food_name: body.foodName,
        image_url: body.imageUrl || null,
        portion_size: body.portionSize,
        nutrition_data: body.nutritionData,
        saved_to_log: body.savedToLog || false
      })
      .select()
      .single();

    if (error) {
      const response: ApiResponse = {
        success: false,
        error: error.message,
      };
      return Response.json(response, { status: 500 });
    }

    const response: ApiResponse = {
      success: true,
      data: data,
      message: 'Food analysis saved successfully',
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

// PUT - Update a food analysis record
export async function PUT(request: Request): Promise<Response> {
  try {
    const body = await request.json();
    
    if (!body.id) {
      const response: ApiResponse = {
        success: false,
        error: 'Analysis ID is required',
      };
      return Response.json(response, { status: 400 });
    }

    const updates: any = {};
    if (body.savedToLog !== undefined) updates.saved_to_log = body.savedToLog;
    if (body.portionSize !== undefined) updates.portion_size = body.portionSize;
    if (body.nutritionData !== undefined) updates.nutrition_data = body.nutritionData;

    const { data, error } = await supabase
      .from('food_analysis')
      .update(updates)
      .eq('id', body.id)
      .select()
      .single();

    if (error) {
      const response: ApiResponse = {
        success: false,
        error: error.message,
      };
      return Response.json(response, { status: 500 });
    }

    const response: ApiResponse = {
      success: true,
      data: data,
      message: 'Food analysis updated successfully',
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

// DELETE - Delete a food analysis record
export async function DELETE(request: Request): Promise<Response> {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      const response: ApiResponse = {
        success: false,
        error: 'Analysis ID is required',
      };
      return Response.json(response, { status: 400 });
    }

    const { error } = await supabase
      .from('food_analysis')
      .delete()
      .eq('id', id);

    if (error) {
      const response: ApiResponse = {
        success: false,
        error: error.message,
      };
      return Response.json(response, { status: 500 });
    }

    const response: ApiResponse = {
      success: true,
      message: 'Food analysis deleted successfully',
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