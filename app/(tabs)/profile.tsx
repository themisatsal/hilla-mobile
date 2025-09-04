import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Settings, Download, Share2, CreditCard as Edit3, Crown, Calendar, ChevronRight, User, Heart, Target, Zap, Sparkles, Plus, LogOut } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useGoals } from '@/hooks/useGoals';
import StreakTracker from '@/components/StreakTracker';
import GoalChip from '@/components/GoalChip';
import HillaLogo from '@/components/HillaLogo';
import { useOnboardingState } from '@/hooks/useOnboardingState';
import { useAuth } from '@/components/AuthProvider';
import { Alert } from 'react-native';

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

export default function ProfileScreen() {
  const router = useRouter();
  const { state, isLoaded } = useOnboardingState();
  const { user, signOut } = useAuth();
  const userId = '550e8400-e29b-41d4-a716-446655440000'; // Default to sample user ID
  const { goals } = useGoals(userId);
  const [displayName, setDisplayName] = useState('Sarah Johnson');
  const [initials, setInitials] = useState('SJ');
  const [dimensions, setDimensions] = useState(getResponsiveDimensions());
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', () => {
      setDimensions(getResponsiveDimensions());
    });
    return () => subscription?.remove();
  }, []);

  useEffect(() => {
    if (isLoaded && state.name) {
      setDisplayName(state.name);
      // Generate initials from the name
      const nameParts = state.name.trim().split(' ');
      if (nameParts.length >= 2) {
        setInitials(nameParts[0].charAt(0).toUpperCase() + nameParts[1].charAt(0).toUpperCase());
      } else {
        setInitials(nameParts[0].charAt(0).toUpperCase() + (nameParts[0].charAt(1) || '').toUpperCase());
      }
    }
  }, [isLoaded, state.name]);

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            router.replace('/auth/login');
          }
        }
      ]
    );
  };

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

  const getStageInfo = () => {
    const stage = state.selectedStage || 't2';
    switch (stage) {
      case 'ttc':
        return { label: 'Trying to Conceive', color: '#007AFF', weeks: null, emoji: '🌱' };
      case 't1':
        return { label: 'First Trimester', color: '#34C759', weeks: 'Week 8', emoji: '💚' };
      case 't2':
        return { label: 'Second Trimester', color: '#FF9500', weeks: 'Week 18', emoji: '🧡' };
      case 't3':
        return { label: 'Third Trimester', color: '#FF3B30', weeks: 'Week 32', emoji: '💖' };
      case 'postpartum':
        return { label: 'Postpartum Recovery', color: '#34C759', weeks: '6 weeks postpartum', emoji: '🌸' };
      default:
        return { label: 'Second Trimester', color: '#FF9500', weeks: 'Week 18', emoji: '🧡' };
    }
  };

  const stageInfo = getStageInfo();

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
              <HillaLogo size="small" variant="wordmark" />
              <TouchableOpacity style={styles.settingsButton} activeOpacity={0.8}>
                <Settings size={18} color="#8E8E93" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Profile Card */}
          <View style={[styles.profileSection, { paddingHorizontal: 0 }]}>
            <View style={styles.profileCard}>
              <View style={styles.profileHeader}>
                <View style={[styles.avatarContainer, { 
                  backgroundColor: stageInfo.color
                }]}>
                  <Text style={styles.avatarText}>{initials}</Text>
                </View>
                <View style={styles.profileInfo}>
                  <Text style={styles.userName}>{displayName}</Text>
                  <View style={styles.stageContainer}>
                    <Text style={styles.stageEmoji}>{stageInfo.emoji}</Text>
                    <Text style={[styles.stageLabel, { color: stageInfo.color }]}>{stageInfo.label}</Text>
                    {stageInfo.weeks && (
                      <>
                        <View style={[styles.stageDot, { backgroundColor: stageInfo.color }]} />
                        <Text style={styles.weekInfo}>{stageInfo.weeks}</Text>
                      </>
                    )}
                  </View>
                </View>
                <TouchableOpacity style={[styles.editButton, {
                  backgroundColor: `${stageInfo.color}15`
                }]} activeOpacity={0.7}>
                  <Edit3 size={18} color={stageInfo.color} />
                </TouchableOpacity>
              </View>
              
              {/* Quick Stats */}
              <View style={styles.quickStats}>
                <View style={styles.statItem}>
                  <Heart size={14} color="#34C759" />
                  <Text style={styles.statLabel}>Wellness</Text>
                  <Text style={styles.statValue}>Excellent</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Target size={14} color="#007AFF" />
                  <Text style={styles.statLabel}>Goals</Text>
                  <Text style={styles.statValue}>4 active</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Zap size={14} color="#FF9500" />
                  <Text style={styles.statLabel}>Streak</Text>
                  <Text style={styles.statValue}>12 days</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Premium Banner */}
          <View style={[styles.premiumSection, { paddingHorizontal: 0 }]}>
            <View style={styles.premiumCard}>
              <View style={styles.premiumContent}>
                <Crown size={20} color="#FFD60A" />
                <View style={styles.premiumInfo}>
                  <Text style={styles.premiumTitle}>Hilla Premium</Text>
                  <Text style={styles.premiumSubtitle}>AI-powered nutrition guidance</Text>
                </View>
              </View>
              <View style={styles.premiumStatus}>
                <Text style={styles.premiumStatusText}>Active</Text>
              </View>
            </View>
          </View>

          {/* Progress Overview */}
          <View style={[styles.section, { paddingHorizontal: 0 }]}>
            <Text style={[styles.sectionTitle, { fontSize: responsiveStyles.fontSize.sectionTitle }]}>Your Progress</Text>
            <StreakTracker currentStreak={12} bestStreak={18} />
          </View>

          {/* Current Goals */}
          <View style={[styles.section, { paddingHorizontal: 0 }]}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { fontSize: responsiveStyles.fontSize.sectionTitle }]}>Current Goals</Text>
              <TouchableOpacity 
                style={[styles.manageButton, {
                  backgroundColor: `${stageInfo.color}15`
                }]} 
                activeOpacity={0.7}
                onPress={() => router.push('/goals')}
              >
                <Sparkles size={14} color={stageInfo.color} />
                <Text style={[styles.manageText, { color: stageInfo.color }]}>Manage</Text>
              </TouchableOpacity>
            </View>
            
            <View style={[styles.goalsGrid, dimensions.isTablet && styles.goalsGridTablet]}>
              {goals.slice(0, 4).filter(goal => !goal.isCompleted).map(goal => (
                <GoalChip 
                  key={goal.id}
                  label={goal.title}
                  target={`${goal.targetValue} ${goal.unit}`}
                  progress={Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100))}
                  color={goal.color}
                />
              ))}
              
              {goals.filter(goal => !goal.isCompleted).length === 0 && (
                <TouchableOpacity 
                  style={styles.addGoalCard}
                  onPress={() => router.push('/goals')}
                >
                  <Plus size={24} color="#8E8E93" />
                  <Text style={styles.addGoalText}>Add Goals</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Health Summary */}
          <View style={[styles.section, { paddingHorizontal: 0 }]}>
            <Text style={[styles.sectionTitle, { fontSize: responsiveStyles.fontSize.sectionTitle }]}>Health Summary</Text>
            <View style={styles.healthCard}>
              <View style={styles.healthRow}>
                <Text style={styles.healthLabel}>Due Date</Text>
                <Text style={styles.healthValue}>March 15, 2025</Text>
              </View>
              <View style={styles.healthRow}>
                <Text style={styles.healthLabel}>Pre-pregnancy Weight</Text>
                <Text style={styles.healthValue}>125 lbs</Text>
              </View>
              <View style={styles.healthRow}>
                <Text style={styles.healthLabel}>Weight Gain Goal</Text>
                <Text style={styles.healthValue}>25-35 lbs</Text>
              </View>
              <View style={styles.healthRow}>
                <Text style={styles.healthLabel}>Allergies</Text>
                <Text style={styles.healthValue}>None reported</Text>
              </View>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={[styles.section, { paddingHorizontal: 0 }]}>
            <Text style={[styles.sectionTitle, { fontSize: responsiveStyles.fontSize.sectionTitle }]}>Export & Share</Text>
            <View style={styles.actionGrid}>
              <TouchableOpacity style={styles.actionCard} activeOpacity={0.8}>
                <View style={[styles.actionIcon, { backgroundColor: 'rgba(0, 122, 255, 0.1)' }]}>
                  <Download size={18} color="#007AFF" />
                </View>
                <Text style={styles.actionText}>Export Data</Text>
                <ChevronRight size={14} color="#8E8E93" />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionCard} activeOpacity={0.8}>
                <View style={[styles.actionIcon, { backgroundColor: 'rgba(52, 199, 89, 0.1)' }]}>
                  <Share2 size={18} color="#34C759" />
                </View>
                <Text style={styles.actionText}>Share Report</Text>
                <ChevronRight size={14} color="#8E8E93" />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionCard} activeOpacity={0.8}>
                <View style={[styles.actionIcon, { backgroundColor: 'rgba(255, 149, 0, 0.1)' }]}>
                  <Calendar size={18} color="#FF9500" />
                </View>
                <Text style={styles.actionText}>Book Appointment</Text>
                <ChevronRight size={14} color="#8E8E93" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Settings Menu */}
          <View style={[styles.section, { paddingHorizontal: 0 }]}>
            <Text style={[styles.sectionTitle, { fontSize: responsiveStyles.fontSize.sectionTitle }]}>Settings</Text>
            <View style={styles.settingsCard}>
              <TouchableOpacity style={styles.settingsItem} activeOpacity={0.8} onPress={() => router.push('/nutrition-tracking-settings')}>
                <Text style={styles.settingsLabel}>Nutrition Tracking</Text>
                <View style={styles.settingsRight}>
                  <Text style={styles.settingsValue}>Customize metrics</Text>
                  <ChevronRight size={14} color="#8E8E93" />
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.settingsItem} activeOpacity={0.8}>
                <Text style={styles.settingsLabel}>Notification Preferences</Text>
                <View style={styles.settingsRight}>
                  <Text style={styles.settingsValue}>Daily reminders</Text>
                  <ChevronRight size={14} color="#8E8E93" />
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.settingsItem} activeOpacity={0.8}>
                <Text style={styles.settingsLabel}>Units & Measurements</Text>
                <View style={styles.settingsRight}>
                  <Text style={styles.settingsValue}>Imperial</Text>
                  <ChevronRight size={14} color="#8E8E93" />
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.settingsItem} 
                activeOpacity={0.8}
                onPress={() => router.push('/food-preferences')}
              >
                <Text style={styles.settingsLabel}>Food Preferences</Text>
                <View style={styles.settingsRight}>
                  <Text style={styles.settingsValue}>Manage</Text>
                  <ChevronRight size={14} color="#8E8E93" />
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.settingsItem} 
                activeOpacity={0.8}
              >
                <Text style={styles.settingsLabel}>Privacy & Data</Text>
                <View style={styles.settingsRight}>
                  <Text style={styles.settingsValue}>Configure</Text>
                  <ChevronRight size={14} color="#8E8E93" />
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.settingsItem, styles.settingsItemLast]} activeOpacity={0.8}>
                <Text style={styles.settingsLabel}>Help & Support</Text>
                <View style={styles.settingsRight}>
                  <Text style={styles.settingsValue}>Contact us</Text>
                  <ChevronRight size={14} color="#8E8E93" />
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.settingsItem, styles.signOutItem]} 
                activeOpacity={0.8}
                onPress={handleSignOut}
              >
                <View style={styles.signOutContent}>
                  <LogOut size={16} color="#FF3B30" />
                  <Text style={styles.signOutText}>Sign Out</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Journey Timeline */}
          <View style={[styles.section, { paddingHorizontal: 0 }]}>
            <Text style={[styles.sectionTitle, { fontSize: responsiveStyles.fontSize.sectionTitle }]}>Your Journey</Text>
            <View style={styles.timelineCard}>
              <View style={styles.timeline}>
                <View style={styles.timelineItem}>
                  <View style={[styles.timelineOrb, styles.timelineOrbCompleted]} />
                  <View style={styles.timelineContent}>
                    <Text style={styles.timelineTitle}>Started TTC Journey</Text>
                    <Text style={styles.timelineDate}>June 2024</Text>
                  </View>
                </View>
                
                <View style={styles.timelineItem}>
                  <View style={[styles.timelineOrb, styles.timelineOrbCompleted]} />
                  <View style={styles.timelineContent}>
                    <Text style={styles.timelineTitle}>Pregnancy Confirmed</Text>
                    <Text style={styles.timelineDate}>September 2024</Text>
                  </View>
                </View>
                
                <View style={styles.timelineItem}>
                  <View style={[styles.timelineOrb, styles.timelineOrbCurrent, { 
                    backgroundColor: stageInfo.color
                  }]} />
                  <View style={styles.timelineContent}>
                    <Text style={styles.timelineTitle}>{stageInfo.label}</Text>
                    <Text style={styles.timelineDate}>{stageInfo.weeks || 'Current'}</Text>
                  </View>
                </View>
                
                <View style={styles.timelineItem}>
                  <View style={styles.timelineOrb} />
                  <View style={styles.timelineContent}>
                    <Text style={styles.timelineTitle}>Third Trimester</Text>
                    <Text style={styles.timelineDate}>Week 28</Text>
                  </View>
                </View>
                
                <View style={styles.timelineItem}>
                  <View style={styles.timelineOrb} />
                  <View style={styles.timelineContent}>
                    <Text style={styles.timelineTitle}>Baby Arrives</Text>
                    <Text style={styles.timelineDate}>March 2025</Text>
                  </View>
                </View>
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
    alignItems: 'center',
  },
  settingsButton: {
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
  profileSection: {
    marginBottom: 24,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    fontWeight: '700',
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 22,
    fontFamily: 'Inter-Bold',
    color: '#1D1D1F',
    marginBottom: 6,
    fontWeight: '700',
  },
  stageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stageEmoji: {
    fontSize: 16,
  },
  stageLabel: {
    fontSize: 15,
    fontFamily: 'Inter-Medium',
    fontWeight: '600',
  },
  stageDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  weekInfo: {
    fontSize: 15,
    fontFamily: 'Inter-Medium',
    color: '#8E8E93',
    fontWeight: '500',
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
  },
  statItem: {
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#F2F2F7',
  },
  statLabel: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    color: '#8E8E93',
    textTransform: 'uppercase',
    fontWeight: '500',
  },
  statValue: {
    fontSize: 13,
    fontFamily: 'Inter-Bold',
    color: '#1D1D1F',
    fontWeight: '700',
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E5E5EA',
  },
  premiumSection: {
    marginBottom: 24,
  },
  premiumCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  premiumContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  premiumInfo: {
    marginLeft: 12,
  },
  premiumTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#1D1D1F',
    marginBottom: 2,
    fontWeight: '700',
  },
  premiumSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
  },
  premiumStatus: {
    backgroundColor: '#D1FAE5',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  premiumStatusText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#059669',
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
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1D1D1F',
    marginBottom: 16,
    fontWeight: '700',
  },
  manageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  manageText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    fontWeight: '600',
  },
  goalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  goalsGridTablet: {
    justifyContent: 'flex-start',
  },
  addGoalCard: {
    width: '47%',
    maxWidth: 200,
    borderRadius: 16,
    padding: 16,
    backgroundColor: '#F2F2F7',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
    gap: 8,
  },
  addGoalText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#8E8E93',
    fontWeight: '500',
  },
  healthCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  healthRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  healthLabel: {
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
  },
  healthValue: {
    fontSize: 15,
    fontFamily: 'Inter-Medium',
    color: '#1D1D1F',
    fontWeight: '600',
  },
  actionGrid: {
    gap: 12,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  actionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  actionText: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Inter-Medium',
    color: '#1D1D1F',
    fontWeight: '600',
  },
  settingsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  settingsItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  settingsItemLast: {
    borderBottomWidth: 0,
  },
  settingsLabel: {
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    color: '#1D1D1F',
    flex: 1,
  },
  settingsRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingsValue: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#8E8E93',
    fontWeight: '500',
  },
  signOutItem: {
    justifyContent: 'center',
    paddingVertical: 20,
  },
  signOutContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  signOutText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#FF3B30',
    fontWeight: '600',
  },
  timelineCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  timeline: {
    paddingLeft: 16,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  timelineOrb: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E5E5EA',
    marginRight: 16,
  },
  timelineOrbCompleted: {
    backgroundColor: '#34C759',
  },
  timelineOrbCurrent: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 14,
  },
  timelineContent: {
    flex: 1,
  },
  timelineTitle: {
    fontSize: 15,
    fontFamily: 'Inter-Medium',
    color: '#1D1D1F',
    marginBottom: 4,
    fontWeight: '600',
  },
  timelineDate: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
  },
});