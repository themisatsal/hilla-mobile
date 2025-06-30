import { View, Text, StyleSheet } from 'react-native';
import HillaLogo from '@/components/HillaLogo';

export default function WelcomeStep() {
  return (
    <View style={styles.welcomeContainer}>
      <View style={styles.logoSection}>
        <HillaLogo size="large" variant="full" />
      </View>

      <View style={styles.welcomeContent}>
        <Text style={styles.secondaryHeading}>
          Personalised nutrition for every maternal journey
        </Text>
        <Text style={styles.companionText}>
          Your nutrition companion from conception to motherhood
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  welcomeContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 24,
  },
  logoSection: {
    alignItems: 'center',
    paddingTop: 60,
    marginBottom: 40,
  },
  welcomeContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 80,
    flex: 1,
    justifyContent: 'center',
  },
  secondaryHeading: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    textAlign: 'center',
    lineHeight: 38,
    marginBottom: 32,
    letterSpacing: -1,
  },
  companionText: {
    fontSize: 18,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 16,
    letterSpacing: -0.2,
  },
});