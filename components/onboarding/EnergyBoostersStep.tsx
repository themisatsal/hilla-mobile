import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Zap, X } from 'lucide-react-native';
import { useState } from 'react';

interface EnergyBoostersStepProps {
  energyBoosters: string[];
  onBoostersChange: (boosters: string[]) => void;
}

export default function EnergyBoostersStep({ 
  energyBoosters, 
  onBoostersChange 
}: EnergyBoostersStepProps) {
  const [customBooster, setCustomBooster] = useState('');
  const [showCustomBooster, setShowCustomBooster] = useState(false);

  const predefinedBoosters = [
    'Morning walk', 'Green smoothie', 'Power nap', 'Meditation', 'Strength set',
    'Sunlight', 'L-theanine tea', 'Journaling', 'Protein snack', 'Deep breathing'
  ];

  const toggleBooster = (booster: string) => {
    const newBoosters = energyBoosters.includes(booster) 
      ? energyBoosters.filter(b => b !== booster)
      : [...energyBoosters, booster];
    onBoostersChange(newBoosters);
  };

  const removeCustomBooster = (customBooster: string) => {
    const newBoosters = energyBoosters.filter(b => b !== customBooster);
    onBoostersChange(newBoosters);
  };

  const addCustomBooster = () => {
    if (customBooster.trim()) {
      onBoostersChange([...energyBoosters, customBooster.trim()]);
      setCustomBooster('');
      setShowCustomBooster(false);
    }
  };

  // Get custom boosters (those not in predefined list)
  const customBoosters = energyBoosters.filter(b => !predefinedBoosters.includes(b));

  return (
    <View style={styles.boostersWrapper}>
      <View style={styles.stepHeader}>
        <View style={styles.iconContainer}>
          <Zap size={48} color="#B8A9FF" />
        </View>
        <Text style={styles.stepTitle}>Energy Boosters Selection</Text>
      </View>

      <View style={styles.responsiveBoostersContainer}>
        {/* Predefined boosters */}
        {predefinedBoosters.map((booster) => (
          <TouchableOpacity
            key={booster}
            style={[
              styles.responsiveBoosterCard,
              energyBoosters.includes(booster) && styles.boosterCardSelected
            ]}
            onPress={() => toggleBooster(booster)}
          >
            <Text style={[
              styles.boosterLabel,
              energyBoosters.includes(booster) && styles.boosterLabelSelected
            ]}>
              {booster}
            </Text>
          </TouchableOpacity>
        ))}

        {/* Custom boosters - now with toggle functionality */}
        {customBoosters.map((customB) => (
          <TouchableOpacity
            key={customB}
            style={[styles.responsiveBoosterCard, styles.boosterCardSelected, styles.customBoosterCard]}
            onPress={() => toggleBooster(customB)}
          >
            <Text style={[styles.boosterLabel, styles.boosterLabelSelected, styles.customBoosterLabel]}>
              {customB}
            </Text>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={(e) => {
                e.stopPropagation(); // Prevent the toggle from firing
                removeCustomBooster(customB);
              }}
            >
              <X size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}

        {/* Add your own button */}
        {!showCustomBooster ? (
          <TouchableOpacity
            style={styles.addCustomCard}
            onPress={() => setShowCustomBooster(true)}
          >
            <Text style={styles.addCustomText}>+ Add your own</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.customInputCard}>
            <TextInput
              style={styles.customInput}
              placeholder="Enter custom booster"
              value={customBooster}
              onChangeText={setCustomBooster}
              autoFocus
              onSubmitEditing={addCustomBooster}
            />
            <View style={styles.customInputButtons}>
              <TouchableOpacity style={styles.customInputButton} onPress={addCustomBooster}>
                <Text style={styles.customInputButtonText}>Add</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.customInputButton, styles.cancelButton]} 
                onPress={() => {
                  setShowCustomBooster(false);
                  setCustomBooster('');
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  boostersWrapper: {
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
  responsiveBoostersContainer: {
    gap: 12,
    paddingBottom: 20,
  },
  responsiveBoosterCard: {
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
  boosterCardSelected: {
    borderColor: '#B8A9FF',
    backgroundColor: '#F8F6FF',
  },
  customBoosterCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  boosterLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#374151',
    textAlign: 'center',
  },
  boosterLabelSelected: {
    color: '#B8A9FF',
    fontFamily: 'Inter-SemiBold',
  },
  customBoosterLabel: {
    textAlign: 'left',
    flex: 1,
  },
  removeButton: {
    backgroundColor: '#EF4444',
    borderRadius: 12,
    padding: 4,
    marginLeft: 8,
  },
  addCustomCard: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 18,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderStyle: 'dashed',
    minHeight: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addCustomText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    textAlign: 'center',
  },
  customInputCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#B8A9FF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  customInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginBottom: 12,
  },
  customInputButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  customInputButton: {
    flex: 1,
    backgroundColor: '#B8A9FF',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  customInputButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
  },
  cancelButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
});