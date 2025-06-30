import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Check } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TRACKING_SETTINGS_KEY = '@hilla_nutrition_tracking_settings';
const { width: screenWidth } = Dimensions.get('window');

interface TrackingSettings {
  selectedMetrics: string[];
}

const defaultSettings: TrackingSettings = {
  selectedMetrics: ['iron', 'dha', 'folate']
};

const MAX_SELECTIONS = 3;

// Essential nutrients only - exactly 12 unique options
const allNutrients = [
  { id: 'iron', name: 'Iron', emoji: '🩸', unit: 'mg', color: '#FF3B30' },
  { id: 'folate', name: 'Folate', emoji: '🥬', unit: 'mcg', color: '#34C759' },
  { id: 'dha', name: 'DHA', emoji: '🐟', unit: 'g', color: '#007AFF' },
  { id: 'calcium', name: 'Calcium', emoji: '🦴', unit: 'mg', color: '#007AFF' },
  { id: 'protein', name: 'Protein', emoji: '🥩', unit: 'g', color: '#FF3B30' },
  { id: 'fiber', name: 'Fiber', emoji: '🌾', unit: 'g', color: '#8E8E93' },
  { id: 'vitamin_d', name: 'Vitamin D', emoji: '☀️', unit: 'IU', color: '#FFD60A' },
  { id: 'choline', name: 'Choline', emoji: '🥚', unit: 'mg', color: '#FFD60A' },
  { id: 'zinc', name: 'Zinc', emoji: '🥜', unit: 'mg', color: '#8E8E93' },
  { id: 'magnesium', name: 'Magnesium', emoji: '🌿', unit: 'mg', color: '#34C759' },
  { id: 'omega3', name: 'Omega-3', emoji: '🐠', unit: 'g', color: '#007AFF' },
  { id: 'vitamin_b6', name: 'B6', emoji: '💊', unit: 'mg', color: '#8A6DFF' },
];

export default function NutritionTrackingSettings() {
  const router = useRouter();
  const [currentSettings, setCurrentSettings] = useState<TrackingSettings>(defaultSettings);
  const [pendingSettings, setPendingSettings] = useState<TrackingSettings>(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    // Check if pending settings differ from current
    const settingsChanged = JSON.stringify(pendingSettings.selectedMetrics.sort()) !== 
                           JSON.stringify(currentSettings.selectedMetrics.sort());
    setHasChanges(settingsChanged);
  }, [pendingSettings, currentSettings]);

  const loadSettings = async () => {
    try {
      const stored = await AsyncStorage.getItem(TRACKING_SETTINGS_KEY);
      if (stored) {
        const parsedSettings = JSON.parse(stored);
        const validatedSettings: TrackingSettings = {
          selectedMetrics: Array.isArray(parsedSettings.selectedMetrics) 
            ? parsedSettings.selectedMetrics.filter(id => 
                allNutrients.some(n => n.id === id)
              ).slice(0, MAX_SELECTIONS)
            : defaultSettings.selectedMetrics
        };
        setCurrentSettings(validatedSettings);
        setPendingSettings(validatedSettings);
      } else {
        setCurrentSettings(defaultSettings);
        setPendingSettings(defaultSettings);
      }
    } catch (error) {
      console.error('Error loading tracking settings:', error);
      setCurrentSettings(defaultSettings);
      setPendingSettings(defaultSettings);
    } finally {
      setIsLoaded(true);
    }
  };

  const applyChanges = async () => {
    try {
      // Ensure exactly MAX_SELECTIONS are selected
      const finalSettings = {
        ...pendingSettings,
        selectedMetrics: pendingSettings.selectedMetrics.slice(0, MAX_SELECTIONS)
      };
      
      await AsyncStorage.setItem(TRACKING_SETTINGS_KEY, JSON.stringify(finalSettings));
      setCurrentSettings(finalSettings);
      setHasChanges(false);
      router.back();
    } catch (error) {
      console.error('Error saving tracking settings:', error);
    }
  };

  const toggleMetric = (nutrientId: string) => {
    const isSelected = pendingSettings.selectedMetrics.includes(nutrientId);
    
    let newSelectedMetrics;
    if (isSelected) {
      // Remove if already selected
      newSelectedMetrics = pendingSettings.selectedMetrics.filter(id => id !== nutrientId);
    } else {
      // Add if under limit
      if (pendingSettings.selectedMetrics.length < MAX_SELECTIONS) {
        newSelectedMetrics = [...pendingSettings.selectedMetrics, nutrientId];
      } else {
        return; // Don't add if at max
      }
    }

    setPendingSettings({ selectedMetrics: newSelectedMetrics });
  };

  if (!isLoaded) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={20} color="#007AFF" strokeWidth={2.5} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nutrition Tracking</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Description */}
        <View style={styles.descriptionSection}>
          <Text style={styles.description}>
            Choose {MAX_SELECTIONS} nutrients to track on your home screen
          </Text>
          <Text style={styles.selectionCount}>
            {pendingSettings.selectedMetrics.length} of {MAX_SELECTIONS} selected
          </Text>
        </View>

        {/* Nutrient Grid */}
        <View style={styles.nutrientsGrid}>
          {allNutrients.map((nutrient) => {
            const isSelected = pendingSettings.selectedMetrics.includes(nutrient.id);
            const canSelect = pendingSettings.selectedMetrics.length < MAX_SELECTIONS || isSelected;
            
            return (
              <TouchableOpacity
                key={nutrient.id}
                style={[
                  styles.nutrientCard,
                  isSelected && styles.nutrientCardSelected,
                  !canSelect && styles.nutrientCardDisabled
                ]}
                onPress={() => canSelect && toggleMetric(nutrient.id)}
                activeOpacity={canSelect ? 0.7 : 1}
              >
                <View style={styles.nutrientContent}>
                  <Text style={styles.nutrientEmoji}>{nutrient.emoji}</Text>
                  <Text style={[
                    styles.nutrientName,
                    isSelected && styles.nutrientNameSelected,
                    !canSelect && styles.nutrientNameDisabled
                  ]}>
                    {nutrient.name}
                  </Text>
                  <Text style={[
                    styles.nutrientUnit,
                    !canSelect && styles.nutrientUnitDisabled
                  ]}>
                    {nutrient.unit}
                  </Text>
                </View>
                
                {isSelected && (
                  <View style={styles.checkmark}>
                    <Check size={14} color="#FFFFFF" strokeWidth={3} />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Apply Changes Button */}
      {hasChanges && (
        <View style={styles.applySection}>
          <TouchableOpacity
            style={styles.applyButton}
            onPress={applyChanges}
            activeOpacity={0.8}
          >
            <Text style={styles.applyButtonText}>Apply Changes</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#8E8E93',
    fontWeight: '500',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F2F2F7',
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 17,
    fontFamily: 'Inter-SemiBold',
    color: '#1D1D1F',
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: -0.4,
  },
  headerSpacer: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  descriptionSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
  },
  description: {
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    color: '#1D1D1F',
    lineHeight: 20,
    marginBottom: 8,
  },
  selectionCount: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: '#007AFF',
    fontWeight: '500',
  },
  nutrientsGrid: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  nutrientCard: {
    width: (screenWidth - 56) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    position: 'relative',
    minHeight: 100,
    justifyContent: 'center',
  },
  nutrientCardSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#F0F8FF',
  },
  nutrientCardDisabled: {
    opacity: 0.4,
  },
  nutrientContent: {
    alignItems: 'center',
  },
  nutrientEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  nutrientName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1D1D1F',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  nutrientNameSelected: {
    color: '#007AFF',
  },
  nutrientNameDisabled: {
    color: '#8E8E93',
  },
  nutrientUnit: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    color: '#8E8E93',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  nutrientUnitDisabled: {
    color: '#C7C7CC',
  },
  checkmark: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  applySection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  applyButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  applyButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    fontWeight: '600',
  },
});