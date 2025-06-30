// Custom hook for Supabase data operations
import { useState, useEffect } from 'react';
import { supabaseClient } from '@/lib/supabase-client';
import { User, Meal, DailyLog, TrackingSettings } from '@/types/api';

export function useUser(userId: string | null) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchUser = async () => {
      setLoading(true);
      setError(null);
      
      const response = await supabaseClient.getUser(userId);
      
      if (response.success) {
        setUser(response.data!);
      } else {
        setError(response.error || 'Failed to fetch user');
      }
      
      setLoading(false);
    };

    fetchUser();
  }, [userId]);

  return { user, loading, error };
}

export function useUserMeals(userId: string | null, limit?: number) {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchMeals = async () => {
      setLoading(true);
      setError(null);
      
      const response = await supabaseClient.getUserMeals(userId, limit);
      
      if (response.success) {
        setMeals(response.data!);
      } else {
        setError(response.error || 'Failed to fetch meals');
      }
      
      setLoading(false);
    };

    fetchMeals();
  }, [userId, limit]);

  const addMeal = async (mealData: Omit<Meal, 'id' | 'createdAt'>) => {
    const response = await supabaseClient.createMeal(mealData);
    
    if (response.success) {
      setMeals(prev => [response.data!, ...prev]);
      return response;
    }
    
    setError(response.error || 'Failed to add meal');
    return response;
  };

  return { meals, loading, error, addMeal };
}

export function useDailyLog(userId: string | null, date: string) {
  const [dailyLog, setDailyLog] = useState<DailyLog | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId || !date) return;

    const fetchDailyLog = async () => {
      setLoading(true);
      setError(null);
      
      const response = await supabaseClient.getDailyLog(userId, date);
      
      if (response.success) {
        setDailyLog(response.data!);
      } else {
        setError(response.error || 'Failed to fetch daily log');
      }
      
      setLoading(false);
    };

    fetchDailyLog();
  }, [userId, date]);

  return { dailyLog, loading, error };
}

export function useTrackingSettings(userId: string | null) {
  const [settings, setSettings] = useState<TrackingSettings | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchSettings = async () => {
      setLoading(true);
      setError(null);
      
      const response = await supabaseClient.getTrackingSettings(userId);
      
      if (response.success) {
        setSettings(response.data!);
      } else {
        setError(response.error || 'Failed to fetch tracking settings');
      }
      
      setLoading(false);
    };

    fetchSettings();
  }, [userId]);

  const updateSettings = async (selectedMetrics: string[]) => {
    if (!userId) return;

    const response = await supabaseClient.updateTrackingSettings(userId, selectedMetrics);
    
    if (response.success) {
      setSettings(response.data!);
      return response;
    }
    
    setError(response.error || 'Failed to update settings');
    return response;
  };

  return { settings, loading, error, updateSettings };
}