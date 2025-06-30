import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Baby } from 'lucide-react-native';

interface LifeStageStepProps {
  selectedStage: string;
  onStageSelect: (stage: string) => void;
}

export default function LifeStageStep({ selectedStage, onStageSelect }: LifeStageStepProps) {
  const stages = [
    { id: 'ttc', label: 'Trying to Conceive', description: 'Planning for pregnancy' },
    { id: 't1', label: 'First Trimester', description: 'Weeks 1-12' },
    { id: 't2', label: 'Second Trimester', description: 'Weeks 13-26' },
    { id: 't3', label: 'Third Trimester', description: 'Weeks 27-40' },
    { id: 'postpartum', label: 'Postpartum', description: 'After delivery' }
  ];

  return (
    <View style={styles.stageWrapper}>
      <View style={styles.stepHeader}>
        <View style={styles.iconContainer}>
          <Baby size={48} color="#B8A9FF" />
        </View>
        <Text style={styles.stepTitle}>What stage are you in?</Text>
        <Text style={styles.stepSubtitle}>
          This helps us provide the right nutritional guidance
        </Text>
      </View>

      <View style={styles.responsiveOptionsContainer}>
        {stages.map((stageOption) => (
          <TouchableOpacity
            key={stageOption.id}
            style={[
              styles.responsiveOptionCard,
              selectedStage === stageOption.id && styles.optionCardSelected
            ]}
            onPress={() => onStageSelect(stageOption.id)}
          >
            <Text style={[
              styles.optionLabel,
              selectedStage === stageOption.id && styles.optionLabelSelected
            ]}>
              {stageOption.label}
            </Text>
            <Text style={[
              styles.optionDescription,
              selectedStage === stageOption.id && styles.optionDescriptionSelected
            ]}>
              {stageOption.description}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stageWrapper: {
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
  stepSubtitle: {
    fontSize: 18,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 26,
  },
  responsiveOptionsContainer: {
    gap: 16,
    paddingBottom: 20,
  },
  responsiveOptionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    minHeight: 80,
  },
  optionCardSelected: {
    borderColor: '#B8A9FF',
    backgroundColor: '#F8F6FF',
  },
  optionLabel: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  optionLabelSelected: {
    color: '#B8A9FF',
  },
  optionDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  optionDescriptionSelected: {
    color: '#8B5CF6',
  },
});