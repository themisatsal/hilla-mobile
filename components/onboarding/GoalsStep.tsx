import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Target } from 'lucide-react-native';

interface GoalsStepProps {
  selectedStage: string;
  selectedGoal: string;
  onGoalSelect: (goal: string) => void;
}

export default function GoalsStep({ selectedStage, selectedGoal, onGoalSelect }: GoalsStepProps) {
  const getGoalsForStage = (stageId: string) => {
    const goalsByStage = {
      'ttc': [
        'Support Conception 🧬',
        'Boost Fertility 🌱',
        'Increase Folate 🥗',
        'Balance Blood Sugar 🍏'
      ],
      't1': [
        'Ease Morning Sickness 🤢',
        'Build Baby\'s Brain 🧠',
        'Maintain Energy ⚡'
      ],
      't2': [
        'Build Baby\'s Bones 🦴',
        'Prevent Constipation 🍑',
        'Sustain Energy ⚡'
      ],
      't3': [
        'Support Growth 📈',
        'Prepare for Birth ❤️',
        'Manage Heartburn 🔥'
      ],
      'postpartum': [
        'Recover Postpartum 💪',
        'Support Lactation 🍼',
        'Boost Energy ⚡',
        'Rebuild Iron 🩸'
      ]
    };
    return goalsByStage[stageId as keyof typeof goalsByStage] || [];
  };

  const goals = getGoalsForStage(selectedStage);

  return (
    <View style={styles.goalsWrapper}>
      <View style={styles.stepHeader}>
        <View style={styles.iconContainer}>
          <Target size={48} color="#B8A9FF" />
        </View>
        <Text style={styles.goalTitle}>Choose Your Main Goal</Text>
      </View>

      <View style={styles.responsiveGoalsContainer}>
        {goals.length > 0 ? goals.map((goal) => (
          <TouchableOpacity
            key={goal}
            style={[
              styles.responsiveGoalCard,
              selectedGoal === goal && styles.goalCardSelected
            ]}
            onPress={() => onGoalSelect(goal)}
          >
            <Text style={[
              styles.goalLabel,
              selectedGoal === goal && styles.goalLabelSelected
            ]}>
              {goal}
            </Text>
          </TouchableOpacity>
        )) : (
          <View style={styles.noGoalsContainer}>
            <Text style={styles.noGoalsText}>
              Please select a life stage first to see available goals.
            </Text>
          </View>
        )}
      </View>

      <View style={styles.goalNote}>
        <Text style={styles.goalNoteText}>
          You can add or change goals anytime in Profile → Goals.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  goalsWrapper: {
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
  goalTitle: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  responsiveGoalsContainer: {
    gap: 12,
    paddingBottom: 20,
  },
  responsiveGoalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 18,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
    minHeight: 60,
  },
  goalCardSelected: {
    borderColor: '#B8A9FF',
    backgroundColor: '#F8F6FF',
  },
  goalLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#374151',
    textAlign: 'center',
  },
  goalLabelSelected: {
    color: '#B8A9FF',
    fontFamily: 'Inter-SemiBold',
  },
  noGoalsContainer: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#FCD34D',
  },
  noGoalsText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#92400E',
    textAlign: 'center',
  },
  goalNote: {
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#E0F2FE',
  },
  goalNoteText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#0369A1',
    textAlign: 'center',
    lineHeight: 20,
  },
});