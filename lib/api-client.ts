// API Client for Hilla Frontend
import { ApiResponse, User, Meal, DailyLog, TrackingSettings, AnalyticsData } from '@/types/api';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || '';

class ApiClient {
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: 'Network error',
      };
    }
  }

  // User endpoints
  async getUser(id: string): Promise<ApiResponse<User>> {
    return this.request<User>(`/api/users?id=${id}`);
  }

  async getUserByEmail(email: string): Promise<ApiResponse<User>> {
    return this.request<User>(`/api/users?email=${email}`);
  }

  async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<User>> {
    return this.request<User>('/api/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(id: string, updates: Partial<User>): Promise<ApiResponse<User>> {
    return this.request<User>('/api/users', {
      method: 'PUT',
      body: JSON.stringify({ id, ...updates }),
    });
  }

  async deleteUser(id: string): Promise<ApiResponse> {
    return this.request(`/api/users?id=${id}`, {
      method: 'DELETE',
    });
  }

  // Meal endpoints
  async getMeal(id: string): Promise<ApiResponse<Meal>> {
    return this.request<Meal>(`/api/meals?id=${id}`);
  }

  async getUserMeals(userId: string, limit?: number): Promise<ApiResponse<Meal[]>> {
    const params = new URLSearchParams({ userId });
    if (limit) params.append('limit', limit.toString());
    return this.request<Meal[]>(`/api/meals?${params}`);
  }

  async getMealsByDate(userId: string, date: string): Promise<ApiResponse<Meal[]>> {
    return this.request<Meal[]>(`/api/meals?userId=${userId}&date=${date}`);
  }

  async createMeal(mealData: Omit<Meal, 'id' | 'createdAt'>): Promise<ApiResponse<Meal>> {
    return this.request<Meal>('/api/meals', {
      method: 'POST',
      body: JSON.stringify(mealData),
    });
  }

  async updateMeal(id: string, updates: Partial<Meal>): Promise<ApiResponse<Meal>> {
    return this.request<Meal>('/api/meals', {
      method: 'PUT',
      body: JSON.stringify({ id, ...updates }),
    });
  }

  async deleteMeal(id: string): Promise<ApiResponse> {
    return this.request(`/api/meals?id=${id}`, {
      method: 'DELETE',
    });
  }

  // Daily log endpoints
  async getDailyLog(userId: string, date: string): Promise<ApiResponse<DailyLog>> {
    return this.request<DailyLog>(`/api/daily-logs?userId=${userId}&date=${date}`);
  }

  async getUserDailyLogs(userId: string, limit?: number): Promise<ApiResponse<DailyLog[]>> {
    const params = new URLSearchParams({ userId });
    if (limit) params.append('limit', limit.toString());
    return this.request<DailyLog[]>(`/api/daily-logs?${params}`);
  }

  async createDailyLog(logData: Omit<DailyLog, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<DailyLog>> {
    return this.request<DailyLog>('/api/daily-logs', {
      method: 'POST',
      body: JSON.stringify(logData),
    });
  }

  async updateDailyLog(userId: string, date: string, updates: Partial<DailyLog>): Promise<ApiResponse<DailyLog>> {
    return this.request<DailyLog>('/api/daily-logs', {
      method: 'PUT',
      body: JSON.stringify({ userId, date, ...updates }),
    });
  }

  async deleteDailyLog(userId: string, date: string): Promise<ApiResponse> {
    return this.request(`/api/daily-logs?userId=${userId}&date=${date}`, {
      method: 'DELETE',
    });
  }

  // Tracking settings endpoints
  async getTrackingSettings(userId: string): Promise<ApiResponse<TrackingSettings>> {
    return this.request<TrackingSettings>(`/api/tracking-settings?userId=${userId}`);
  }

  async createTrackingSettings(settingsData: Omit<TrackingSettings, 'updatedAt'>): Promise<ApiResponse<TrackingSettings>> {
    return this.request<TrackingSettings>('/api/tracking-settings', {
      method: 'POST',
      body: JSON.stringify(settingsData),
    });
  }

  async updateTrackingSettings(userId: string, selectedMetrics: string[]): Promise<ApiResponse<TrackingSettings>> {
    return this.request<TrackingSettings>('/api/tracking-settings', {
      method: 'PUT',
      body: JSON.stringify({ userId, selectedMetrics }),
    });
  }

  async deleteTrackingSettings(userId: string): Promise<ApiResponse> {
    return this.request(`/api/tracking-settings?userId=${userId}`, {
      method: 'DELETE',
    });
  }

  // Analytics endpoints
  async getAnalytics(
    userId: string, 
    period: '7d' | '30d' | '3m' = '30d', 
    nutrient: string = 'iron'
  ): Promise<ApiResponse<AnalyticsData>> {
    return this.request<AnalyticsData>(`/api/analytics?userId=${userId}&period=${period}&nutrient=${nutrient}`);
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<{ status: string; timestamp: string; version: string }>> {
    return this.request('/api/health');
  }

  // AI endpoints
  async getNutritionAdvice(userId: string, prompt: string): Promise<ApiResponse<{ advice: string }>> {
    return this.request<{ advice: string }>('/api/ai/nutrition-advice', {
      method: 'POST',
      body: JSON.stringify({ userId, prompt }),
    });
  }

  async analyzeMeal(userId: string, mealDescription: string): Promise<ApiResponse<{
    nutrients: Record<string, number>;
    calories: number;
    analysis: string;
  }>> {
    return this.request<{
      nutrients: Record<string, number>;
      calories: number;
      analysis: string;
    }>('/api/ai/meal-analysis', {
      method: 'POST',
      body: JSON.stringify({ userId, mealDescription }),
    });
  }

  async getMealSuggestions(userId: string): Promise<ApiResponse<Array<{
    name: string;
    description: string;
    nutrients: Record<string, number>;
    calories: number;
    prepTime: string;
    ingredients: string[];
  }>>> {
    return this.request<Array<{
      name: string;
      description: string;
      nutrients: Record<string, number>;
      calories: number;
      prepTime: string;
      ingredients: string[];
    }>>(`/api/ai/meal-suggestions?userId=${userId}`);
  }

  async sendChatMessage(
    userId: string, 
    message: string, 
    previousMessages?: Array<{ text: string; isUser: boolean }>
  ): Promise<ApiResponse<{
    text: string;
    suggestions: string[];
  }>> {
    return this.request<{
      text: string;
      suggestions: string[];
    }>('/api/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ userId, message, previousMessages }),
    });
  }
}

export const apiClient = new ApiClient();