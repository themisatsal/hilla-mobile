// AI Chat API endpoint
import OpenAI from 'openai';
import { userDb, ensureInitialized } from '@/lib/database';
import { ApiResponse } from '@/types/api';

// Ensure sample data is initialized
ensureInitialized();

// Initialize OpenAI client with OpenRouter configuration
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: "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", 
  defaultHeaders: {
    "HTTP-Referer": "https://hilla-nutrition.app", 
    "X-Title": "Hilla Nutrition",
  },
});

// Default model to use
const DEFAULT_MODEL = "anthropic/claude-3-haiku:free";

export async function POST(request: Request): Promise<Response> {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.userId || !body.message) {
      const response: ApiResponse = {
        success: false, 
        error: 'User ID and message are required',
      };
      return Response.json(response, { status: 400 });
    }

    // Get user context
    const user = userDb.findById(body.userId);
    if (!user) {
      const response: ApiResponse = {
        success: false, 
        error: 'User not found',
      };
      return Response.json(response, { status: 404 });
    }

    // Prepare system prompt with user context
    const systemPrompt = `You are Hilla, an expert AI nutrition assistant specializing in maternal health from conception through postpartum.

Current user context:
- Name: ${user.name}
- Life stage: ${user.selectedStage}
- Goal: ${user.selectedGoal}
- Dietary preferences: ${user.dietaryPreferences.join(', ') || 'None specified'}

Provide evidence-based, practical nutrition advice that is:
1. Scientifically accurate and up-to-date
2. Personalized to the user's current stage and goals
3. Respectful of their dietary preferences
4. Actionable with specific food suggestions
5. Concise and easy to understand

IMPORTANT: If asked about serious medical conditions, always advise consulting a healthcare provider.
Format your response in a conversational, supportive tone. Use emoji sparingly for emphasis.

For questions about specific nutrients:
- Iron: Essential for blood production and oxygen transport. Needs increase during pregnancy.
- DHA: Critical for baby's brain and eye development.
- Folate: Prevents neural tube defects, especially important pre-conception and first trimester.
- Calcium: Builds baby's bones and teeth. If dietary intake is insufficient, calcium will be taken from mother's bones.
- Protein: Supports tissue growth for both mother and baby.
- Fiber: Helps prevent constipation, a common pregnancy complaint.

Respond as if you are having a direct conversation with ${user.name}.`;

    // Previous messages context if provided
    const previousMessages = body.previousMessages || [];
    
    // Create messages array for the API
    const messages = [
      { role: "system", content: systemPrompt.trim() },
      ...previousMessages.map((msg: any) => ({
        role: msg.isUser ? "user" : "assistant",
        content: msg.text
      })),
      { role: "user", content: body.message }
    ];

    // Generate response
    const completion = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      messages, 
      temperature: 0.7,
      max_tokens: 500,
    });

    const responseText = completion.choices[0].message.content || 
      "I'm sorry, I couldn't generate a response at this moment.";
    
    // Generate suggested follow-up questions 
    let suggestions: string[] = [];
    
    try {
      const suggestionsPrompt = `Based on the conversation so far and the user's question "${body.message}", 
      generate 3-4 follow-up questions the user might want to ask next. 
      Return ONLY a JSON array of strings, nothing else. Example: ["Question 1?", "Question 2?", "Question 3?"]`;
      
      const suggestionsCompletion = await openai.chat.completions.create({ 
        model: DEFAULT_MODEL,
        messages: [
          ...messages,
          { role: "assistant", content: responseText },
          { role: "user", content: suggestionsPrompt }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }, 
        max_tokens: 250,
      });
      
      const suggestionsText = suggestionsCompletion.choices[0].message.content || "[]";
      try {
        const parsedSuggestions = JSON.parse(suggestionsText);
        suggestions = Array.isArray(parsedSuggestions) ? parsedSuggestions : 
                    (parsedSuggestions.suggestions || parsedSuggestions.questions || []);
      } catch (parseError) {
        console.error('Error parsing suggestions JSON:', parseError);
        suggestions = [
          "What foods are high in iron?",
          "How much water should I drink?",
          "What supplements do I need?"
        ];
      }
    } catch (error) { 
      console.error('Error generating suggestions:', error);
      suggestions = [
        "What foods are high in iron?",
        "How much water should I drink?",
        "What supplements do I need?"
      ];
    }
    
    const response: ApiResponse<{
      text: string; 
      suggestions: string[];
    }> = {
      success: true,
      data: {
        text: responseText,
        suggestions: Array.isArray(suggestions) ? suggestions : []
      },
    };
    return Response.json(response);
  } catch (error) {
    console.error('AI Chat API error:', error); 
    const response: ApiResponse = {
      success: false,
      error: 'Failed to generate chat response',
    };
    return Response.json(response, { status: 500 });
  }
}