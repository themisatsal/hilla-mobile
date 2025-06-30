import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Heart } from 'lucide-react-native';
import { useEffect } from 'react';

interface DietaryPreferencesStepProps {
  dietaryPreferences: string[];
  onPreferencesChange: (preferences: string[]) => void;
}

export default function DietaryPreferencesStep({ 
  dietaryPreferences, 
  onPreferencesChange 
}: DietaryPreferencesStepProps) {
  const preferences = ['Vegetarian', 'Vegan', 'Gluten-free', 'Dairy-free', 'Pescatarian', 'None'];

  const togglePreference = (preference: string) => {
    let newPreferences: string[];
    
    if (preference === 'None') {
      // If "None" is selected, clear all other preferences
      newPreferences = ['None'];
    } else {
      // If any other preference is selected
      if (dietaryPreferences.includes(preference)) {
        // Remove the preference if it's already selected
        newPreferences = dietaryPreferences.filter(p => p !== preference);
      } else {
        // Add the preference and remove "None" if it exists
        newPreferences = [...dietaryPreferences.filter(p => p !== 'None'), preference];
      }
    }
    
    onPreferencesChange(newPreferences);
  };

  return (
    <View style={styles.preferencesWrapper}>
      <View style={styles.stepHeader}>
        <View style={styles.iconContainer}>
          <Heart size={48} color="#B8A9FF" />
        </View>
        <Text style={styles.stepTitle}>Dietary Snapshot</Text>
        <Text style={styles.stepSubtitle}>Any dietary preferences?</Text>
      </View>

      <View style={styles.responsivePreferencesContainer}>
        {preferences.map((preference) => (
          <TouchableOpacity
            key={preference}
            style={[
              styles.responsivePreferenceCard,
              dietaryPreferences.includes(preference) && styles.preferenceCardSelected
            ]}
            onPress={() => togglePreference(preference)}
          >
            <Text style={[
              styles.preferenceLabel,
              dietaryPreferences.includes(preference) && styles.preferenceLabelSelected
            ]}>
              {preference}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  preferencesWrapper: {
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
  responsivePreferencesContainer: {
    gap: 12,
    paddingBottom: 20,
  },
  responsivePreferenceCard: {
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
  preferenceCardSelected: {
    borderColor: '#B8A9FF',
    backgroundColor: '#F8F6FF',
  },
  preferenceLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#374151',
    textAlign: 'center',
  },
  preferenceLabelSelected: {
    color: '#B8A9FF',
    fontFamily: 'Inter-SemiBold',
  },
});