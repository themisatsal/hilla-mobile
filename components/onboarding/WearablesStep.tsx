import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { Watch } from 'lucide-react-native';

interface WearablesStepProps {
  wearables: {
    oura: boolean;
    whoop: boolean;
    fitbit: boolean;
  };
  onWearablesChange: (wearables: { oura: boolean; whoop: boolean; fitbit: boolean }) => void;
  onSkip?: () => void;
}

export default function WearablesStep({ 
  wearables, 
  onWearablesChange,
  onSkip
}: WearablesStepProps) {
  const toggleWearable = (key: 'oura' | 'whoop' | 'fitbit') => {
    onWearablesChange({
      ...wearables,
      [key]: !wearables[key]
    });
  };

  const wearableDevices = [
    {
      key: 'oura' as const,
      name: 'Oura',
      description: 'Sleep, recovery, and readiness insights',
      color: '#FF6B6B'
    },
    {
      key: 'whoop' as const,
      name: 'Whoop',
      description: 'Strain, recovery, and sleep tracking',
      color: '#FFD93D'
    },
    {
      key: 'fitbit' as const,
      name: 'Fitbit',
      description: 'Activity, heart rate, and sleep data',
      color: '#00D4AA'
    }
  ];

  return (
    <View style={styles.wearablesWrapper}>
      <View style={styles.stepHeader}>
        <View style={styles.iconContainer}>
          <Watch size={48} color="#B8A9FF" />
        </View>
        <Text style={styles.stepTitle}>Connect Wearables</Text>
        <Text style={styles.stepSubtitle}>
          Sync your health data for personalized insights (optional)
        </Text>
      </View>

      {/* Wearable Devices */}
      <View style={styles.devicesContainer}>
        {wearableDevices.map((device) => (
          <View key={device.key} style={styles.deviceCard}>
            <View style={styles.deviceHeader}>
              <View style={[styles.deviceIconContainer, { backgroundColor: `${device.color}20` }]}>
                <View style={[styles.deviceIcon, { backgroundColor: device.color }]} />
              </View>
              <View style={styles.deviceInfo}>
                <Text style={styles.deviceName}>{device.name}</Text>
                <Text style={styles.deviceDescription}>{device.description}</Text>
              </View>
              <Switch
                value={wearables[device.key]}
                onValueChange={() => toggleWearable(device.key)}
                trackColor={{ false: '#E5E7EB', true: device.color }}
                thumbColor={wearables[device.key] ? '#FFFFFF' : '#F3F4F6'}
                ios_backgroundColor="#E5E7EB"
              />
            </View>
          </View>
        ))}
      </View>

      {/* Benefits Note */}
      <View style={styles.benefitsNote}>
        <Text style={styles.benefitsTitle}>Why connect wearables?</Text>
        <View style={styles.benefitsList}>
          <View style={styles.benefitItem}>
            <View style={styles.benefitDot} />
            <Text style={styles.benefitText}>Automatic sleep and activity tracking</Text>
          </View>
          <View style={styles.benefitItem}>
            <View style={styles.benefitDot} />
            <Text style={styles.benefitText}>Personalized nutrition recommendations</Text>
          </View>
          <View style={styles.benefitItem}>
            <View style={styles.benefitDot} />
            <Text style={styles.benefitText}>Better insights into energy patterns</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wearablesWrapper: {
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
  stepSubtitle: {
    fontSize: 18,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 26,
  },
  devicesContainer: {
    gap: 16,
    marginBottom: 32,
  },
  deviceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  deviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deviceIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  deviceIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  deviceInfo: {
    flex: 1,
    marginRight: 16,
  },
  deviceName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  deviceDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
  },
  benefitsNote: {
    backgroundColor: '#F8F6FF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  benefitsTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  benefitsList: {
    gap: 12,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  benefitDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#B8A9FF',
    marginRight: 12,
  },
  benefitText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    flex: 1,
    lineHeight: 20,
  },
});