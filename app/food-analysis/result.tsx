import React, { useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useAtomValue } from 'jotai';
import { analysisAtom } from '@/atoms/analysis';
import Animated, { useAnimatedStyle, withTiming, useSharedValue } from 'react-native-reanimated';
import { ChevronUp, ChevronDown, Plus, Save, Share2 } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const CollapsibleSection = ({ title, children }: { title: string; children: React.ReactNode }) => {
  const [isCollapsed, setIsCollapsed] = useState(false); 
  const rotation = useSharedValue(0);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    rotation.value = withTiming(isCollapsed ? 0 : 1, { duration: 300 });
  };

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value * 180}deg` }],
  }));

  return (
    <View style={styles.section}>
      <TouchableOpacity 
        onPress={toggleCollapse} 
        style={styles.sectionHeader}
        activeOpacity={0.7}
      >
        <Text style={styles.sectionTitle}>{title}</Text>
        <Animated.View style={iconStyle}>
          <ChevronUp size={24} color="#8E8E93" strokeWidth={2} />
        </Animated.View>
      </TouchableOpacity>
      {!isCollapsed && (
        <View style={styles.sectionContent}>
          {children}
        </View>
      )}
    </View>
  );
};

const NutritionItem = ({ label, value, color = '#1D1D1F' }: { label: string; value: string; color?: string }) => (
  <View style={styles.nutritionItem}>
    <Text style={styles.nutritionLabel}>{label}</Text>
    <Text style={[styles.nutritionValue, { color }]}>{value}</Text>
  </View>
);

export default function ResultScreen() {
  const analysis = useAtomValue(analysisAtom);
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  if (!analysis) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading analysis...</Text>
      </View>
    );
  }

  const handleSaveToLog = () => {
    setSaving(true);
    
    // Save to database
    const saveAnalysis = async () => {
      try {
        const response = await fetch('/api/food-analysis', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: '550e8400-e29b-41d4-a716-446655440000', // Sample user ID
            foodName: analysis.identifiedFood,
            imageUrl: analysis.image,
            portionSize: parseInt(analysis.portionSize),
            nutritionData: {
              perPortion: analysis.nutritionFactsPerPortion,
              per100g: analysis.nutritionFactsPer100g,
              additionalNotes: analysis.additionalNotes
            },
            savedToLog: true
          }),
        });
        
        const data = await response.json();
        
        if (data.success) {
          Alert.alert(
            "Saved to Log",
            `${analysis.identifiedFood} has been added to your meal log.`,
            [
              { 
                text: "OK", 
                onPress: () => router.push('/(tabs)/log')
              }
            ]
          );
        } else {
          throw new Error(data.error || 'Failed to save analysis');
        }
      } catch (error) {
        Alert.alert(
          "Error",
          "Failed to save analysis to log. Please try again."
        );
        console.error('Error saving analysis:', error);
      } finally {
        setSaving(false);
      }
    };
    
    saveAnalysis();
  };

  const handleShare = () => {
    Alert.alert(
      "Share Analysis",
      "Share this nutritional analysis with others.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Share", onPress: () => console.log("Share pressed") }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: analysis.image }} 
            style={styles.foodImage} 
            resizeMode="cover"
          />
        </View>
        
        <View style={styles.contentContainer}>
          <View style={styles.headerSection}>
            <Text style={styles.foodTitle}>{analysis.identifiedFood}</Text>
            <View style={styles.portionInfo}>
              <Text style={styles.portionText}>
                Portion: {analysis.portionSize}g
              </Text>
            </View>
          </View>
          
          <CollapsibleSection title="Nutrition Facts">
            <View style={styles.nutritionGrid}>
              <NutritionItem 
                label="Calories" 
                value={analysis.nutritionFactsPerPortion.calories} 
                color="#FF9500"
              />
              <NutritionItem 
                label="Protein" 
                value={`${analysis.nutritionFactsPerPortion.protein}g`} 
                color="#007AFF"
              />
              <NutritionItem 
                label="Carbs" 
                value={`${analysis.nutritionFactsPerPortion.carbs}g`} 
                color="#34C759"
              />
              <NutritionItem 
                label="Fat" 
                value={`${analysis.nutritionFactsPerPortion.fat}g`} 
                color="#FF3B30"
              />
              <NutritionItem 
                label="Fiber" 
                value={`${analysis.nutritionFactsPerPortion.fiber}g`}
              />
              <NutritionItem 
                label="Sugar" 
                value={`${analysis.nutritionFactsPerPortion.sugar}g`}
              />
              <NutritionItem 
                label="Sodium" 
                value={`${analysis.nutritionFactsPerPortion.sodium}mg`}
              />
              <NutritionItem 
                label="Cholesterol" 
                value={`${analysis.nutritionFactsPerPortion.cholesterol}mg`}
              />
            </View>
          </CollapsibleSection>
          
          <CollapsibleSection title="Per 100g">
            <View style={styles.nutritionGrid}>
              <NutritionItem 
                label="Calories" 
                value={analysis.nutritionFactsPer100g.calories} 
              />
              <NutritionItem 
                label="Protein" 
                value={`${analysis.nutritionFactsPer100g.protein}g`} 
              />
              <NutritionItem 
                label="Carbs" 
                value={`${analysis.nutritionFactsPer100g.carbs}g`} 
              />
              <NutritionItem 
                label="Fat" 
                value={`${analysis.nutritionFactsPer100g.fat}g`} 
              />
              <NutritionItem 
                label="Fiber" 
                value={`${analysis.nutritionFactsPer100g.fiber}g`}
              />
              <NutritionItem 
                label="Sugar" 
                value={`${analysis.nutritionFactsPer100g.sugar}g`}
              />
              <NutritionItem 
                label="Sodium" 
                value={`${analysis.nutritionFactsPer100g.sodium}mg`}
              />
              <NutritionItem 
                label="Cholesterol" 
                value={`${analysis.nutritionFactsPer100g.cholesterol}mg`}
              />
            </View>
          </CollapsibleSection>
          
          <CollapsibleSection title="Additional Information">
            <View style={styles.notesContainer}>
              {analysis.additionalNotes.map((note, index) => (
                <View key={index} style={styles.noteItem}>
                  <View style={styles.noteBullet} />
                  <Text style={styles.noteText}>{note}</Text>
                </View>
              ))}
            </View>
          </CollapsibleSection>
          
          <View style={styles.adjustSection}>
            <Text style={styles.adjustTitle}>Adjust Portion</Text>
            <View style={styles.adjustControls}>
              <TouchableOpacity style={styles.adjustButton}>
                <Text style={styles.adjustButtonText}>-</Text>
              </TouchableOpacity>
              <View style={styles.adjustValueContainer}>
                <Text style={styles.adjustValue}>{analysis.portionSize}g</Text>
              </View>
              <TouchableOpacity style={styles.adjustButton}>
                <Text style={styles.adjustButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
      
      <View style={styles.actionBar}>
        <TouchableOpacity 
          style={styles.shareButton}
          onPress={handleShare}
          activeOpacity={0.7}
        >
          <Share2 size={20} color="#007AFF" strokeWidth={2} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.saveButton}
          onPress={handleSaveToLog}
          activeOpacity={0.7}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Plus size={20} color="#FFFFFF" strokeWidth={2} />
              <Text style={styles.saveButtonText}>Add to Log</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
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
    backgroundColor: '#F2F2F7',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#8E8E93',
    marginTop: 16,
  },
  imageContainer: {
    height: 250,
    width: '100%',
    backgroundColor: '#000',
  },
  foodImage: {
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    padding: 20,
  },
  headerSection: {
    marginBottom: 24,
  },
  foodTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1D1D1F',
    marginBottom: 8,
    fontWeight: '700',
  },
  portionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  portionText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#8E8E93',
    fontWeight: '500',
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1D1D1F',
    fontWeight: '600',
  },
  sectionContent: {
    padding: 16,
    paddingTop: 0,
  },
  nutritionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  nutritionItem: {
    width: '50%',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  nutritionLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
    marginBottom: 4,
  },
  nutritionValue: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    fontWeight: '600',
  },
  notesContainer: {
    paddingTop: 8,
  },
  noteItem: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  noteBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#007AFF',
    marginTop: 7,
    marginRight: 12,
  },
  noteText: {
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    color: '#1D1D1F',
    flex: 1,
    lineHeight: 22,
  },
  adjustSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  adjustTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1D1D1F',
    marginBottom: 16,
    fontWeight: '600',
  },
  adjustControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', 
  },
  adjustButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  adjustButtonText: {
    fontSize: 24,
    fontFamily: 'Inter-SemiBold',
    color: '#007AFF',
    fontWeight: '600',
  },
  adjustValueContainer: {
    paddingHorizontal: 20,
    minWidth: 100,
    alignItems: 'center',
  },
  adjustValue: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1D1D1F',
    fontWeight: '700',
  },
  actionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  shareButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  saveButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 14,
    gap: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF', 
    fontWeight: '600',
  },
});