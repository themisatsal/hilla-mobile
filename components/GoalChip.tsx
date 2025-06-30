import { View, Text, StyleSheet } from 'react-native';

interface GoalChipProps {
  label: string;
  target: string;
  progress: number;
  color: string;
}

export default function GoalChip({ label, target, progress, color }: GoalChipProps) {
  return (
    <View style={[styles.container, {
      backgroundColor: `${color}08`,
      borderColor: `${color}20`
    }]}>
      <View style={styles.chipShine} />
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <Text style={[styles.progress, { color }]}>{progress}%</Text>
      </View>
      <Text style={styles.target}>{target}</Text>
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { 
                width: `${progress}%`, 
                backgroundColor: color,
                shadowColor: color
              }
            ]} 
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '47%',
    maxWidth: 200,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    position: 'relative',
    overflow: 'hidden',
    minHeight: 100,
    justifyContent: 'space-between',
  },
  chipShine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1E1E28',
    flex: 1,
    letterSpacing: -0.1,
  },
  progress: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    letterSpacing: 0.2,
  },
  target: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 12,
    letterSpacing: 0.1,
  },
  progressBarContainer: {
    marginBottom: 4,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(243, 244, 246, 0.8)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
});