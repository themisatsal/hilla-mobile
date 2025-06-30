import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Droplets, MessageCircle, Plus, Sparkles, Calendar, TrendingUp, ChevronRight, Heart, Zap, Target, Sun, Moon } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from 'expo-router';
import NutritionRing from '@/components/NutritionRing';
import DailyTip from '@/components/DailyTip';
import QuickAddButton from '@/components/QuickAddButton';
import HillaLogo from '@/components/HillaLogo';
import { useOnboardingState } from '@/hooks/useOnboardingState';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback } from 'react';

const TRACKING_SETTINGS_KEY = '@hilla_nutrition_tracking_settings';

// Mock logged meals data - in real app this would come from a database
const mockLoggedMeals = [
  {
    id: '1',
    name: 'Greek Yogurt with Berries',
    time: '8:30 AM',
    nutrients: {
      iron: 2.1, // mg
      dha: 0.05, // g
      folate: 15, // mcg
      calcium: 150, // mg
      protein: 15, // g
      fiber: 3, // g
    }
  },
  {
    id: '2',
    name: 'Prenatal Vitamin',
    time: '8:00 AM',
    nutrients: {
      iron: 18, // mg
      dha: 0.2, // g
      folate: 400, // mcg
      calcium: 200, // mg
      protein: 0, // g
      fiber: 0, // g
    }
  },
  {
    id: '3',
    name: 'Spinach Smoothie',
    time: '7:45 AM',
    nutrients: {
      iron: 3.5, // mg
      dha: 0.1, // g
      folate: 58, // mcg
      calcium: 99, // mg
      protein: 8, // g
      fiber: 4, // g
    }
  },
];

// Daily targets based on pregnancy stage
const getDailyTargets = (stage: string) => {
  switch (stage) {
    case 'ttc':
      return { iron: 18, dha: 1.4, folate: 400, calcium: 1000, protein: 46, fiber: 25 };
    case 't1':
    case 't2':
    case 't3':
      return { iron: 25, dha: 1.5, folate: 400, calcium: 1000, protein: 75, fiber: 28 };
    case 'postpartum':
      return { iron: 20, dha: 1.5, folate: 500, calcium: 1000, protein: 71, fiber: 25 };
    default:
      return { iron: 25, dha: 1.5, folate: 400, calcium: 1000, protein: 75, fiber: 28 };
  }
};

// Calculate total nutrients from logged meals
const calculateTotalNutrients = (meals: typeof mockLoggedMeals) => {
  return meals.reduce((totals, meal) => {
    Object.keys(meal.nutrients).forEach(nutrient => {
      totals[nutrient] = (totals[nutrient] || 0) + meal.nutrients[nutrient as keyof typeof meal.nutrients];
    });
    return totals;
  }, {} as Record<string, number>);
};

const getResponsiveDimensions = () => {
  const { width, height } = Dimensions.get('window');
  return {
    width,
    height,
    isTablet: width >= 768,
    isDesktop: width >= 1024,
    isSmall: width < 375,
  };
};

export default function HomeScreen() {
  const router = useRouter();
  const { state, isLoaded } = useOnboardingState();
  const [displayName, setDisplayName] = useState('Sarah');
  const [timeOfDay, setTimeOfDay] = useState('morning');
  const [dimensions, setDimensions] = useState(getResponsiveDimensions());
  const [selectedMetrics, setSelectedMetrics] = useState(['iron', 'dha', 'folate']);
  const insets = useSafeAreaInsets();
  
  // Calculate actual nutrient totals from logged meals
  const totalNutrients = calculateTotalNutrients(mockLoggedMeals);
  const dailyTargets = getDailyTargets(state.selectedStage || 't2');

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', () => {
      setDimensions(getResponsiveDimensions());
    });
    return () => subscription?.remove();
  }, []);

  // Load tracking settings
  useEffect(() => {
    loadTrackingSettings();
  }, []);

  // Listen for changes when returning from settings
  useFocusEffect(
    useCallback(() => {
      console.log('Home screen focused, reloading tracking settings');
      loadTrackingSettings();
    }, [])
  );

  const loadTrackingSettings = async () => {
    try {
      const stored = await AsyncStorage.getItem(TRACKING_SETTINGS_KEY);
      if (stored) {
        const settings = JSON.parse(stored);
        if (Array.isArray(settings.selectedMetrics) && settings.selectedMetrics.length <= 3) {
          console.log('Loaded tracking settings:', settings.selectedMetrics);
          setSelectedMetrics([...settings.selectedMetrics]); // Create new array to force re-render
        }
      } else {
        console.log('No stored settings, using defaults');
        setSelectedMetrics(['iron', 'dha', 'folate']);
      }
    } catch (error) {
      console.error('Error loading tracking settings:', error);
      setSelectedMetrics(['iron', 'dha', 'folate']);
    }
  };

  useEffect(() => {
    if (isLoaded && state.name) {
      setDisplayName(state.name);
    }
    
    // Set time of day for dynamic theming
    const hour = new Date().getHours();
    if (hour < 6) setTimeOfDay('night');
    else if (hour < 12) setTimeOfDay('morning');
    else if (hour < 18) setTimeOfDay('afternoon');
    else setTimeOfDay('evening');
  }, [isLoaded, state.name]);

  // Calculate bottom padding to account for the tab bar
  const getBottomPadding = () => {
    const baseTabHeight = 90;
    const extraPadding = 40;
    
    return Platform.select({
      ios: baseTabHeight + Math.max(insets.bottom + 30, extraPadding),
      android: baseTabHeight + extraPadding,
      web: baseTabHeight + extraPadding,
      default: baseTabHeight + extraPadding,
    });
  };

  // Get time-based greeting and theme
  const getTimeBasedContent = () => {
    switch (timeOfDay) {
      case 'morning':
        return {
          greeting: 'Good morning',
          icon: Sun,
          accentColor: '#FF9500',
          secondaryColor: '#FFB7C5'
        };
      case 'afternoon':
        return {
          greeting: 'Good afternoon',
          icon: Sun,
          accentColor: '#007AFF',
          secondaryColor: '#FF9500'
        };
      case 'evening':
        return {
          greeting: 'Good evening',
          icon: Moon,
          accentColor: '#FF3B30',
          secondaryColor: '#007AFF'
        };
      default:
        return {
          greeting: 'Hello',
          icon: Moon,
          accentColor: '#8E8E93',
          secondaryColor: '#9CA3AF'
        };
    }
  };

  // Get nutrient display info
  const getNutrientInfo = (metricId: string) => {
    const nutrientMap: Record<string, { emoji: string; label: string; color: string }> = {
      iron: { emoji: '🩸', label: 'Iron', color: '#FF9500' },
      dha: { emoji: '🐟', label: 'DHA', color: '#007AFF' },
      folate: { emoji: '🥬', label: 'Folate', color: '#34C759' },
      calcium: { emoji: '🦴', label: 'Calcium', color: '#007AFF' },
      protein: { emoji: '🥩', label: 'Protein', color: '#FF3B30' },
      fiber: { emoji: '🌾', label: 'Fiber', color: '#8E8E93' },
      vitamin_d: { emoji: '☀️', label: 'Vitamin D', color: '#FFD60A' },
      choline: { emoji: '🥚', label: 'Choline', color: '#FFD60A' },
      zinc: { emoji: '🥜', label: 'Zinc', color: '#8E8E93' },
      magnesium: { emoji: '🌿', label: 'Magnesium', color: '#34C759' },
      omega3: { emoji: '🐠', label: 'Omega-3', color: '#007AFF' },
      vitamin_b6: { emoji: '💊', label: 'B6', color: '#8A6DFF' },
    };
    return nutrientMap[metricId] || { emoji: '📊', label: metricId, color: '#8E8E93' };
  };

  // Format target text
  const getTargetText = (metricId: string, current: number, target: number) => {
    if (current >= target) {
      return 'Target met!';
    }
    
    const remaining = target - current;
    const unit = metricId === 'folate' ? 'mcg' : 
                 metricId === 'dha' ? 'g' : 'mg';
    
    if (metricId === 'folate') {
      return `${Math.round(remaining)}${unit} more`;
    } else if (metricId === 'dha') {
      return `${remaining.toFixed(1)}${unit} more`;
    } else {
      return `${remaining.toFixed(1)}${unit} more`;
    }
  };

  const timeContent = getTimeBasedContent();
  const IconComponent = timeContent.icon;

  // Get stage-specific content
  const getStageContent = () => {
    const stage = state.selectedStage || 't2';
    switch (stage) {
      case 'ttc':
        return {
          subtitle: 'Trying to Conceive',
          weekInfo: null,
          primaryNutrient: 'Folate',
          primaryValue: 380,
          primaryTarget: 400,
          primaryUnit: 'mcg',
          stageColor: '#007AFF',
          stageEmoji: '🌱'
        };
      case 't1':
        return {
          subtitle: 'First Trimester',
          weekInfo: 'Week 8',
          primaryNutrient: 'Folate',
          primaryValue: 336,
          primaryTarget: 400,
          primaryUnit: 'mcg',
          stageColor: '#34C759',
          stageEmoji: '💚'
        };
      case 't2':
        return {
          subtitle: 'Second Trimester',
          weekInfo: 'Week 18',
          primaryNutrient: 'Iron',
          primaryValue: 18,
          primaryTarget: 25,
          primaryUnit: 'mg',
          stageColor: '#FF9500',
          stageEmoji: '🧡'
        };
      case 't3':
        return {
          subtitle: 'Third Trimester',
          weekInfo: 'Week 32',
          primaryNutrient: 'Iron',
          primaryValue: 22,
          primaryTarget: 25,
          primaryUnit: 'mg',
          stageColor: '#FF3B30',
          stageEmoji: '💖'
        };
      case 'postpartum':
        return {
          subtitle: 'Postpartum Recovery',
          weekInfo: '6 weeks postpartum',
          primaryNutrient: 'Iron',
          primaryValue: 15,
          primaryTarget: 20,
          primaryUnit: 'mg',
          stageColor: '#34C759',
          stageEmoji: '🌸'
        };
      default:
        return {
          subtitle: 'Second Trimester',
          weekInfo: 'Week 18',
          primaryNutrient: 'Iron',
          primaryValue: 18,
          primaryTarget: 25,
          primaryUnit: 'mg',
          stageColor: '#FF9500',
          stageEmoji: '🧡'
        };
    }
  };

  const stageContent = getStageContent();
  const percentage = Math.round((stageContent.primaryValue / stageContent.primaryTarget) * 100);

  // Get responsive styles
  const getResponsiveStyles = () => {
    const { isTablet, isDesktop, isSmall } = dimensions;
    
    return {
      containerPadding: isDesktop ? 48 : isTablet ? 32 : isSmall ? 16 : 20,
      maxWidth: isDesktop ? 1200 : isTablet ? 800 : '100%',
      fontSize: {
        greeting: isDesktop ? 42 : isTablet ? 38 : isSmall ? 28 : 32,
        sectionTitle: isDesktop ? 28 : isTablet ? 26 : isSmall ? 18 : 20,
      },
    };
  };

  const responsiveStyles = getResponsiveStyles();

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'log':
        router.push('/(tabs)/log');
        break;
      case 'water':
        Alert.alert('Water Added', 'Added 8 fl oz of water to your log!');
        break;
      case 'ask':
        router.push('/ask-hilla');
        break;
      case 'plan':
        Alert.alert('Meal Planning', 'Opening meal planning feature...');
        break;
      default:
        break;
    }
  };

  const handleViewDetails = () => {
    router.push('/detailed-analytics');
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <View style={[styles.contentWrapper, { 
          maxWidth: responsiveStyles.maxWidth,
          alignSelf: 'center',
          width: '100%'
        }]}>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            { 
              paddingBottom: getBottomPadding(),
              paddingHorizontal: responsiveStyles.containerPadding
            }
          ]}
          bounces={true}
          scrollEventThrottle={16}
        >
          {/* Header */}
          <View style={[styles.header, { paddingHorizontal: 0 }]}>
            <View style={styles.headerTop}>
              <View style={styles.logoSection}>
                <HillaLogo size="small" variant="wordmark" />
                <View style={styles.timeIndicator}>
                  <IconComponent size={14} color={timeContent.accentColor} />
                  <View style={[styles.liveDot, { backgroundColor: timeContent.accentColor }]} />
                </View>
              </View>
              
              <TouchableOpacity style={[styles.profileButton, { 
                backgroundColor: stageContent.stageColor
              }]} activeOpacity={0.8} onPress={() => router.push('/(tabs)/profile')}>
                <Text style={styles.profileText}>{displayName.charAt(0).toUpperCase()}</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.greetingSection}>
              <Text style={[styles.greeting, { 
                color: timeContent.accentColor,
                fontSize: responsiveStyles.fontSize.greeting
              }]}>
                {timeContent.greeting}, {displayName}
              </Text>
              <View style={styles.stageInfo}>
                <Text style={styles.stageEmoji}>{stageContent.stageEmoji}</Text>
                <Text style={[styles.stageText, { color: stageContent.stageColor }]}>
                  {stageContent.subtitle}
                </Text>
                {stageContent.weekInfo && (
                  <>
                    <View style={[styles.stageDivider, { backgroundColor: stageContent.stageColor }]} />
                    <Text style={styles.weekText}>{stageContent.weekInfo}</Text>
                  </>
                )}
              </View>
            </View>
          </View>

          {/* Wellness Card */}
          <View style={[styles.wellnessSection, { paddingHorizontal: 0 }]}>
            <View style={styles.wellnessCard}>
              <View style={styles.wellnessHeader}>
                <View style={styles.wellnessTitleSection}>
                  <Text style={styles.wellnessTitle}>Your Wellness Today</Text>
                  <TouchableOpacity onPress={handleViewDetails} style={styles.viewDetailsButton}>
                    <Text style={styles.viewDetailsText}>View Details</Text>
                    <ChevronRight size={14} color="#007AFF" />
                  </TouchableOpacity>
                </View>
              </View>
              
              <View style={styles.wellnessContent}>
                <View style={styles.ringSection}>
                  <NutritionRing 
                    percentage={82}
                    label="Wellness Score"
                    current={82}
                    target={100}
                    unit=""
                    accentColor="#FF9500"
                  />
                </View>
                
                <View style={styles.wellnessMetrics}>
                  {selectedMetrics.slice(0, 3).map((metricId) => {
                    const nutrientInfo = getNutrientInfo(metricId);
                    const current = totalNutrients[metricId] || 0;
                    const target = dailyTargets[metricId] || 1;
                    const percentage = Math.round((current / target) * 100);
                    
                    console.log(`Rendering metric: ${metricId}, current: ${current}, target: ${target}, percentage: ${percentage}`);
                    
                    return (
                      <View key={metricId} style={styles.metricItem}>
                        <Text style={styles.metricEmoji}>{nutrientInfo.emoji}</Text>
                        <Text style={styles.metricLabel}>{nutrientInfo.label}</Text>
                        <Text style={[styles.metricValue, { color: nutrientInfo.color }]}>
                          {percentage}%
                        </Text>
                        <Text style={styles.metricTarget}>
                          {getTargetText(metricId, current, target)}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            </View>
          </View>

          {/* Daily Tip */}
          <View style={[styles.tipSection, { paddingHorizontal: 0 }]}>
            <DailyTip 
              tip="Iron needs peak during this trimester. Pair iron-rich foods like spinach with vitamin C sources like bell peppers for optimal absorption."
              category="Nutrition Science"
              source="American College of Obstetricians and Gynecologists"
              accentColor={stageContent.stageColor}
            />
          </View>

          {/* Quick Actions */}
          <View style={[styles.section, { paddingHorizontal: 0 }]}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { fontSize: responsiveStyles.fontSize.sectionTitle }]}>Quick Actions</Text>
              <TouchableOpacity style={[styles.customizeButton, {
                backgroundColor: `${timeContent.accentColor}15`
              }]} activeOpacity={0.7}>
                <Text style={[styles.customizeText, { color: timeContent.accentColor }]}>Customize</Text>
              </TouchableOpacity>
            </View>
            
            <View style={[styles.quickActionsGrid, dimensions.isTablet && styles.quickActionsGridTablet]}>
              <QuickAddButton 
                icon={<Plus size={20} color="#34C759" />}
                label="Log Meal"
                backgroundColor="rgba(52, 199, 89, 0.1)"
                borderColor="rgba(52, 199, 89, 0.2)"
                onPress={() => handleQuickAction('log')}
              />
              <QuickAddButton 
                icon={<Droplets size={20} color="#007AFF" />}
                label="Add Water"
                backgroundColor="rgba(0, 122, 255, 0.1)"
                borderColor="rgba(0, 122, 255, 0.2)"
                onPress={() => handleQuickAction('water')}
              />
              <QuickAddButton 
                icon={<MessageCircle size={20} color="#FF9500" />}
                label="Ask Hilla"
                backgroundColor="rgba(255, 149, 0, 0.1)"
                borderColor="rgba(255, 149, 0, 0.2)"
                onPress={() => handleQuickAction('ask')}
              />
              <QuickAddButton 
                icon={<Calendar size={20} color="#007AFF" />}
                label="Plan Meals"
                backgroundColor="rgba(0, 122, 255, 0.1)"
                borderColor="rgba(0, 122, 255, 0.2)"
                onPress={() => handleQuickAction('plan')}
              />
            </View>
          </View>

         

          {/* Weekly Insights */}
          <View style={[styles.section, { paddingHorizontal: 0 }]}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { fontSize: responsiveStyles.fontSize.sectionTitle }]}>This Week's Insights</Text>
            </View>
            
            <View style={styles.weeklyInsightCard}>
              <View style={styles.weeklyHeader}>
                <View style={[styles.weeklyIconContainer, { 
                  backgroundColor: `${stageContent.stageColor}15`
                }]}>
                  <TrendingUp size={18} color={stageContent.stageColor} />
                </View>
                <View style={styles.weeklyContent}>
                  <Text style={styles.weeklyTitle}>Iron intake improved 15%</Text>
                  <Text style={styles.weeklySubtitle}>Thursday was your strongest day</Text>
                </View>
                <View style={[styles.weeklyBadge, {
                  backgroundColor: `${stageContent.stageColor}15`
                }]}>
                  <Text style={[styles.weeklyBadgeText, { color: stageContent.stageColor }]}>+15%</Text>
                </View>
              </View>
              <Text style={styles.weeklyDescription}>
                Your iron absorption is optimizing beautifully. Consider adding more vitamin C-rich foods to maximize benefits.
              </Text>
            </View>
          </View>
        </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  safeArea: {
    flex: 1,
  },
  contentWrapper: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 32,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
  },
  logoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  timeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  profileText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    fontWeight: '700',
  },
  greetingSection: {
    gap: 16,
  },
  greeting: {
    fontFamily: 'Inter-Bold',
    letterSpacing: -1.2,
    lineHeight: 38,
    fontWeight: '700',
  },
  stageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stageEmoji: {
    fontSize: 18,
  },
  stageText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    letterSpacing: -0.2,
    fontWeight: '600',
  },
  stageDivider: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  weekText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#8E8E93',
    fontWeight: '500',
  },
  wellnessSection: {
    marginBottom: 24,
  },
  wellnessCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  wellnessHeader: {
    marginBottom: 20,
  },
  wellnessTitleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  wellnessTitle: {
    fontSize: 22,
    fontFamily: 'Inter-Bold',
    color: '#1D1D1F',
    fontWeight: '700',
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
  },
  viewDetailsText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#007AFF',
    fontWeight: '600',
  },
  wellnessContent: {
    gap: 20,
  },
  ringSection: {
    alignItems: 'center',
  },
  wellnessMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
  },
  metricItem: {
    alignItems: 'center',
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#FAFBFC',
    minWidth: 80,
  },
  metricEmoji: {
    fontSize: 20,
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    color: '#8E8E93',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: '500',
  },
  metricValue: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    fontWeight: '700',
    marginBottom: 2,
  },
  metricTarget: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
    textAlign: 'center',
  },
  tipSection: {
    marginBottom: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    color: '#1D1D1F',
    fontWeight: '700',
  },
  customizeButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  customizeText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    fontWeight: '600',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  quickActionsGridTablet: {
    justifyContent: 'flex-start',
  },
  trendsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  trendsText: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    fontWeight: '600',
  },
  progressCards: {
    gap: 16,
  },
  progressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#1D1D1F',
    fontWeight: '600',
  },
  progressPercent: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    fontWeight: '700',
  },
  progressBarContainer: {
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#F2F2F7',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressDetail: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
  },
  weeklyInsightCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  weeklyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  weeklyIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  weeklyContent: {
    flex: 1,
  },
  weeklyTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#1D1D1F',
    marginBottom: 2,
    fontWeight: '700',
  },
  weeklySubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
  },
  weeklyBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  weeklyBadgeText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    fontWeight: '700',
  },
  weeklyDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
    lineHeight: 20,
  },
});