import { View, Text, StyleSheet } from 'react-native';
import { Flame, Trophy } from 'lucide-react-native';

interface StreakTrackerProps {
  currentStreak: number;
  bestStreak: number;
}

export default function StreakTracker({ currentStreak, bestStreak }: StreakTrackerProps) {
  return (
    <View style={styles.container}>
      <View style={styles.streakCrystal}>
        <View style={styles.crystalShine} />
        <View style={styles.streakIcon}>
          <Flame size={28} color="#FF9B4A" />
        </View>
        <View style={styles.streakInfo}>
          <Text style={styles.streakTitle}>Current Streak</Text>
          <Text style={[styles.streakValue, { color: '#FF9B4A' }]}>{currentStreak} days</Text>
          <Text style={styles.streakSubtitle}>Keep the momentum!</Text>
        </View>
      </View>
      
      <View style={styles.streakCrystal}>
        <View style={styles.crystalShine} />
        <View style={styles.streakIcon}>
          <Trophy size={28} color="#FFD700" />
        </View>
        <View style={styles.streakInfo}>
          <Text style={styles.streakTitle}>Best Streak</Text>
          <Text style={[styles.streakValue, { color: '#FFD700' }]}>{bestStreak} days</Text>
          <Text style={styles.streakSubtitle}>Personal record</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 16,
  },
  streakCrystal: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    paddingVertical: 16,
    shadowOpacity: 0.08,
    borderRadius: 16,
    elevation: 6,
    borderWidth: 0.5,
    borderColor: 'rgba(0, 0, 0, 0.04)',
    position: 'relative',
    overflow: 'hidden',
    minHeight: 140,
    justifyContent: 'center',
  },
  crystalShine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  streakIcon: {
    alignSelf: 'center',
    marginBottom: 16,
    padding: 12,
    borderRadius: 24,
    backgroundColor: '#FAFBFC',
    borderWidth: 0.5,
    borderColor: 'rgba(0, 0, 0, 0.04)',
  },
  streakInfo: {
    alignItems: 'center',
  },
  streakTitle: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  streakValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginBottom: 6,
    letterSpacing: -0.6,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  streakSubtitle: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
});