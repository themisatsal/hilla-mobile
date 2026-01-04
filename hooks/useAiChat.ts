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
        text: msg.text,
        isUser: msg.isUser
      }));

      // Call the API
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          message: text,
          previousMessages
        })
      });
      
      const data = await response.json();

      if (data.success && data.data) {
        // Add AI response to the chat
        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          text: data.data.text,
          isUser: false,
          timestamp: new Date(),
          suggestions: data.data.suggestions
        };
        
        setMessages(prev => [...prev, aiMessage]);
      } else {
        setError(data.error || 'Failed to get a response');
        
        // Add error message to the chat
        const errorMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          text: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
          isUser: false,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Network error. Please try again.');
      
      // Add error message to the chat
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [userId, messages]);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    initializeChat
  };
}