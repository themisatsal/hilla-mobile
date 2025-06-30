import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { ZapOff, X } from 'lucide-react-native';
import { useState } from 'react';

interface EnergyDrainersStepProps {
  energyDrainers: string[];
  onDrainersChange: (drainers: string[]) => void;
}

export default function EnergyDrainersStep({ 
  energyDrainers, 
  onDrainersChange 
}: EnergyDrainersStepProps) {
  const [customDrainer, setCustomDrainer] = useState('');
  const [showCustomDrainer, setShowCustomDrainer] = useState(false);

  const predefinedDrainers = [
    'Sugary drinks', 'Late nights', 'Doom-scrolling', 'Heavy meal', 'Long sitting',
    'Loud noise', 'Stress meetings', 'Skipped breakfast', 'Processed snacks', 'Over-caffeine'
  ];

  const toggleDrainer = (drainer: string) => {
    const newDrainers = energyDrainers.includes(drainer) 
      ? energyDrainers.filter(d => d !== drainer)
      : [...energyDrainers, drainer];
    onDrainersChange(newDrainers);
  };

  const removeCustomDrainer = (customDrainer: string) => {
    const newDrainers = energyDrainers.filter(d => d !== customDrainer);
    onDrainersChange(newDrainers);
  };

  const addCustomDrainer = () => {
    if (customDrainer.trim()) {
      onDrainersChange([...energyDrainers, customDrainer.trim()]);
      setCustomDrainer('');
      setShowCustomDrainer(false);
    }
  };

  // Get custom drainers (those not in predefined list)
  const customDrainers = energyDrainers.filter(d => !predefinedDrainers.includes(d));

  return (
    <View style={styles.drainersWrapper}>
      <View style={styles.stepHeader}>
        <View style={styles.iconContainer}>
          <ZapOff size={48} color="#B8A9FF" />
        </View>
        <Text style={styles.stepTitle}>Energy Drainers Selection</Text>
      </View>

      <View style={styles.responsiveDrainersContainer}>
        {/* Predefined drainers */}
        {predefinedDrainers.map((drainer) => (
          <TouchableOpacity
            key={drainer}
            style={[
              styles.responsiveDrainerCard,
              energyDrainers.includes(drainer) && styles.drainerCardSelected
            ]}
            onPress={() => toggleDrainer(drainer)}
          >
            <Text style={[
              styles.drainerLabel,
              energyDrainers.includes(drainer) && styles.drainerLabelSelected
            ]}>
              {drainer}
            </Text>
          </TouchableOpacity>
        ))}

        {/* Custom drainers - now with toggle functionality */}
        {customDrainers.map((customD) => (
          <TouchableOpacity
            key={customD}
            style={[styles.responsiveDrainerCard, styles.drainerCardSelected, styles.customDrainerCard]}
            onPress={() => toggleDrainer(customD)}
          >
            <Text style={[styles.drainerLabel, styles.drainerLabelSelected, styles.customDrainerLabel]}>
              {customD}
            </Text>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={(e) => {
                e.stopPropagation(); // Prevent the toggle from firing
                removeCustomDrainer(customD);
              }}
            >
              <X size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}

        {/* Add your own button */}
        {!showCustomDrainer ? (
          <TouchableOpacity
            style={styles.addCustomCard}
            onPress={() => setShowCustomDrainer(true)}
          >
            <Text style={styles.addCustomText}>+ Add your own</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.customInputCard}>
            <TextInput
              style={styles.customInput}
              placeholder="Enter custom drainer"
              value={customDrainer}
              onChangeText={setCustomDrainer}
              autoFocus
              onSubmitEditing={addCustomDrainer}
            />
            <View style={styles.customInputButtons}>
              <TouchableOpacity style={styles.customInputButton} onPress={addCustomDrainer}>
                <Text style={styles.customInputButtonText}>Add</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.customInputButton, styles.cancelButton]} 
                onPress={() => {
                  setShowCustomDrainer(false);
                  setCustomDrainer('');
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
  drainersWrapper: {
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
  responsiveDrainersContainer: {
    gap: 12,
    paddingBottom: 20,
  },
  responsiveDrainerCard: {
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
  drainerCardSelected: {
    borderColor: '#B8A9FF',
    backgroundColor: '#F8F6FF',
  },
  customDrainerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  drainerLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#374151',
    textAlign: 'center',
  },
  drainerLabelSelected: {
    color: '#B8A9FF',
    fontFamily: 'Inter-SemiBold',
  },
  customDrainerLabel: {
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