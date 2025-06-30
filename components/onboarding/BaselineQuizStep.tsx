import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Activity } from 'lucide-react-native';

interface BaselineQuizStepProps {
  selectedStage: string;
  selectedGoal: string;
  baselineAnswers: Record<string, any>;
  onAnswersChange: (answers: Record<string, any>) => void;
}

export default function BaselineQuizStep({ 
  selectedStage, 
  selectedGoal, 
  baselineAnswers, 
  onAnswersChange 
}: BaselineQuizStepProps) {
  const getBaselineQuestions = () => {
    const stage = selectedStage;
    const goal = selectedGoal;
    
    // TTC Questions
    if (stage === 'ttc') {
      if (goal === 'Support Conception 🧬') {
        return [
          { id: 'folate_meals', type: 'slider', question: 'Folate-rich meals yesterday?', min: 0, max: 3, unit: '+' },
          { id: 'caffeine_cups', type: 'slider', question: 'Caffeine cups per day?', min: 0, max: 5, unit: '+' },
          { id: 'sleep_hours', type: 'slider', question: 'Average sleep (hrs)?', min: 4, max: 10, unit: '' },
          { id: 'track_ovulation', type: 'toggle', question: 'Do you track ovulation?' },
          { id: 'fertility_conditions', type: 'multi-select', question: 'Any fertility-related conditions?', options: ['PCOS', 'Endometriosis', 'None'], optional: true }
        ];
      }
      if (goal === 'Boost Fertility 🌱') {
        return [
          { id: 'leafy_greens', type: 'slider', question: 'Leafy-green servings yesterday?', min: 0, max: 5, unit: '+' },
          { id: 'caffeine_cups', type: 'slider', question: 'Caffeine cups per day?', min: 0, max: 5, unit: '+' },
          { id: 'sleep_quality', type: 'emoji', question: 'Sleep quality last night?', emojis: ['😴', '😐', '😊'], labels: ['Poor', 'Okay', 'Great'] },
          { id: 'track_cycle', type: 'toggle', question: 'Are you currently tracking your cycle?' },
          { id: 'fertility_conditions', type: 'multi-select', question: 'Any diagnosed fertility conditions?', options: ['PCOS', 'Hypothyroid', 'Endo', 'None'], optional: true }
        ];
      }
      if (goal === 'Increase Folate 🥗') {
        return [
          { id: 'folate_supplement', type: 'toggle', question: 'Taking folate supplement daily?' },
          { id: 'legume_meals', type: 'slider', question: 'Meals with legumes yesterday?', min: 0, max: 3, unit: '+' },
          { id: 'whole_grains', type: 'slider', question: 'Whole grain servings yesterday?', min: 0, max: 3, unit: '+' },
          { id: 'alcohol_week', type: 'toggle', question: 'Alcohol in last 7 days?' },
          { id: 'prenatal_protocol', type: 'toggle', question: 'Are you following any specific prenatal protocol?', optional: true }
        ];
      }
      if (goal === 'Balance Blood Sugar 🍏') {
        return [
          { id: 'sugary_drinks', type: 'slider', question: 'Sugary drinks yesterday?', min: 0, max: 5, unit: '+' },
          { id: 'breakfast_time', type: 'toggle', question: 'Had breakfast before 10am?' },
          { id: 'steps_walked', type: 'slider', question: 'Steps walked yesterday?', min: 0, max: 12, unit: 'k' },
          { id: 'evening_carbs', type: 'toggle', question: 'Evening carb-heavy snack?' },
          { id: 'sleep_hours', type: 'slider', question: 'Sleep last night?', min: 4, max: 10, unit: ' hours' }
        ];
      }
    }

    // T1 Questions
    if (stage === 't1') {
      if (goal === 'Ease Morning Sickness 🤢') {
        return [
          { id: 'nausea_severity', type: 'emoji', question: 'Nausea severity right now?', emojis: ['😄', '😐', '🤢'], labels: ['None', 'Mild', 'Severe'] },
          { id: 'morning_snack', type: 'toggle', question: 'Morning snack eaten?' },
          { id: 'hours_since_meal', type: 'slider', question: 'Hours since last meal?', min: 0, max: 5, unit: '+' },
          { id: 'water_glasses', type: 'slider', question: 'Glasses of water yesterday?', min: 0, max: 10, unit: '+' },
          { id: 'pregnancy_complications', type: 'toggle', question: 'Any pregnancy complications diagnosed?', optional: true }
        ];
      }
      if (goal === 'Build Baby\'s Brain 🧠') {
        return [
          { id: 'omega3_sources', type: 'slider', question: 'Omega-3 sources this week?', min: 0, max: 7, unit: '' },
          { id: 'dha_supplement', type: 'toggle', question: 'DHA supplement taken?' },
          { id: 'choline_foods', type: 'slider', question: 'Choline-rich foods yesterday (e.g., eggs)?', min: 0, max: 2, unit: '+' },
          { id: 'memory_mood', type: 'emoji', question: 'Memory/mood changes?', emojis: ['😐', '😕', '😟'], labels: ['Normal', 'Some', 'Noticeable'], optional: true }
        ];
      }
      if (goal === 'Maintain Energy ⚡') {
        return [
          { id: 'sleep_hours', type: 'slider', question: 'Total sleep hours last night?', min: 4, max: 10, unit: '' },
          { id: 'snacks_yesterday', type: 'slider', question: 'Snacks yesterday?', min: 0, max: 5, unit: '' },
          { id: 'caffeine_today', type: 'slider', question: 'Caffeine today?', min: 0, max: 5, unit: ' cups' },
          { id: 'water_intake', type: 'slider', question: 'Water intake yesterday?', min: 0, max: 10, unit: '' },
          { id: 'movement_24h', type: 'slider', question: 'Movement in last 24h?', min: 0, max: 60, unit: ' min' }
        ];
      }
    }

    // T2 Questions
    if (stage === 't2') {
      if (goal === 'Build Baby\'s Bones 🦴') {
        return [
          { id: 'calcium_servings', type: 'slider', question: 'Calcium-rich servings yesterday?', min: 0, max: 3, unit: '+' },
          { id: 'iron_servings', type: 'slider', question: 'Iron-rich servings yesterday?', min: 0, max: 3, unit: '+' },
          { id: 'daily_steps', type: 'slider', question: 'Daily steps yesterday?', min: 0, max: 12, unit: 'k' },
          { id: 'constipation', type: 'emoji', question: 'Constipation today?', emojis: ['🙂', '😐', '😣'], labels: ['None', 'Mild', 'Uncomfortable'] }
        ];
      }
      if (goal === 'Prevent Constipation 🍑') {
        return [
          { id: 'fiber_servings', type: 'slider', question: 'Fiber-rich servings yesterday?', min: 0, max: 5, unit: '+' },
          { id: 'water_intake', type: 'slider', question: 'Water intake yesterday?', min: 0, max: 10, unit: '+' },
          { id: 'magnesium_foods', type: 'slider', question: 'Magnesium-rich foods?', min: 0, max: 3, unit: '+' },
          { id: 'physical_activity', type: 'slider', question: 'Physical activity today?', min: 0, max: 60, unit: ' min' },
          { id: 'digestion_supplements', type: 'toggle', question: 'Use of supplements for digestion?', optional: true }
        ];
      }
      if (goal === 'Sustain Energy ⚡') {
        return [
          { id: 'sleep_hours', type: 'slider', question: 'Sleep hours last night?', min: 4, max: 10, unit: '' },
          { id: 'sugar_intake', type: 'slider', question: 'Sugar intake yesterday?', min: 0, max: 5, unit: '+' },
          { id: 'protein_meals', type: 'slider', question: 'High-protein meals yesterday?', min: 0, max: 3, unit: '+' },
          { id: 'morning_fatigue', type: 'emoji', question: 'Morning fatigue today?', emojis: ['😴', '😐', '💪'], labels: ['Tired', 'Okay', 'Energetic'] }
        ];
      }
    }

    // T3 Questions
    if (stage === 't3') {
      if (goal === 'Prepare for Birth ❤️') {
        return [
          { id: 'iron_servings', type: 'slider', question: 'Iron-rich servings yesterday?', min: 0, max: 3, unit: '+' },
          { id: 'daily_steps', type: 'slider', question: 'Daily steps yesterday?', min: 0, max: 12, unit: 'k' },
          { id: 'heartburn_severity', type: 'emoji', question: 'Heartburn severity today?', emojis: ['🙂', '😐', '🔥'], labels: ['None', 'Mild', 'Severe'] },
          { id: 'sleep_hours', type: 'slider', question: 'Hours of sleep last night?', min: 4, max: 10, unit: '' }
        ];
      }
      if (goal === 'Support Growth 📈') {
        return [
          { id: 'protein_meals', type: 'slider', question: 'Protein-rich meals yesterday?', min: 0, max: 3, unit: '+' },
          { id: 'weight_gain', type: 'slider', question: 'Weight gain this week?', min: 0, max: 3, unit: ' kg' },
          { id: 'fruit_veg_servings', type: 'slider', question: 'Fruit/veg servings yesterday?', min: 0, max: 7, unit: '+' },
          { id: 'appetite_level', type: 'emoji', question: 'Appetite level today?', emojis: ['😐', '🙂', '😋'], labels: ['Low', 'Normal', 'High'] }
        ];
      }
      if (goal === 'Manage Heartburn 🔥') {
        return [
          { id: 'heartburn_severity', type: 'emoji', question: 'Severity today?', emojis: ['🙂', '😐', '🔥'], labels: ['None', 'Mild', 'Severe'] },
          { id: 'greasy_acidic_meals', type: 'slider', question: 'Greasy or acidic meals yesterday?', min: 0, max: 3, unit: '' },
          { id: 'late_meals', type: 'toggle', question: 'Late meals past 8pm?' },
          { id: 'pillow_elevation', type: 'toggle', question: 'Use of pillows for elevation while sleeping?' }
        ];
      }
    }

    // Postpartum Questions
    if (stage === 'postpartum') {
      if (goal === 'Recover Postpartum 💪') {
        return [
          { id: 'protein_servings', type: 'slider', question: 'Protein-rich servings yesterday?', min: 0, max: 4, unit: '+' },
          { id: 'sleep_hours', type: 'slider', question: 'Hours of sleep last night?', min: 3, max: 9, unit: '' },
          { id: 'energy_level', type: 'emoji', question: 'Energy level today?', emojis: ['😴', '😐', '💪'], labels: ['Exhausted', 'Okay', 'Energetic'] },
          { id: 'breastfeeding', type: 'toggle', question: 'Are you breastfeeding?' },
          { id: 'water_glasses', type: 'slider', question: 'Glasses of water yesterday?', min: 0, max: 10, unit: '+' }
        ];
      }
      if (goal === 'Support Lactation 🍼') {
        return [
          { id: 'breastfeeding_frequency', type: 'slider', question: 'Breastfeeding frequency today?', min: 0, max: 12, unit: '' },
          { id: 'protein_meals', type: 'slider', question: 'Protein-rich meals today?', min: 0, max: 3, unit: '+' },
          { id: 'water_intake', type: 'slider', question: 'Water intake yesterday?', min: 0, max: 10, unit: '+' },
          { id: 'stress_level', type: 'emoji', question: 'Stress level today?', emojis: ['😐', '😟', '😰'], labels: ['Calm', 'Moderate', 'High'] }
        ];
      }
      if (goal === 'Boost Energy ⚡') {
        return [
          { id: 'nap_periods', type: 'slider', question: 'Nap or rest periods today?', min: 0, max: 3, unit: '' },
          { id: 'caffeine_today', type: 'slider', question: 'Caffeine today?', min: 0, max: 5, unit: '' },
          { id: 'protein_breakfast', type: 'toggle', question: 'Protein breakfast eaten?' },
          { id: 'emotion_checkin', type: 'emoji', question: 'Emotion check-in', emojis: ['😐', '🙂', '😄'], labels: ['Neutral', 'Good', 'Great'] }
        ];
      }
      if (goal === 'Rebuild Iron 🩸') {
        return [
          { id: 'iron_supplement', type: 'toggle', question: 'Iron supplement taken today?' },
          { id: 'red_meat_legumes', type: 'slider', question: 'Red meat / legumes yesterday?', min: 0, max: 3, unit: '+' },
          { id: 'fatigue_level', type: 'emoji', question: 'Fatigue level today?', emojis: ['😐', '😴', '😩'], labels: ['Normal', 'Tired', 'Exhausted'] },
          { id: 'heavy_bleeding', type: 'toggle', question: 'Recent heavy bleeding?' }
        ];
      }
    }

    return [];
  };

  const renderSliderQuestion = (question: any) => {
    const value = baselineAnswers[question.id]; // No default value - undefined until selected
    const buttons = [];
    
    for (let i = question.min; i <= question.max; i++) {
      buttons.push(i);
    }

    return (
      <View style={styles.questionCard}>
        <Text style={styles.questionText}>{question.question}</Text>
        <View style={styles.sliderContainer}>
          <View style={styles.buttonRow}>
            {buttons.map((buttonValue) => (
              <TouchableOpacity
                key={buttonValue}
                style={[
                  styles.sliderButton,
                  value === buttonValue && styles.sliderButtonActive
                ]}
                onPress={() => {
                  // If clicking the same value, unselect it
                  if (value === buttonValue) {
                    const newAnswers = { ...baselineAnswers };
                    delete newAnswers[question.id];
                    onAnswersChange(newAnswers);
                  } else {
                    onAnswersChange({ ...baselineAnswers, [question.id]: buttonValue });
                  }
                }}
              >
                <Text style={[
                  styles.sliderButtonText,
                  value === buttonValue && styles.sliderButtonTextActive
                ]}>
                  {buttonValue}{question.unit}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        {value !== undefined && (
          <TouchableOpacity 
            style={styles.clearButton}
            onPress={() => {
              const newAnswers = { ...baselineAnswers };
              delete newAnswers[question.id];
              onAnswersChange(newAnswers);
            }}
          >
            <Text style={styles.clearButtonText}>Clear selection</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderToggleQuestion = (question: any) => {
    const value = baselineAnswers[question.id]; // No default value - undefined until selected
    
    return (
      <View style={styles.questionCard}>
        <Text style={styles.questionText}>{question.question}</Text>
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              value === true && styles.toggleButtonActive
            ]}
            onPress={() => {
              // If clicking the same value, unselect it
              if (value === true) {
                const newAnswers = { ...baselineAnswers };
                delete newAnswers[question.id];
                onAnswersChange(newAnswers);
              } else {
                onAnswersChange({ ...baselineAnswers, [question.id]: true });
              }
            }}
          >
            <Text style={[
              styles.toggleButtonText,
              value === true && styles.toggleButtonTextActive
            ]}>
              Yes
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              value === false && styles.toggleButtonActive
            ]}
            onPress={() => {
              // If clicking the same value, unselect it
              if (value === false) {
                const newAnswers = { ...baselineAnswers };
                delete newAnswers[question.id];
                onAnswersChange(newAnswers);
              } else {
                onAnswersChange({ ...baselineAnswers, [question.id]: false });
              }
            }}
          >
            <Text style={[
              styles.toggleButtonText,
              value === false && styles.toggleButtonTextActive
            ]}>
              No
            </Text>
          </TouchableOpacity>
        </View>
        {value !== undefined && (
          <TouchableOpacity 
            style={styles.clearButton}
            onPress={() => {
              const newAnswers = { ...baselineAnswers };
              delete newAnswers[question.id];
              onAnswersChange(newAnswers);
            }}
          >
            <Text style={styles.clearButtonText}>Clear selection</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderEmojiQuestion = (question: any) => {
    const value = baselineAnswers[question.id]; // No default value - undefined until selected
    
    return (
      <View style={styles.questionCard}>
        <Text style={styles.questionText}>{question.question}</Text>
        <View style={styles.emojiContainer}>
          {question.emojis.map((emoji: string, index: number) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.emojiButton,
                value === index && styles.emojiButtonActive
              ]}
              onPress={() => {
                // If clicking the same value, unselect it
                if (value === index) {
                  const newAnswers = { ...baselineAnswers };
                  delete newAnswers[question.id];
                  onAnswersChange(newAnswers);
                } else {
                  onAnswersChange({ ...baselineAnswers, [question.id]: index });
                }
              }}
            >
              <Text style={styles.emojiText}>{emoji}</Text>
              <Text style={[
                styles.emojiLabel,
                value === index && styles.emojiLabelActive
              ]}>
                {question.labels[index]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {value !== undefined && (
          <TouchableOpacity 
            style={styles.clearButton}
            onPress={() => {
              const newAnswers = { ...baselineAnswers };
              delete newAnswers[question.id];
              onAnswersChange(newAnswers);
            }}
          >
            <Text style={styles.clearButtonText}>Clear selection</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderMultiSelectQuestion = (question: any) => {
    const value = baselineAnswers[question.id] || [];
    
    const toggleOption = (option: string) => {
      const newValue = value.includes(option)
        ? value.filter((v: string) => v !== option)
        : [...value, option];
      
      // If all options are deselected, remove the question from answers
      if (newValue.length === 0) {
        const newAnswers = { ...baselineAnswers };
        delete newAnswers[question.id];
        onAnswersChange(newAnswers);
      } else {
        onAnswersChange({ ...baselineAnswers, [question.id]: newValue });
      }
    };

    return (
      <View style={styles.questionCard}>
        <Text style={styles.questionText}>{question.question}</Text>
        <View style={styles.multiSelectContainer}>
          {question.options.map((option: string) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.multiSelectOption,
                value.includes(option) && styles.multiSelectOptionActive
              ]}
              onPress={() => toggleOption(option)}
            >
              <Text style={[
                styles.multiSelectText,
                value.includes(option) && styles.multiSelectTextActive
              ]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {value.length > 0 && (
          <TouchableOpacity 
            style={styles.clearButton}
            onPress={() => {
              const newAnswers = { ...baselineAnswers };
              delete newAnswers[question.id];
              onAnswersChange(newAnswers);
            }}
          >
            <Text style={styles.clearButtonText}>Clear all selections</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderQuestion = (question: any) => {
    switch (question.type) {
      case 'slider':
        return renderSliderQuestion(question);
      case 'toggle':
        return renderToggleQuestion(question);
      case 'emoji':
        return renderEmojiQuestion(question);
      case 'multi-select':
        return renderMultiSelectQuestion(question);
      default:
        return null;
    }
  };

  const questions = getBaselineQuestions();

  return (
    <View style={styles.baselineWrapper}>
      <View style={styles.stepHeader}>
        <View style={styles.iconContainer}>
          <Activity size={48} color="#B8A9FF" />
        </View>
        <Text style={styles.stepTitle}>Adaptive Baseline Quiz</Text>
        <Text style={styles.baselineSubtitle}>
          Hilla needs a snapshot to personalise your very first nutrient ring, tip, and reminder—without storing any identifiable health record.
        </Text>
      </View>

      <View style={styles.questionsContainer}>
        {questions.map((question, index) => (
          <View key={question.id}>
            {question.optional && (
              <Text style={styles.optionalLabel}>Optional</Text>
            )}
            {renderQuestion(question)}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  baselineWrapper: {
    flex: 1,
  },
  stepHeader: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 32,
  },
  iconContainer: {
    marginBottom: 24,
  },
  stepTitle: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  baselineSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  questionsContainer: {
    gap: 20,
    paddingBottom: 20,
  },
  optionalLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
    marginBottom: 8,
    textAlign: 'center',
  },
  questionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  questionText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  sliderContainer: {
    alignItems: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  sliderButton: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    minWidth: 50,
    alignItems: 'center',
  },
  sliderButtonActive: {
    backgroundColor: '#B8A9FF',
  },
  sliderButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  sliderButtonTextActive: {
    color: '#FFFFFF',
  },
  toggleContainer: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
  },
  toggleButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  toggleButtonActive: {
    backgroundColor: '#B8A9FF',
  },
  toggleButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
  toggleButtonTextActive: {
    color: '#FFFFFF',
  },
  emojiContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 12,
  },
  emojiButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  emojiButtonActive: {
    backgroundColor: '#B8A9FF',
  },
  emojiText: {
    fontSize: 24,
    marginBottom: 8,
  },
  emojiLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    textAlign: 'center',
  },
  emojiLabelActive: {
    color: '#FFFFFF',
  },
  multiSelectContainer: {
    gap: 8,
  },
  multiSelectOption: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  multiSelectOptionActive: {
    backgroundColor: '#B8A9FF',
  },
  multiSelectText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  multiSelectTextActive: {
    color: '#FFFFFF',
  },
  clearButton: {
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    alignSelf: 'center',
  },
  clearButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    textAlign: 'center',
  },
});