import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useState, useEffect, useCallback } from 'react';
import { useOnboardingState } from '@/hooks/useOnboardingState';

// Import step components
import WelcomeStep from '@/components/onboarding/WelcomeStep';
import NameInputStep from '@/components/onboarding/NameInputStep';
import LifeStageStep from '@/components/onboarding/LifeStageStep';
import GoalsStep from '@/components/onboarding/GoalsStep';
import DietaryPreferencesStep from '@/components/onboarding/DietaryPreferencesStep';
import EnergyBoostersStep from '@/components/onboarding/EnergyBoostersStep';
import EnergyDrainersStep from '@/components/onboarding/EnergyDrainersStep';
import BaselineQuizStep from '@/components/onboarding/BaselineQuizStep';
import PermissionsStep from '@/components/onboarding/PermissionsStep';
import WearablesStep from '@/components/onboarding/WearablesStep';
import PaywallStep from '@/components/onboarding/PaywallStep';
import PrivacyDisclaimerStep from '@/components/onboarding/PrivacyDisclaimerStep';
import AllSetStep from '@/components/onboarding/AllSetStep';

const { height: screenHeight } = Dimensions.get('window');

export default function OnboardingStep() {
  const { step, stage } = useLocalSearchParams();
  const router = useRouter();
  const { 
    state, 
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
    reloadState
  } = useOnboardingState();

  const [name, setName] = useState('');
  const [selectedStage, setSelectedStage] = useState('');
  const [selectedGoal, setSelectedGoal] = useState('');
  const [dietaryPreferences, setDietaryPreferences] = useState<string[]>([]);
  const [energyBoosters, setEnergyBoosters] = useState<string[]>([]);
  const [energyDrainers, setEnergyDrainers] = useState<string[]>([]);
  const [baselineAnswers, setBaselineAnswers] = useState<Record<string, any>>({});
  const [permissions, setPermissions] = useState({
    pushReminders: false,
    healthData: false,
  });
  const [wearables, setWearables] = useState({
    oura: false,
    whoop: false,
    fitbit: false,
  });

  const currentStep = parseInt(step as string) || 1;

  // Reload state when screen comes into focus (when navigating back)
  useFocusEffect(
    useCallback(() => {
      console.log('Screen focused, reloading state for step:', currentStep);
      reloadState();
    }, [currentStep, reloadState])
  );

  // Sync local state with persisted state whenever persisted state changes
  useEffect(() => {
    console.log('Syncing local state with persisted state:', state);
    
    // Only update if values have actually changed
    if (name !== (state.name || '')) {
      setName(state.name || '');
    }
    
    if (selectedStage !== (state.selectedStage || '')) {
      setSelectedStage(state.selectedStage || '');
    }
    
    if (selectedGoal !== (state.selectedGoal || '')) {
      setSelectedGoal(state.selectedGoal || '');
    }
    
    // For arrays, use deep comparison to prevent unnecessary updates
    if (JSON.stringify(dietaryPreferences) !== JSON.stringify(state.dietaryPreferences || [])) {
      setDietaryPreferences([...(state.dietaryPreferences || [])]);
    }
    
    if (JSON.stringify(energyBoosters) !== JSON.stringify(state.energyBoosters || [])) {
      setEnergyBoosters([...(state.energyBoosters || [])]);
    }
    
    if (JSON.stringify(energyDrainers) !== JSON.stringify(state.energyDrainers || [])) {
      setEnergyDrainers([...(state.energyDrainers || [])]);
    }
    
    // For objects, use deep comparison to prevent unnecessary updates
    if (JSON.stringify(baselineAnswers) !== JSON.stringify(state.baselineAnswers || {})) {
      setBaselineAnswers({...(state.baselineAnswers || {})});
    }
    
    if (JSON.stringify(permissions) !== JSON.stringify(state.permissions || { pushReminders: false, healthData: false })) {
      setPermissions({...(state.permissions || { pushReminders: false, healthData: false })});
    }
    
    if (JSON.stringify(wearables) !== JSON.stringify(state.wearables || { oura: false, whoop: false, fitbit: false })) {
      setWearables({...(state.wearables || { oura: false, whoop: false, fitbit: false })});
    }
  }, [state]); // Only depend on state, not local variables

  // Set the selected stage from URL params when on step 4
  useEffect(() => {
    if (currentStep === 4 && stage && typeof stage === 'string') {
      setSelectedStage(stage);
    }
  }, [currentStep, stage]);

  // Save current step data immediately when values change
  useEffect(() => {
    if (currentStep === 2 && name.trim() && name !== state.name) {
      console.log('Auto-saving name:', name);
      updateName(name);
    }
  }, [name, currentStep, state.name, updateName]);

  useEffect(() => {
    if (currentStep === 3 && selectedStage && selectedStage !== state.selectedStage) {
      console.log('Auto-saving stage:', selectedStage);
      updateStage(selectedStage);
    }
  }, [selectedStage, currentStep, state.selectedStage, updateStage]);

  useEffect(() => {
    if (currentStep === 4 && selectedGoal && selectedGoal !== state.selectedGoal) {
      console.log('Auto-saving goal:', selectedGoal);
      updateGoal(selectedGoal);
    }
  }, [selectedGoal, currentStep, state.selectedGoal, updateGoal]);

  useEffect(() => {
    if (currentStep === 5 && dietaryPreferences.length > 0) {
      const currentSorted = [...dietaryPreferences].sort();
      const persistedSorted = [...(state.dietaryPreferences || [])].sort();
      if (JSON.stringify(currentSorted) !== JSON.stringify(persistedSorted)) {
        console.log('Auto-saving dietary preferences:', dietaryPreferences);
        updateDietaryPreferences(dietaryPreferences);
      }
    }
  }, [dietaryPreferences, currentStep, state.dietaryPreferences, updateDietaryPreferences]);

  useEffect(() => {
    if (currentStep === 6 && energyBoosters.length > 0) {
      const currentSorted = [...energyBoosters].sort();
      const persistedSorted = [...(state.energyBoosters || [])].sort();
      if (JSON.stringify(currentSorted) !== JSON.stringify(persistedSorted)) {
        console.log('Auto-saving energy boosters:', energyBoosters);
        updateEnergyBoosters(energyBoosters);
      }
    }
  }, [energyBoosters, currentStep, state.energyBoosters, updateEnergyBoosters]);

  useEffect(() => {
    if (currentStep === 7 && energyDrainers.length > 0) {
      const currentSorted = [...energyDrainers].sort();
      const persistedSorted = [...(state.energyDrainers || [])].sort();
      if (JSON.stringify(currentSorted) !== JSON.stringify(persistedSorted)) {
        console.log('Auto-saving energy drainers:', energyDrainers);
        updateEnergyDrainers(energyDrainers);
      }
    }
  }, [energyDrainers, currentStep, state.energyDrainers, updateEnergyDrainers]);

  useEffect(() => {
    if (currentStep === 8 && Object.keys(baselineAnswers).length > 0) {
      if (JSON.stringify(baselineAnswers) !== JSON.stringify(state.baselineAnswers || {})) {
        console.log('Auto-saving baseline answers:', baselineAnswers);
        updateBaselineAnswers(baselineAnswers);
      }
    }
  }, [baselineAnswers, currentStep, state.baselineAnswers, updateBaselineAnswers]);

  useEffect(() => {
    if (currentStep === 9) {
      if (JSON.stringify(permissions) !== JSON.stringify(state.permissions || { pushReminders: false, healthData: false })) {
        console.log('Auto-saving permissions:', permissions);
        updatePermissions(permissions);
      }
    }
  }, [permissions, currentStep, state.permissions, updatePermissions]);

  useEffect(() => {
    if (currentStep === 10) {
      if (JSON.stringify(wearables) !== JSON.stringify(state.wearables || { oura: false, whoop: false, fitbit: false })) {
        console.log('Auto-saving wearables:', wearables);
        updateWearables(wearables);
      }
    }
  }, [wearables, currentStep, state.wearables, updateWearables]);

  const handleNext = () => {
    console.log('Handling next from step:', currentStep);

    // Navigate to next step
    if (currentStep < 13) {
      if (currentStep === 3 && selectedStage) {
        router.push(`/onboarding/4?stage=${selectedStage}`);
      } else {
        router.push(`/onboarding/${currentStep + 1}`);
      }
    } else {
      completeOnboarding();
      router.replace('/(tabs)');
    }
  };

  const handleSkipPaywall = () => {
    console.log('Skipping paywall');
    router.push('/onboarding/12'); // Navigate to privacy step instead of completing
  };

  const handleStartTrial = () => {
    console.log('Starting free trial');
    router.push('/onboarding/12'); // Navigate to privacy step instead of completing
  };

  const handleSelectPlan = (planType: string) => {
    console.log('Selected plan:', planType);
    router.push('/onboarding/12'); // Navigate to privacy step instead of completing
  };

  const handlePaywallContinue = () => {
    console.log('Continuing from paywall to privacy step');
    router.push('/onboarding/12');
  };

  const handlePrivacyComplete = () => {
    console.log('Privacy and disclaimer completed');
    router.push('/onboarding/13'); // Navigate to final step
  };

  const handlePrivacyBack = () => {
    console.log('Going back from privacy step to paywall');
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/onboarding/11');
    }
  };

  const handleEnterHilla = () => {
    console.log('Entering Hilla - completing onboarding');
    completeOnboarding();
    router.replace('/(tabs)');
  };

  const handleAllSetBack = () => {
    console.log('Going back from All Set step to privacy step');
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/onboarding/12');
    }
  };

  const handleSkip = () => {
    console.log('Skipping step 10 (wearables)');
    router.push('/onboarding/11');
  };

  const handleBack = () => {
    if (currentStep > 1) {
      console.log('Handling back from step:', currentStep);
      if (router.canGoBack()) {
        router.back();
      } else {
        // If there's no navigation history, navigate to the previous step directly
        router.replace(`/onboarding/${currentStep - 1}`);
      }
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1: 
        return <WelcomeStep />;
      case 2: 
        return (
          <NameInputStep 
            name={name} 
            onNameChange={setName} 
          />
        );
      case 3: 
        return (
          <LifeStageStep 
            selectedStage={selectedStage} 
            onStageSelect={setSelectedStage} 
          />
        );
      case 4: 
        return (
          <GoalsStep 
            selectedStage={selectedStage} 
            selectedGoal={selectedGoal} 
            onGoalSelect={setSelectedGoal} 
          />
        );
      case 5: 
        return (
          <DietaryPreferencesStep 
            dietaryPreferences={dietaryPreferences} 
            onPreferencesChange={setDietaryPreferences} 
          />
        );
      case 6: 
        return (
          <EnergyBoostersStep 
            energyBoosters={energyBoosters} 
            onBoostersChange={setEnergyBoosters} 
          />
        );
      case 7: 
        return (
          <EnergyDrainersStep 
            energyDrainers={energyDrainers} 
            onDrainersChange={setEnergyDrainers} 
          />
        );
      case 8: 
        return (
          <BaselineQuizStep 
            selectedStage={selectedStage} 
            selectedGoal={selectedGoal} 
            baselineAnswers={baselineAnswers} 
            onAnswersChange={setBaselineAnswers} 
          />
        );
      case 9:
        return (
          <PermissionsStep
            permissions={permissions}
            onPermissionsChange={setPermissions}
          />
        );
      case 10:
        return (
          <WearablesStep
            wearables={wearables}
            onWearablesChange={setWearables}
            onSkip={handleSkip}
          />
        );
      case 11:
        return (
          <PaywallStep
            onSelectPlan={handleSelectPlan}
            onStartTrial={handleStartTrial}
            onSkip={handleSkipPaywall}
            onContinue={handlePaywallContinue}
          />
        );
      case 12:
        return (
          <PrivacyDisclaimerStep
            onComplete={handlePrivacyComplete}
            onBack={handlePrivacyBack}
          />
        );
      case 13:
        return (
          <AllSetStep
            selectedStage={selectedStage}
            onEnterHilla={handleEnterHilla}
            onBack={handleAllSetBack}
          />
        );
      default: 
        return <WelcomeStep />;
    }
  };

  const canProceed = () => {
    console.log(`Step ${currentStep} - Checking canProceed:`, {
      selectedGoal,
      selectedStage,
      name: name.trim(),
      dietaryPreferences: dietaryPreferences.length,
      energyBoosters: energyBoosters.length,
      energyDrainers: energyDrainers.length
    });

    switch (currentStep) {
      case 1:
        return true; // Welcome step - always can proceed
      case 2:
        return name.trim().length > 0; // Name input - require non-empty name
      case 3:
        return selectedStage !== ''; // Life stage - require stage selection
      case 4:
        const goalSelected = selectedGoal !== '' && selectedGoal.length > 0;
        console.log(`Step 4 goal check: "${selectedGoal}" -> ${goalSelected}`);
        return goalSelected; // Goals - require goal selection
      case 5:
        return dietaryPreferences.length > 0; // Dietary preferences - require at least one selection
      case 6:
        return energyBoosters.length > 0; // Energy boosters - require at least one selection
      case 7:
        return energyDrainers.length > 0; // Energy drainers - require at least one selection
      case 8:
        // Baseline quiz - check if all required questions are answered
        const getBaselineQuestions = () => {
          const stage = selectedStage;
          const goal = selectedGoal;
          
          // TTC Questions
          if (stage === 'ttc') {
            if (goal === 'Support Conception 🧬') {
              return [
                { id: 'folate_meals', optional: false },
                { id: 'caffeine_cups', optional: false },
                { id: 'sleep_hours', optional: false },
                { id: 'track_ovulation', optional: false },
                { id: 'fertility_conditions', optional: true }
              ];
            }
            if (goal === 'Boost Fertility 🌱') {
              return [
                { id: 'leafy_greens', optional: false },
                { id: 'caffeine_cups', optional: false },
                { id: 'sleep_quality', optional: false },
                { id: 'track_cycle', optional: false },
                { id: 'fertility_conditions', optional: true }
              ];
            }
            if (goal === 'Increase Folate 🥗') {
              return [
                { id: 'folate_supplement', optional: false },
                { id: 'legume_meals', optional: false },
                { id: 'whole_grains', optional: false },
                { id: 'alcohol_week', optional: false },
                { id: 'prenatal_protocol', optional: true }
              ];
            }
            if (goal === 'Balance Blood Sugar 🍏') {
              return [
                { id: 'sugary_drinks', optional: false },
                { id: 'breakfast_time', optional: false },
                { id: 'steps_walked', optional: false },
                { id: 'evening_carbs', optional: false },
                { id: 'sleep_hours', optional: false }
              ];
            }
          }

          // T1 Questions
          if (stage === 't1') {
            if (goal === 'Ease Morning Sickness 🤢') {
              return [
                { id: 'nausea_severity', optional: false },
                { id: 'morning_snack', optional: false },
                { id: 'hours_since_meal', optional: false },
                { id: 'water_glasses', optional: false },
                { id: 'pregnancy_complications', optional: true }
              ];
            }
            if (goal === 'Build Baby\'s Brain 🧠') {
              return [
                { id: 'omega3_sources', optional: false },
                { id: 'dha_supplement', optional: false },
                { id: 'choline_foods', optional: false },
                { id: 'memory_mood', optional: true }
              ];
            }
            if (goal === 'Maintain Energy ⚡') {
              return [
                { id: 'sleep_hours', optional: false },
                { id: 'snacks_yesterday', optional: false },
                { id: 'caffeine_today', optional: false },
                { id: 'water_intake', optional: false },
                { id: 'movement_24h', optional: false }
              ];
            }
          }

          // T2 Questions
          if (stage === 't2') {
            if (goal === 'Build Baby\'s Bones 🦴') {
              return [
                { id: 'calcium_servings', optional: false },
                { id: 'iron_servings', optional: false },
                { id: 'daily_steps', optional: false },
                { id: 'constipation', optional: false }
              ];
            }
            if (goal === 'Prevent Constipation 🍑') {
              return [
                { id: 'fiber_servings', optional: false },
                { id: 'water_intake', optional: false },
                { id: 'magnesium_foods', optional: false },
                { id: 'physical_activity', optional: false },
                { id: 'digestion_supplements', optional: true }
              ];
            }
            if (goal === 'Sustain Energy ⚡') {
              return [
                { id: 'sleep_hours', optional: false },
                { id: 'sugar_intake', optional: false },
                { id: 'protein_meals', optional: false },
                { id: 'morning_fatigue', optional: false }
              ];
            }
          }

          // T3 Questions
          if (stage === 't3') {
            if (goal === 'Prepare for Birth ❤️') {
              return [
                { id: 'iron_servings', optional: false },
                { id: 'daily_steps', optional: false },
                { id: 'heartburn_severity', optional: false },
                { id: 'sleep_hours', optional: false }
              ];
            }
            if (goal === 'Support Growth 📈') {
              return [
                { id: 'protein_meals', optional: false },
                { id: 'weight_gain', optional: false },
                { id: 'fruit_veg_servings', optional: false },
                { id: 'appetite_level', optional: false }
              ];
            }
            if (goal === 'Manage Heartburn 🔥') {
              return [
                { id: 'heartburn_severity', optional: false },
                { id: 'greasy_acidic_meals', optional: false },
                { id: 'late_meals', optional: false },
                { id: 'pillow_elevation', optional: false }
              ];
            }
          }

          // Postpartum Questions
          if (stage === 'postpartum') {
            if (goal === 'Recover Postpartum 💪') {
              return [
                { id: 'protein_servings', optional: false },
                { id: 'sleep_hours', optional: false },
                { id: 'energy_level', optional: false },
                { id: 'breastfeeding', optional: false },
                { id: 'water_glasses', optional: false }
              ];
            }
            if (goal === 'Support Lactation 🍼') {
              return [
                { id: 'breastfeeding_frequency', optional: false },
                { id: 'protein_meals', optional: false },
                { id: 'water_intake', optional: false },
                { id: 'stress_level', optional: false }
              ];
            }
            if (goal === 'Boost Energy ⚡') {
              return [
                { id: 'nap_periods', optional: false },
                { id: 'caffeine_today', optional: false },
                { id: 'protein_breakfast', optional: false },
                { id: 'emotion_checkin', optional: false }
              ];
            }
            if (goal === 'Rebuild Iron 🩸') {
              return [
                { id: 'iron_supplement', optional: false },
                { id: 'red_meat_legumes', optional: false },
                { id: 'fatigue_level', optional: false },
                { id: 'heavy_bleeding', optional: false }
              ];
            }
          }

          return [];
        };

        const questions = getBaselineQuestions();
        const requiredQuestions = questions.filter(q => !q.optional);
        return requiredQuestions.every(q => baselineAnswers[q.id] !== undefined);
      case 9:
        return true; // Permissions step is always optional
      case 10:
        return true; // Wearables step is always optional
      case 11:
        return true; // Paywall step - always allow continue
      case 12:
        return false; // Privacy step - handled by its own component
      case 13:
        return false; // All Set step - handled by its own component
      default:
        return false; // Default to false for safety
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {currentStep > 1 && currentStep < 12 ? (
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <ChevronLeft size={24} color="#6B7280" />
          </TouchableOpacity>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${(currentStep / 13) * 100}%` }]} />
            </View>
            <Text style={styles.progressText}>{currentStep} of 13</Text>
          </View>
          <View style={styles.placeholder} />
        </View>
      ) : null}

      {currentStep >= 3 && currentStep !== 12 && currentStep !== 13 ? (
        <ScrollView 
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {renderStep()}
        </ScrollView>
      ) : (
        <View style={styles.content}>
          {renderStep()}
        </View>
      )}

      {/* Navigation - only show for steps 1-11, steps 12 and 13 handle their own navigation */}
      {currentStep < 12 && (
        <View style={styles.navigation}>
          {currentStep === 1 ? (
            <TouchableOpacity style={styles.getStartedButton} onPress={handleNext}>
              <Text style={styles.getStartedText}>Get Started</Text>
              <ChevronRight size={20} color="#FFFFFF" />
            </TouchableOpacity>
          ) : currentStep === 10 ? (
            <View style={styles.finalStepButtons}>
              <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
                <Text style={styles.skipButtonText}>Skip for now</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.completeButton} onPress={handleNext}>
                <Text style={styles.completeButtonText}>Continue</Text>
                <ArrowRight size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          ) : currentStep === 11 ? (
            <View style={styles.finalStepButtons}>
              <TouchableOpacity style={styles.skipButton} onPress={handleNext}>
                <Text style={styles.skipButtonText}>Continue without subscription</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.completeButton} onPress={handleStartTrial}>
                <Text style={styles.completeButtonText}>Continue with free trial</Text>
                <ArrowRight size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={[
                styles.nextButton,
                !canProceed() && styles.nextButtonDisabled,
              ]}
              onPress={handleNext}
              disabled={!canProceed()}
            >
              <Text style={styles.nextButtonText}>
                {currentStep === 9 ? 'Allow & Continue' : 'Continue'}
              </Text>
              <ArrowRight size={20} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFBFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  progressContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#B8A9FF',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  scrollContent: {
    paddingBottom: 40,
    minHeight: screenHeight * 0.6,
  },
  navigation: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 16,
  },
  getStartedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#B8A9FF',
    borderRadius: 16,
    padding: 18,
    gap: 8,
    shadowColor: '#B8A9FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  getStartedText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#B8A9FF',
    borderRadius: 16,
    padding: 18,
    gap: 8,
  },
  nextButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  nextButtonText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  finalStepButtons: {
    gap: 12,
  },
  skipButton: {
    alignSelf: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  skipButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#B8A9FF',
    borderRadius: 16,
    padding: 18,
    gap: 8,
  },
  completeButtonText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
});