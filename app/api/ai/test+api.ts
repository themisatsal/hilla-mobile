// AI Test API endpoint
import OpenAI from 'npm:openai';
import { ApiResponse } from '@/types/api';

export async function GET(request: Request): Promise<Response> {
  try {
    // Initialize OpenAI client with OpenRouter configuration
    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.EXPO_PUBLIC_OPENROUTER_API_KEY || "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",
      defaultHeaders: {
        "HTTP-Referer": "https://hilla-nutrition.app",
        "X-Title": "Hilla Nutrition",
      },
    });

    // Test the OpenAI connection
    const completion = await openai.chat.completions.create({
      model: "deepseek/deepseek-r1-0528:free",
      messages: [
        {
          "role": "user",
          "content": "What is the meaning of life?"
        }
      ],
    });

    const response: ApiResponse<{
      message: string;
      model: string;
      status: string;
    }> = {
      success: true,
      data: {
        message: completion.choices[0].message.content || "No response",
        model: completion.model,
        status: "connected"
      },
    };
    
    return Response.json(response);
  } catch (error) {
    console.error('AI Test API error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    const response: ApiResponse = {
      success: false,
      error: `Failed to connect to AI service: ${errorMessage}`,
    };
    return Response.json(response, { status: 500 });
  }
}