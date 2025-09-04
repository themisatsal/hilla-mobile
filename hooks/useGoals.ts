// Custom hook for managing user goals
import { useState, useEffect, useCallback } from 'react';
import { supabaseClient } from '@/lib/supabase-client';
import { Goal } from '@/types/api';

export function useGoals(userId: string | null) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch goals
  const fetchGoals = useCallback(async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await supabaseClient.getUserGoals(userId);
      
      if (response.success) {
        setGoals(response.data || []);
      } else {
        setError(response.error || 'Failed to fetch goals');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Error fetching goals:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Load goals on mount and when userId changes
  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  // Add a new goal
  const addGoal = useCallback(async (goalData: Omit<Goal, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!userId) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await supabaseClient.createGoal({
        ...goalData,
        userId,
      });
      
      if (response.success && response.data) {
        setGoals(prev => [response.data!, ...prev]);
        return response.data;
      } else {
        setError(response.error || 'Failed to add goal');
        return null;
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Error adding goal:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Update an existing goal
  const updateGoal = useCallback(async (id: string, updates: Partial<Goal>) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await supabaseClient.updateGoal(id, updates);
      
      if (response.success && response.data) {
        setGoals(prev => prev.map(goal => 
          goal.id === id ? response.data! : goal
        ));
        return response.data;
      } else {
        setError(response.error || 'Failed to update goal');
        return null;
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Error updating goal:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete a goal
  const deleteGoal = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await supabaseClient.deleteGoal(id);
      
      if (response.success) {
        setGoals(prev => prev.filter(goal => goal.id !== id));
        return true;
      } else {
        setError(response.error || 'Failed to delete goal');
        return false;
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Error deleting goal:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update goal progress
  const updateGoalProgress = useCallback(async (id: string, currentValue: number) => {
    const goal = goals.find(g => g.id === id);
    if (!goal) return null;
    
    const isCompleted = currentValue >= goal.targetValue;
    
    return updateGoal(id, { 
      currentValue, 
      isCompleted: isCompleted 
    });
  }, [goals, updateGoal]);

  return {
    goals,
    loading,
    error,
    fetchGoals,
    addGoal,
    updateGoal,
    deleteGoal,
    updateGoalProgress
  };
}