// OpenAI client for Hilla using OpenRouter
import OpenAI from 'npm:openai';

// Initialize OpenAI client with OpenRouter configuration
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.EXPO_PUBLIC_OPENROUTER_API_KEY || "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",
  defaultHeaders: {
    "HTTP-Referer": "https://hilla-nutrition.app", // Site URL for rankings on openrouter.ai
    "X-Title": "Hilla Nutrition", // Site title for rankings on openrouter.ai
  },
});

// Default model to use
const DEFAULT_MODEL = "deepseek/deepseek-r1-0528:free";

// Function to generate nutrition advice
export async function generateNutritionAdvice(
  prompt: string, 
  userContext: {
    stage: string;
    goal: string;
    dietaryPreferences: string[];
  }
): Promise<string> {
  try {
    const systemPrompt = `You are Hilla, an expert AI nutrition assistant specializing in maternal health from conception through postpartum.
    
Current user context:
- Life stage: ${userContext.stage}
- Goal: ${userContext.goal}
- Dietary preferences: ${userContext.dietaryPreferences.join(', ') || 'None specified'}

Provide evidence-based, practical nutrition advice that is:
1. Scientifically accurate and up-to-date
2. Personalized to the user's current stage and goals
3. Respectful of their dietary preferences
4. Actionable with specific food suggestions
5. Concise and easy to understand

IMPORTANT: If asked about serious medical conditions, always advise consulting a healthcare provider.
Format your response in a conversational, supportive tone. Use emoji sparingly for emphasis.`;

    const completion = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    return completion.choices[0].message.content || "I'm sorry, I couldn't generate advice at this moment.";
  } catch (error) {
    console.error('Error generating nutrition advice:', error);
    return "I'm having trouble connecting to my knowledge base right now. Please try again in a moment.";
  }
}

// Function to analyze meal nutrients
export async function analyzeMeal(
  mealDescription: string,
  userContext: {
    stage: string;
    goal: string;
  }
): Promise<{
  nutrients: Record<string, number>;
  calories: number;
  analysis: string;
}> {
  try {
    const systemPrompt = `You are Hilla, an expert AI nutrition assistant specializing in maternal health.
    
Your task is to analyze a meal description and:
1. Estimate key nutrients relevant to ${userContext.stage} pregnancy/maternal health
2. Estimate calories
3. Provide a brief analysis of how this meal supports the user's goal: ${userContext.goal}

Return your response in this exact JSON format:
{
  "nutrients": {
    "iron": 0, // in mg
    "dha": 0, // in g
    "folate": 0, // in mcg
    "calcium": 0, // in mg
    "protein": 0, // in g
    "fiber": 0, // in g
    "vitamin_d": 0, // in IU
    "choline": 0, // in mg
    "zinc": 0, // in mg
    "magnesium": 0, // in mg
    "omega3": 0, // in g
    "vitamin_b6": 0 // in mg
  },
  "calories": 0,
  "analysis": "Brief 1-2 sentence analysis of the meal's nutritional value for the user's current stage and goal"
}

Use realistic estimates based on standard nutrition databases. Be precise but realistic.`;

    const completion = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: mealDescription }
      ],
      temperature: 0.3,
      response_format: { type: "json_object" },
      max_tokens: 800,
    });

    const responseContent = completion.choices[0].message.content || "{}";
    return JSON.parse(responseContent);
  } catch (error) {
    console.error('Error analyzing meal:', error);
    return {
      nutrients: {
        iron: 0,
        dha: 0,
        folate: 0,
        calcium: 0,
        protein: 0,
        fiber: 0
      },
      calories: 0,
      analysis: "I couldn't analyze this meal. Please try again with a more detailed description."
    };
  }
}

// Function to generate meal suggestions
export async function generateMealSuggestions(
  userContext: {
    stage: string;
    goal: string;
    dietaryPreferences: string[];
    nutrientNeeds: string[];
  }
): Promise<Array<{
  name: string;
  description: string;
  nutrients: Record<string, number>;
  calories: number;
  prepTime: string;
  ingredients: string[];
}>> {
  try {
    const systemPrompt = `You are Hilla, an expert AI nutrition assistant specializing in maternal health.
    
Generate 3 meal suggestions tailored to:
- Life stage: ${userContext.stage}
- Goal: ${userContext.goal}
- Dietary preferences: ${userContext.dietaryPreferences.join(', ') || 'None specified'}
- Nutrient needs: ${userContext.nutrientNeeds.join(', ')}

Return your response in this exact JSON format:
[
  {
    "name": "Meal name",
    "description": "Brief description",
    "nutrients": {
      "iron": 0, // in mg
      "dha": 0, // in g
      "folate": 0, // in mcg
      "calcium": 0, // in mg
      "protein": 0, // in g
      "fiber": 0 // in g
    },
    "calories": 0,
    "prepTime": "15 min",
    "ingredients": ["ingredient 1", "ingredient 2", "..."]
  },
  // 2 more meal suggestions
]

Ensure meals are:
1. Practical and easy to prepare
2. Nutritionally appropriate for the user's stage
3. Supportive of their specific goal
4. Compliant with dietary preferences
5. Rich in their needed nutrients`;

    const completion = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: "Please suggest meals based on my profile." }
      ],
      temperature: 0.7,
      response_format: { type: "json_object" },
      max_tokens: 1000,
    });

    const responseContent = completion.choices[0].message.content || "[]";
    return JSON.parse(responseContent);
  } catch (error) {
    console.error('Error generating meal suggestions:', error);
    return [];
  }
}

export default openai;