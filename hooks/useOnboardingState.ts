import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface OnboardingState {
  name: string;
  selectedStage: string;
  selectedGoal: string;
  dietaryPreferences: string[];
  energyBoosters: string[];
  energyDrainers: string[];
  baselineAnswers: Record<string, any>;
  permissions: {
    pushReminders: boolean;
    healthData: boolean;
  };
  wearables: {
    oura: boolean;
    whoop: boolean;
    fitbit: boolean;
  };
  isCompleted: boolean;
}

const ONBOARDING_KEY = '@hilla_onboarding_state';

const defaultState: OnboardingState = {
  name: '',
  selectedStage: '',
  selectedGoal: '',
  dietaryPreferences: [],
  energyBoosters: [],
  energyDrainers: [],
  baselineAnswers: {},
  permissions: {
    pushReminders: false,
    healthData: false,
  },
  wearables: {
    oura: false,
    whoop: false,
    fitbit: false,
  },
  isCompleted: false,
};

// Deep comparison function to check if two states are equal
function deepEqual(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) return true;
  
  if (obj1 == null || obj2 == null) return obj1 === obj2;
  
  if (typeof obj1 !== typeof obj2) return false;
  
  if (typeof obj1 !== 'object') return obj1 === obj2;
  
  if (Array.isArray(obj1) !== Array.isArray(obj2)) return false;
  
  if (Array.isArray(obj1)) {
    if (obj1.length !== obj2.length) return false;
    for (let i = 0; i < obj1.length; i++) {
      if (!deepEqual(obj1[i], obj2[i])) return false;
    }
    return true;
  }
  
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  
  if (keys1.length !== keys2.length) return false;
  
  for (const key of keys1) {
    if (!keys2.includes(key)) return false;
    if (!deepEqual(obj1[key], obj2[key])) return false;
  }
  
  return true;
}

export function useOnboardingState() {
  const [state, setState] = useState<OnboardingState>(defaultState);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load state from storage on mount
  useEffect(() => {
    loadState();
  }, []);

  // Save state to storage whenever state changes (but not on initial load)
  useEffect(() => {
    if (isLoaded) {
      saveToStorage(state);
    }
  }, [state, isLoaded]);

  const loadState = async () => {
    try {
      const stored = await AsyncStorage.getItem(ONBOARDING_KEY);
      if (stored) {
        const parsedState = JSON.parse(stored);
        console.log('Loaded state from storage:', parsedState);
        
        // Only update state if the loaded state is different from current state
        setState(currentState => {
          if (deepEqual(currentState, parsedState)) {
            return currentState; // No change needed
          }
          return parsedState;
        });
      }
    } catch (error) {
      console.error('Error loading onboarding state:', error);
    } finally {
      setIsLoaded(true);
    }
  };

  // Save function that doesn't trigger re-renders
  const saveToStorage = useCallback(async (stateToSave: OnboardingState) => {
    try {
      console.log('Saving state to storage:', stateToSave);
      await AsyncStorage.setItem(ONBOARDING_KEY, JSON.stringify(stateToSave));
    } catch (error) {
      console.error('Error saving onboarding state:', error);
    }
  }, []);

  const updateName = useCallback((name: string) => {
    setState(prevState => {
      if (prevState.name === name) return prevState;
      console.log('Updating name:', name);
      return { ...prevState, name };
    });
  }, []);

  const updateStage = useCallback((selectedStage: string) => {
    setState(prevState => {
      if (prevState.selectedStage === selectedStage) return prevState;
      console.log('Updating stage:', selectedStage);
      return { ...prevState, selectedStage };
    });
  }, []);

  const updateGoal = useCallback((selectedGoal: string) => {
    setState(prevState => {
      if (prevState.selectedGoal === selectedGoal) return prevState;
      console.log('Updating goal:', selectedGoal);
      return { ...prevState, selectedGoal };
    });
  }, []);

  const updateDietaryPreferences = useCallback((dietaryPreferences: string[]) => {
    setState(prevState => {
      if (JSON.stringify(prevState.dietaryPreferences) === JSON.stringify(dietaryPreferences)) return prevState;
      console.log('Updating dietary preferences:', dietaryPreferences);
      return { ...prevState, dietaryPreferences };
    });
  }, []);

  const updateEnergyBoosters = useCallback((energyBoosters: string[]) => {
    setState(prevState => {
      if (JSON.stringify(prevState.energyBoosters) === JSON.stringify(energyBoosters)) return prevState;
      console.log('Updating energy boosters:', energyBoosters);
      return { ...prevState, energyBoosters };
    });
  }, []);

  const updateEnergyDrainers = useCallback((energyDrainers: string[]) => {
    setState(prevState => {
      if (JSON.stringify(prevState.energyDrainers) === JSON.stringify(energyDrainers)) return prevState;
      console.log('Updating energy drainers:', energyDrainers);
      return { ...prevState, energyDrainers };
    });
  }, []);

  const updateBaselineAnswers = useCallback((baselineAnswers: Record<string, any>) => {
    setState(prevState => {
      if (JSON.stringify(prevState.baselineAnswers) === JSON.stringify(baselineAnswers)) return prevState;
      console.log('Updating baseline answers:', baselineAnswers);
      return { ...prevState, baselineAnswers };
    });
  }, []);

  const updatePermissions = useCallback((permissions: { pushReminders: boolean; healthData: boolean }) => {
    setState(prevState => {
      if (JSON.stringify(prevState.permissions) === JSON.stringify(permissions)) return prevState;
      console.log('Updating permissions:', permissions);
      return { ...prevState, permissions };
    });
  }, []);

  const updateWearables = useCallback((wearables: { oura: boolean; whoop: boolean; fitbit: boolean }) => {
    setState(prevState => {
      if (JSON.stringify(prevState.wearables) === JSON.stringify(wearables)) return prevState;
      console.log('Updating wearables:', wearables);
      return { ...prevState, wearables };
    });
  }, []);

  const completeOnboarding = useCallback(() => {
    setState(prevState => {
      if (prevState.isCompleted === true) return prevState;
      console.log('Completing onboarding');
      return { ...prevState, isCompleted: true };
    });
  }, []);

  const resetOnboarding = async () => {
    try {
      await AsyncStorage.removeItem(ONBOARDING_KEY);
      setState(defaultState);
    } catch (error) {
      console.error('Error resetting onboarding state:', error);
    }
  };

  // Force reload state from storage
  const reloadState = useCallback(async () => {
    console.log('Force reloading state from storage');
    await loadState();
  }, []);

  return {
    state,
    isLoaded,
    updateName,
    updateStage,
    updateGoal,
    updateDietaryPreferences,
    updateEnergyBoosters,
    updateEnergyDrainers,
    updateBaselineAnswers,
    updatePermissions,
    updateWearables,
    completeOnboarding,
    resetOnboarding,
    reloadState,
  };
}