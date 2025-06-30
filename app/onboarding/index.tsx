import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useOnboardingState } from '@/hooks/useOnboardingState';

export default function OnboardingIndex() {
  const router = useRouter();
  const { state, isLoaded } = useOnboardingState();

  useEffect(() => {
    if (isLoaded) {
      if (state.isCompleted) {
        router.replace('/(tabs)');
      } else {
        router.replace('/onboarding/1');
      }
    }
  }, [isLoaded, state.isCompleted, router]);

  return null;
}