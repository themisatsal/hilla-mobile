import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, TrendingUp, Calendar, Download, Share2, Filter, ChevronDown, Info, Target, Zap, Award } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import TrendChart from '@/components/TrendChart';
import { useOnboardingState } from '@/hooks/useOnboardingState';

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

// Mock data for the last 30 days
const generateMockData = () => {
  const days = [];
  const today = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Generate realistic nutrition data with some variation
    const baseIron = 20 + Math.random() * 10;
    const baseDHA = 1.2 + Math.random() * 0.6;
    const baseFolate = 350 + Math.random() * 100;
    const baseCalcium = 800 + Math.random() * 400;
    const baseProtein = 60 + Math.random() * 30;
    const baseFiber = 20 + Math.random() * 15;
    
    days.push({
      date: date.toISOString().split('T')[0],
      dayName: date.toLocaleDateString('en', { weekday: 'short' }),
      iron: Math.round(baseIron * 10) / 10,
      dha: Math.round(baseDHA * 100) / 100,
      folate: Math.round(baseFolate),
      calcium: Math.round(baseCalcium),
      protein: Math.round(baseProtein),
      fiber: Math.round(baseFiber),
      wellness: Math.round(70 + Math.random() * 25),
      meals: Math.floor(2 + Math.random() * 3),
      water: Math.floor(6 + Math.random() * 4),
    });
  }
  
  return days;
};

const mockData = generateMockData();

// Get targets based on pregnancy stage
const getTargets = (stage: string) => {
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

const nutrients = [
  { id: 'iron', name: 'Iron', emoji: '🩸', unit: 'mg', color: '#FF3B30' },
  { id: 'dha', name: 'DHA', emoji: '🐟', unit: 'g', color: '#007AFF' },
  { id: 'folate', name: 'Folate', emoji: '🥬', unit: 'mcg', color: '#34C759' },
  { id: 'calcium', name: 'Calcium', emoji: '🦴', unit: 'mg', color: '#8A6DFF' },
  { id: 'protein', name: 'Protein', emoji: '🥩', unit: 'g', color: '#FF9500' },
  { id: 'fiber', name: 'Fiber', emoji: '🌾', unit: 'g', color: '#8E8E93' },
];

export default function DetailedAnalyticsScreen() {
  const router = useRouter();
  const { state } = useOnboardingState();
  const [dimensions, setDimensions] = useState(getResponsiveDimensions());
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedNutrient, setSelectedNutrient] = useState('iron');
  const [showInsights, setShowInsights] = useState(true);

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', () => {
      setDimensions(getResponsiveDimensions());
    });
    return () => subscription?.remove();
  }, []);

  const targets = getTargets(state.selectedStage || 't2');
  const selectedNutrientData = nutrients.find(n => n.id === selectedNutrient);

  // Calculate analytics
  const getAnalytics = () => {
    const recentData = mockData.slice(-7); // Last 7 days
    const previousData = mockData.slice(-14, -7); // Previous 7 days
    
    const currentAvg = recentData.reduce((sum, day) => sum + day[selectedNutrient as keyof typeof day], 0) / recentData.length;
    const previousAvg = previousData.reduce((sum, day) => sum + day[selectedNutrient as keyof typeof day], 0) / previousData.length;
    
    const change = ((currentAvg - previousAvg) / previousAvg) * 100;
    const target = targets[selectedNutrient as keyof typeof targets];
    const targetPercentage = (currentAvg / target) * 100;
    
    // Calculate streak
    let streak = 0;
    for (let i = mockData.length - 1; i >= 0; i--) {
      if (mockData[i][selectedNutrient as keyof typeof mockData[i]] >= target) {
        streak++;
      } else {
        break;
      }
    }
    
    return {
      currentAvg: Math.round(currentAvg * 100) / 100,
      change: Math.round(change * 10) / 10,
      targetPercentage: Math.round(targetPercentage),
      streak,
      target,
    };
  };

  const analytics = getAnalytics();

  // Get responsive styles
  const getResponsiveStyles = () => {
    const { isTablet, isDesktop, isSmall } = dimensions;
    
    return {
      containerPadding: isDesktop ? 48 : isTablet ? 32 : isSmall ? 16 : 20,
      maxWidth: isDesktop ? 1200 : isTablet ? 800 : '100%',
      fontSize: {
        title: isDesktop ? 32 : isTablet ? 28 : isSmall ? 24 : 28,
        sectionTitle: isDesktop ? 24 : isTablet ? 22 : isSmall ? 18 : 20,
      },
    };
  };

  const responsiveStyles = getResponsiveStyles();

  // Generate insights based on data
  const generateInsights = () => {
    const insights = [];
    
    if (analytics.streak >= 3) {
      insights.push({
        type: 'success',
        title: `${analytics.streak}-day streak!`,
        description: `You've met your ${selectedNutrientData?.name} target for ${analytics.streak} consecutive days.`,
        icon: Award,
        color: '#34C759'
      });
    }
    
    if (analytics.change > 10) {
      insights.push({
        type: 'improvement',
        title: 'Great progress',
        description: `Your ${selectedNutrientData?.name} intake improved by ${analytics.change}% this week.`,
        icon: TrendingUp,
        color: '#007AFF'
      });
    } else if (analytics.change < -10) {
      insights.push({
        type: 'attention',
        title: 'Needs attention',
        description: `Your ${selectedNutrientData?.name} intake decreased by ${Math.abs(analytics.change)}% this week.`,
        icon: Target,
        color: '#FF9500'
      });
    }
    
    if (analytics.targetPercentage < 70) {
      insights.push({
        type: 'recommendation',
        title: 'Boost your intake',
        description: `Consider adding more ${selectedNutrientData?.name}-rich foods to reach your daily target.`,
        icon: Zap,
        color: '#8A6DFF'
      });
    }
    
    return insights.slice(0, 3); // Limit to 3 insights
  };

  const insights = generateInsights();

  const chartData = mockData.slice(-14).map(day => ({
    label: day.dayName,
    value: day[selectedNutrient as keyof typeof day] as number
  }));

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.contentWrapper, { 
        maxWidth: responsiveStyles.maxWidth,
        alignSelf: 'center',
        width: '100%'
      }]}>
        {/* Header */}
        <View style={[styles.header, { paddingHorizontal: responsiveStyles.containerPadding }]}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color="#1D1D1F" />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={[styles.headerTitle, { fontSize: responsiveStyles.fontSize.title }]}>
              Detailed Analytics
            </Text>
            <Text style={styles.headerSubtitle}>Complete nutrition insights</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerButton}>
              <Share2 size={18} color="#8E8E93" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton}>
              <Download size={18} color="#8E8E93" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scrollContent, { 
            paddingHorizontal: responsiveStyles.containerPadding 
          }]}
        >
          {/* Period Selector */}
          <View style={styles.periodSection}>
            <View style={styles.periodContainer}>
              {[
                { id: '7d', label: '7 Days' },
                { id: '30d', label: '30 Days' },
                { id: '3m', label: '3 Months' }
              ].map((period) => (
                <TouchableOpacity
                  key={period.id}
                  style={[
                    styles.periodButton,
                    selectedPeriod === period.id && styles.periodButtonActive
                  ]}
                  onPress={() => setSelectedPeriod(period.id)}
                >
                  <Text style={[
                    styles.periodText,
                    selectedPeriod === period.id && styles.periodTextActive
                  ]}>
                    {period.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Nutrient Selector */}
          <View style={styles.nutrientSection}>
            <Text style={[styles.sectionTitle, { fontSize: responsiveStyles.fontSize.sectionTitle }]}>
              Select Nutrient
            </Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.nutrientScrollContent}
            >
              {nutrients.map((nutrient) => (
                <TouchableOpacity
                  key={nutrient.id}
                  style={[
                    styles.nutrientChip,
                    selectedNutrient === nutrient.id && [
                      styles.nutrientChipActive,
                      { backgroundColor: `${nutrient.color}15`, borderColor: nutrient.color }
                    ]
                  ]}
                  onPress={() => setSelectedNutrient(nutrient.id)}
                >
                  <Text style={styles.nutrientEmoji}>{nutrient.emoji}</Text>
                  <Text style={[
                    styles.nutrientChipText,
                    selectedNutrient === nutrient.id && { color: nutrient.color }
                  ]}>
                    {nutrient.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Key Metrics */}
          <View style={styles.metricsSection}>
            <Text style={[styles.sectionTitle, { fontSize: responsiveStyles.fontSize.sectionTitle }]}>
              Key Metrics
            </Text>
            <View style={styles.metricsGrid}>
              <View style={styles.metricCard}>
                <Text style={styles.metricValue}>
                  {analytics.currentAvg}{selectedNutrientData?.unit}
                </Text>
                <Text style={styles.metricLabel}>7-day average</Text>
                <View style={[styles.metricChange, analytics.change >= 0 ? styles.metricChangePositive : styles.metricChangeNegative]}>
                  <TrendingUp size={12} color={analytics.change >= 0 ? '#34C759' : '#FF3B30'} />
                  <Text style={[styles.metricChangeText, { color: analytics.change >= 0 ? '#34C759' : '#FF3B30' }]}>
                    {analytics.change >= 0 ? '+' : ''}{analytics.change}%
                  </Text>
                </View>
              </View>

              <View style={styles.metricCard}>
                <Text style={styles.metricValue}>{analytics.targetPercentage}%</Text>
                <Text style={styles.metricLabel}>Target achievement</Text>
                <Text style={styles.metricTarget}>
                  Target: {analytics.target}{selectedNutrientData?.unit}
                </Text>
              </View>

              <View style={styles.metricCard}>
                <Text style={styles.metricValue}>{analytics.streak}</Text>
                <Text style={styles.metricLabel}>Day streak</Text>
                <Text style={styles.metricTarget}>
                  {analytics.streak > 0 ? 'Keep it up!' : 'Start today'}
                </Text>
              </View>
            </View>
          </View>

          {/* Chart */}
          <View style={styles.chartSection}>
            <View style={styles.chartHeader}>
              <Text style={[styles.sectionTitle, { fontSize: responsiveStyles.fontSize.sectionTitle }]}>
                {selectedNutrientData?.name} Trend (Last 2 Weeks)
              </Text>
              <TouchableOpacity style={styles.chartInfo}>
                <Info size={16} color="#8E8E93" />
              </TouchableOpacity>
            </View>
            
            <TrendChart 
              data={chartData}
              target={analytics.target}
              color={selectedNutrientData?.color || '#007AFF'}
            />
            
            <View style={styles.chartLegend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: selectedNutrientData?.color }]} />
                <Text style={styles.legendText}>Daily intake</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#FF9500' }]} />
                <Text style={styles.legendText}>Target line</Text>
              </View>
            </View>
          </View>

          {/* AI Insights */}
          {showInsights && insights.length > 0 && (
            <View style={styles.insightsSection}>
              <View style={styles.insightsHeader}>
                <Text style={[styles.sectionTitle, { fontSize: responsiveStyles.fontSize.sectionTitle }]}>
                  AI Insights
                </Text>
                <TouchableOpacity 
                  style={styles.toggleInsights}
                  onPress={() => setShowInsights(!showInsights)}
                >
                  <ChevronDown 
                    size={16} 
                    color="#8E8E93" 
                    style={{ transform: [{ rotate: showInsights ? '180deg' : '0deg' }] }}
                  />
                </TouchableOpacity>
              </View>
              
              <View style={styles.insightsContainer}>
                {insights.map((insight, index) => {
                  const IconComponent = insight.icon;
                  return (
                    <View key={index} style={styles.insightCard}>
                      <View style={[styles.insightIcon, { backgroundColor: `${insight.color}15` }]}>
                        <IconComponent size={16} color={insight.color} />
                      </View>
                      <View style={styles.insightContent}>
                        <Text style={styles.insightTitle}>{insight.title}</Text>
                        <Text style={styles.insightDescription}>{insight.description}</Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          {/* Detailed Breakdown */}
          <View style={styles.breakdownSection}>
            <Text style={[styles.sectionTitle, { fontSize: responsiveStyles.fontSize.sectionTitle }]}>
              Weekly Breakdown
            </Text>
            
            <View style={styles.weeklyStats}>
              <View style={styles.weeklyStatCard}>
                <Text style={styles.weeklyStatValue}>
                  {mockData.slice(-7).filter(day => day[selectedNutrient as keyof typeof day] >= analytics.target).length}
                </Text>
                <Text style={styles.weeklyStatLabel}>Days target met</Text>
              </View>
              
              <View style={styles.weeklyStatCard}>
                <Text style={styles.weeklyStatValue}>
                  {Math.round(mockData.slice(-7).reduce((sum, day) => sum + day.meals, 0) / 7)}
                </Text>
                <Text style={styles.weeklyStatLabel}>Avg meals logged</Text>
              </View>
              
              <View style={styles.weeklyStatCard}>
                <Text style={styles.weeklyStatValue}>
                  {Math.round(mockData.slice(-7).reduce((sum, day) => sum + day.wellness, 0) / 7)}%
                </Text>
                <Text style={styles.weeklyStatLabel}>Avg wellness score</Text>
              </View>
            </View>
          </View>

          {/* Recommendations */}
          <View style={styles.recommendationsSection}>
            <Text style={[styles.sectionTitle, { fontSize: responsiveStyles.fontSize.sectionTitle }]}>
              Personalized Recommendations
            </Text>
            
            <View style={styles.recommendationCard}>
              <View style={styles.recommendationHeader}>
                <Text style={styles.recommendationEmoji}>💡</Text>
                <Text style={styles.recommendationTitle}>Optimize your {selectedNutrientData?.name} intake</Text>
              </View>
              <Text style={styles.recommendationText}>
                {selectedNutrient === 'iron' && 
                  "Pair iron-rich foods with vitamin C sources like bell peppers or citrus fruits to enhance absorption by up to 3x."
                }
                {selectedNutrient === 'dha' && 
                  "Include fatty fish like salmon or sardines 2-3 times per week, or consider a high-quality algae-based supplement."
                }
                {selectedNutrient === 'folate' && 
                  "Dark leafy greens, legumes, and fortified grains are excellent sources. Cook vegetables lightly to preserve folate."
                }
                {selectedNutrient === 'calcium' && 
                  "Spread calcium intake throughout the day for better absorption. Include dairy, fortified plant milks, or leafy greens."
                }
                {selectedNutrient === 'protein' && 
                  "Include protein at each meal to support baby's growth and maintain your energy levels throughout the day."
                }
                {selectedNutrient === 'fiber' && 
                  "Gradually increase fiber intake with plenty of water to support digestion and prevent pregnancy constipation."
                }
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  contentWrapper: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
    marginLeft: 16,
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    color: '#1D1D1F',
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  periodSection: {
    paddingVertical: 20,
  },
  periodContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
  },
  periodButtonActive: {
    backgroundColor: '#007AFF',
  },
  periodText: {
    fontSize: 15,
    fontFamily: 'Inter-Medium',
    color: '#8E8E93',
    fontWeight: '600',
  },
  periodTextActive: {
    color: '#FFFFFF',
  },
  nutrientSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    color: '#1D1D1F',
    marginBottom: 16,
    fontWeight: '700',
  },
  nutrientScrollContent: {
    paddingRight: 20,
  },
  nutrientChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  nutrientChipActive: {
    borderWidth: 2,
  },
  nutrientEmoji: {
    fontSize: 16,
    marginRight: 8,
  },
  nutrientChipText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1D1D1F',
    fontWeight: '600',
  },
  metricsSection: {
    marginBottom: 32,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  metricValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1D1D1F',
    fontWeight: '700',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#8E8E93',
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 8,
  },
  metricChange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  metricChangePositive: {
    backgroundColor: '#F0FDF4',
  },
  metricChangeNegative: {
    backgroundColor: '#FEF2F2',
  },
  metricChangeText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    fontWeight: '700',
  },
  metricTarget: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
    textAlign: 'center',
  },
  chartSection: {
    marginBottom: 32,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  chartInfo: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: '#8E8E93',
    fontWeight: '500',
  },
  insightsSection: {
    marginBottom: 32,
  },
  insightsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  toggleInsights: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  insightsContainer: {
    gap: 12,
  },
  insightCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  insightIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#1D1D1F',
    fontWeight: '700',
    marginBottom: 4,
  },
  insightDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
    lineHeight: 20,
  },
  breakdownSection: {
    marginBottom: 32,
  },
  weeklyStats: {
    flexDirection: 'row',
    gap: 12,
  },
  weeklyStatCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  weeklyStatValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#007AFF',
    fontWeight: '700',
    marginBottom: 4,
  },
  weeklyStatLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#8E8E93',
    fontWeight: '500',
    textAlign: 'center',
  },
  recommendationsSection: {
    marginBottom: 32,
  },
  recommendationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  recommendationEmoji: {
    fontSize: 20,
    marginRight: 12,
  },
  recommendationTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#1D1D1F',
    fontWeight: '700',
    flex: 1,
  },
  recommendationText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#1D1D1F',
    lineHeight: 20,
  },
});