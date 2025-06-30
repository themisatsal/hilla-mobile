import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, TrendingUp, Award, Target, Zap, Brain, ChartBar as BarChart3, Filter, Sparkles, ChevronRight } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform } from 'react-native';
import TrendChart from '@/components/TrendChart';

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

export default function TrendsScreen() {
  const [dimensions, setDimensions] = useState(getResponsiveDimensions());
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', () => {
      setDimensions(getResponsiveDimensions());
    });
    return () => subscription?.remove();
  }, []);
  
  const weeklyData = [
    { day: 'Mon', iron: 18, calcium: 650, folic: 380 },
    { day: 'Tue', iron: 22, calcium: 720, folic: 420 },
    { day: 'Wed', iron: 16, calcium: 580, folic: 350 },
    { day: 'Thu', iron: 25, calcium: 890, folic: 450 },
    { day: 'Fri', iron: 20, calcium: 750, folic: 400 },
    { day: 'Sat', iron: 24, calcium: 820, folic: 430 },
    { day: 'Sun', iron: 18, calcium: 680, folic: 390 },
  ];

  const insights = [
    {
      title: 'Iron Absorption Peak',
      description: 'Thursday showed optimal iron intake with vitamin C pairing',
      trend: '+15%',
      color: '#34C759',
      icon: TrendingUp,
      mood: '📈'
    },
    {
      title: 'Consistent Hydration',
      description: 'Water intake steady at 8+ glasses daily this week',
      trend: '100%',
      color: '#007AFF',
      icon: Award,
      mood: '💧'
    },
    {
      title: 'Energy Correlation',
      description: 'Higher protein days align with better energy scores',
      trend: '+22%',
      color: '#FF9500',
      icon: Zap,
      mood: '⚡'
    }
  ];

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

  // Get responsive styles
  const getResponsiveStyles = () => {
    const { isTablet, isDesktop, isSmall } = dimensions;
    
    return {
      containerPadding: isDesktop ? 48 : isTablet ? 32 : isSmall ? 16 : 20,
      maxWidth: isDesktop ? 1200 : isTablet ? 800 : '100%',
      fontSize: {
        title: isDesktop ? 42 : isTablet ? 38 : isSmall ? 28 : 32,
        sectionTitle: isDesktop ? 28 : isTablet ? 26 : isSmall ? 18 : 20,
      },
    };
  };

  const responsiveStyles = getResponsiveStyles();

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
              <View>
                <Text style={[styles.title, { fontSize: responsiveStyles.fontSize.title }]}>Nutrition Trends</Text>
                <Text style={styles.subtitle}>Your wellness insights over time</Text>
              </View>
              <TouchableOpacity style={styles.filterButton} activeOpacity={0.8}>
                <Filter size={18} color="#007AFF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Time Period Selector */}
          <View style={[styles.periodSection, { paddingHorizontal: 0 }]}>
            <View style={styles.periodContainer}>
              <TouchableOpacity style={[styles.periodButton, styles.periodButtonActive]} activeOpacity={0.8}>
                <Text style={[styles.periodText, styles.periodTextActive]}>Week</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.periodButton} activeOpacity={0.8}>
                <Text style={styles.periodText}>Month</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.periodButton} activeOpacity={0.8}>
                <Text style={styles.periodText}>3 Months</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* AI Insights Card */}
          <View style={[styles.insightsSection, { paddingHorizontal: 0 }]}>
            <View style={styles.aiInsightsCard}>
              <View style={styles.aiHeader}>
                <View style={styles.aiIconContainer}>
                  <Brain size={20} color="#007AFF" />
                </View>
                <View style={styles.aiContent}>
                  <Text style={styles.aiTitle}>AI Weekly Insights</Text>
                  <Text style={styles.aiSubtitle}>Powered by your nutrition data</Text>
                </View>
                <View style={styles.aiToggle}>
                  <View style={styles.toggleActive} />
                </View>
              </View>
              
              <Text style={styles.aiInsightText}>
                Your iron intake improved by 15% this week! Thursday was your strongest day with 25mg. 
                The combination with vitamin C-rich foods is optimizing absorption beautifully.
              </Text>
              
              <View style={styles.aiTags}>
                <View style={styles.aiTag}>
                  <Text style={styles.aiTagText}>📈 Iron trending up</Text>
                </View>
                <View style={styles.aiTag}>
                  <Text style={styles.aiTagText}>⚡ Best day: Thursday</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Key Insights */}
          <View style={[styles.section, { paddingHorizontal: 0 }]}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { fontSize: responsiveStyles.fontSize.sectionTitle }]}>Key Insights</Text>
              <TouchableOpacity style={styles.chartButton} activeOpacity={0.7}>
                <BarChart3 size={16} color="#8E8E93" />
                <Text style={styles.chartButtonText}>Charts</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.insightsGrid}>
              {insights.map((insight, index) => {
                const IconComponent = insight.icon;
                return (
                  <TouchableOpacity key={index} style={styles.insightCard} activeOpacity={0.8}>
                    <View style={styles.insightHeader}>
                      <View style={styles.insightMoodContainer}>
                        <Text style={styles.insightMood}>{insight.mood}</Text>
                      </View>
                      <View style={[styles.insightIconContainer, { backgroundColor: `${insight.color}15` }]}>
                        <IconComponent size={16} color={insight.color} />
                      </View>
                      <View style={[styles.insightBadge, { backgroundColor: `${insight.color}15` }]}>
                        <Text style={[styles.insightTrend, { color: insight.color }]}>{insight.trend}</Text>
                      </View>
                    </View>
                    <Text style={styles.insightTitle}>{insight.title}</Text>
                    <Text style={styles.insightDescription}>{insight.description}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Chart Containers */}
          <View style={[styles.section, { paddingHorizontal: 0 }]}>
            <View style={styles.chartHeader}>
              <Text style={[styles.chartTitle, { fontSize: responsiveStyles.fontSize.sectionTitle }]}>Iron Intake Trend</Text>
              <View style={styles.chartLegend}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#007AFF' }]} />
                  <Text style={styles.legendText}>Daily intake</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#E5E5EA' }]} />
                  <Text style={styles.legendText}>Target (25mg)</Text>
                </View>
              </View>
            </View>
            
            <TrendChart 
              data={weeklyData.map(d => ({ label: d.day, value: d.iron }))}
              target={25}
              color="#007AFF"
            />
          </View>

          {/* Calcium Trend Chart */}
          <View style={[styles.section, { paddingHorizontal: 0 }]}>
            <View style={styles.chartHeader}>
              <Text style={[styles.chartTitle, { fontSize: responsiveStyles.fontSize.sectionTitle }]}>Calcium Intake Trend</Text>
              <View style={styles.chartLegend}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#34C759' }]} />
                  <Text style={styles.legendText}>Daily intake</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#E5E5EA' }]} />
                  <Text style={styles.legendText}>Target (1000mg)</Text>
                </View>
              </View>
            </View>
            
            <TrendChart 
              data={weeklyData.map(d => ({ label: d.day, value: d.calcium }))}
              target={1000}
              color="#34C759"
            />
          </View>

          {/* Weekly Summary */}
          <View style={[styles.section, { paddingHorizontal: 0 }]}>
            <Text style={[styles.sectionTitle, { fontSize: responsiveStyles.fontSize.sectionTitle }]}>Weekly Summary</Text>
            
            <View style={styles.summaryGrid}>
              <View style={styles.summaryCard}>
                <View style={styles.summaryIcon}>
                  <Award size={20} color="#FFD60A" />
                </View>
                <Text style={styles.summaryTitle}>Best Streak</Text>
                <Text style={styles.summaryValue}>4 days</Text>
                <Text style={styles.summaryDetail}>Met iron goals</Text>
              </View>

              <View style={styles.summaryCard}>
                <View style={styles.summaryIcon}>
                  <Target size={20} color="#FF9500" />
                </View>
                <Text style={styles.summaryTitle}>Goals Met</Text>
                <Text style={styles.summaryValue}>68%</Text>
                <Text style={styles.summaryDetail}>This week</Text>
              </View>

              <View style={styles.summaryCard}>
                <View style={styles.summaryIcon}>
                  <TrendingUp size={20} color="#34C759" />
                </View>
                <Text style={styles.summaryTitle}>Improvement</Text>
                <Text style={styles.summaryValue}>+15%</Text>
                <Text style={styles.summaryDetail}>Vs last week</Text>
              </View>
            </View>
          </View>

          {/* Nutrient Breakdown */}
          <View style={[styles.section, { paddingHorizontal: 0 }]}>
            <Text style={[styles.sectionTitle, { fontSize: responsiveStyles.fontSize.sectionTitle }]}>Nutrient Breakdown</Text>
            
            <View style={styles.nutrientBreakdown}>
              <View style={styles.nutrientCard}>
                <View style={styles.nutrientHeader}>
                  <Text style={styles.nutrientName}>Folic Acid</Text>
                  <Text style={[styles.nutrientPercent, { color: '#007AFF' }]}>82%</Text>
                </View>
                <View style={styles.nutrientBarContainer}>
                  <View style={styles.nutrientBar}>
                    <View style={[styles.nutrientFill, { 
                      width: '82%', 
                      backgroundColor: '#007AFF'
                    }]} />
                  </View>
                </View>
                <Text style={styles.nutrientDetail}>Avg: 394 mcg • Target: 400 mcg</Text>
              </View>

              <View style={styles.nutrientCard}>
                <View style={styles.nutrientHeader}>
                  <Text style={styles.nutrientName}>Omega-3 DHA</Text>
                  <Text style={[styles.nutrientPercent, { color: '#34C759' }]}>95%</Text>
                </View>
                <View style={styles.nutrientBarContainer}>
                  <View style={styles.nutrientBar}>
                    <View style={[styles.nutrientFill, { 
                      width: '95%', 
                      backgroundColor: '#34C759'
                    }]} />
                  </View>
                </View>
                <Text style={styles.nutrientDetail}>Avg: 1.42 g • Target: 1.5 g</Text>
              </View>

              <View style={styles.nutrientCard}>
                <View style={styles.nutrientHeader}>
                  <Text style={styles.nutrientName}>Vitamin D</Text>
                  <Text style={[styles.nutrientPercent, { color: '#FF9500' }]}>78%</Text>
                </View>
                <View style={styles.nutrientBarContainer}>
                  <View style={styles.nutrientBar}>
                    <View style={[styles.nutrientFill, { 
                      width: '78%', 
                      backgroundColor: '#FF9500'
                    }]} />
                  </View>
                </View>
                <Text style={styles.nutrientDetail}>Avg: 468 IU • Target: 600 IU</Text>
              </View>
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
    paddingBottom: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#1D1D1F',
    letterSpacing: -0.6,
    marginBottom: 8,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 17,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
    letterSpacing: 0.2,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  periodSection: {
    marginBottom: 24,
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
    paddingVertical: 10,
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
  insightsSection: {
    marginBottom: 32,
  },
  aiInsightsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  aiIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  aiContent: {
    flex: 1,
  },
  aiTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1D1D1F',
    marginBottom: 2,
    fontWeight: '700',
  },
  aiSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
  },
  aiToggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 2,
  },
  toggleActive: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },
  aiInsightText: {
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    color: '#1D1D1F',
    lineHeight: 22,
    marginBottom: 16,
  },
  aiTags: {
    flexDirection: 'row',
    gap: 8,
  },
  aiTag: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  aiTagText: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: '#007AFF',
    fontWeight: '600',
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
  chartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(142, 142, 147, 0.1)',
  },
  chartButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#8E8E93',
    fontWeight: '600',
  },
  insightsGrid: {
    gap: 16,
  },
  insightCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  insightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  insightMoodContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  insightMood: {
    fontSize: 18,
  },
  insightIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  insightBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  insightTrend: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    fontWeight: '700',
  },
  insightTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#1D1D1F',
    marginBottom: 6,
    fontWeight: '700',
  },
  insightDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
    lineHeight: 20,
  },
  chartHeader: {
    marginBottom: 16,
  },
  chartTitle: {
    fontFamily: 'Inter-Bold',
    color: '#1D1D1F',
    marginBottom: 12,
    fontWeight: '700',
  },
  chartLegend: {
    flexDirection: 'row',
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
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
  summaryGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  summaryCard: {
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
    minHeight: 120,
    justifyContent: 'center',
  },
  summaryIcon: {
    marginBottom: 8,
  },
  summaryTitle: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#8E8E93',
    marginBottom: 6,
    textAlign: 'center',
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1D1D1F',
    marginBottom: 4,
    fontWeight: '700',
  },
  summaryDetail: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
    textAlign: 'center',
  },
  nutrientBreakdown: {
    gap: 16,
  },
  nutrientCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  nutrientHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  nutrientName: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#1D1D1F',
    fontWeight: '600',
  },
  nutrientPercent: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    fontWeight: '700',
  },
  nutrientBarContainer: {
    marginBottom: 8,
  },
  nutrientBar: {
    height: 6,
    backgroundColor: '#F2F2F7',
    borderRadius: 3,
    overflow: 'hidden',
  },
  nutrientFill: {
    height: '100%',
    borderRadius: 3,
  },
  nutrientDetail: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
  },
});