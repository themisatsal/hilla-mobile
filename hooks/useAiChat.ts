import { useState, useCallback } from 'react';

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  suggestions?: string[];
}

export function useAiChat(userId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize chat with a welcome message
  const initializeChat = useCallback(() => {
    const welcomeMessage: ChatMessage = {
      id: '1',
      text: "Hi! I'm Hilla, your AI nutrition companion. I'm here to help with any questions about nutrition during your pregnancy journey. What would you like to know?",
      isUser: false,
      timestamp: new Date(),
      suggestions: [
        "What foods are high in iron?",
        "How much water should I drink?",
        "Safe fish during pregnancy",
        "Morning sickness remedies"
      ]
    };
    
    setMessages([welcomeMessage]);
  }, []);

  // Send a message to the AI
  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    setIsLoading(true);
    setError(null);

    // Add user message to the chat
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: text.trim(),
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      // Get previous messages for context (limit to last 5 for token efficiency)
      const previousMessages = messages.slice(-5).map(msg => ({
        role: msg.isUser ? "user" : "assistant",
        content: msg.text
      }));

      // Call the OpenRouter API directly
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": "Bearer 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",
          "HTTP-Referer": "https://hilla-nutrition.app",
          "X-Title": "Hilla Nutrition",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": "deepseek/deepseek-r1-0528:free",
          "messages": [
            {
              "role": "system",
              "content": `You are Hilla, an expert AI nutrition assistant specializing in maternal health from conception through postpartum.
              
              Provide evidence-based, practical nutrition advice that is:
              1. Scientifically accurate and up-to-date
              2. Personalized to maternal health needs
              3. Actionable with specific food suggestions
              4. Concise and easy to understand
              
              IMPORTANT: If asked about serious medical conditions, always advise consulting a healthcare provider.
              Format your response in a conversational, supportive tone. Use emoji sparingly for emphasis.`
            },
            ...previousMessages,
            {
              "role": "user",
              "content": text
            }
          ]
        })
      });
      
      const data = await response.json();
      
      if (data.choices && data.choices.length > 0) {
        const aiResponse = data.choices[0].message.content;
        
        // Generate follow-up suggestions
        const suggestionsResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": "Bearer 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",
            "HTTP-Referer": "https://hilla-nutrition.app",
            "X-Title": "Hilla Nutrition",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            "model": "deepseek/deepseek-r1-0528:free",
            "messages": [
              {
                "role": "system",
                "content": "Generate 3-4 follow-up questions based on the conversation. Return ONLY a JSON array of strings."
              },
              ...previousMessages.map(msg => ({
                "role": msg.role,
                "content": msg.content
              })),
              {
                "role": "user",
                "content": text
              },
              {
                "role": "assistant",
                "content": aiResponse
              },
              {
                "role": "user",
                "content": "Based on this conversation, what are 3-4 follow-up questions the user might want to ask? Return ONLY a JSON array of strings."
              }
            ],
            "response_format": { "type": "json_object" }
          })
        });
        
        const suggestionsData = await suggestionsResponse.json();
        let suggestions: string[] = [];
        
        if (suggestionsData.choices && suggestionsData.choices.length > 0) {
          try {
            const suggestionsContent = suggestionsData.choices[0].message.content;
            const parsedSuggestions = JSON.parse(suggestionsContent);
            suggestions = Array.isArray(parsedSuggestions) ? parsedSuggestions : 
                        (parsedSuggestions.suggestions || parsedSuggestions.questions || []);
          } catch (error) {
            console.error('Error parsing suggestions:', error);
            suggestions = [
              "What foods are high in iron?",
              "How much water should I drink?",
              "What supplements do I need?"
            ];
          }
        }
        
        // Add AI response to the chat
        const aiMessage: ChatMessage = {
          id: Date.now().toString() + '-ai',
          text: aiResponse,
          isUser: false,
          timestamp: new Date(),
          suggestions: suggestions
        };
        
        setMessages(prev => [...prev, aiMessage]);
      } else {
        throw new Error('No response from AI service');
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Network error. Please try again.');
      
      // Add error message to the chat
      const errorMessage: ChatMessage = {
        id: Date.now().toString() + '-error',
        text: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    initializeChat
  };
}