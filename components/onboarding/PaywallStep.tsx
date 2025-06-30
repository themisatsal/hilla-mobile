import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Crown, Check, Star } from 'lucide-react-native';

interface PaywallStepProps {
  onSelectPlan: (planType: string) => void;
  onStartTrial: () => void;
  onSkip: () => void;
  onContinue: () => void;
}

export default function PaywallStep({ onSelectPlan, onStartTrial, onSkip, onContinue }: PaywallStepProps) {
  const plans = [
    {
      id: 'monthly',
      name: 'Monthly',
      price: '€19',
      period: '/mo',
      trial: '7-day free trial',
      color: '#B8A9FF',
      popular: false
    },
    {
      id: 'annual',
      name: 'Annual (Early-Adopter)',
      price: '€149',
      period: '/yr',
      savings: 'save 35%',
      color: '#7FDDAA',
      popular: true
    },
    {
      id: 'lifetime',
      name: 'Lifetime Access',
      price: '€299',
      period: 'one-time',
      limited: 'limited to 500 members',
      color: '#FF8F65',
      popular: false
    }
  ];

  return (
    <View style={styles.paywallWrapper}>
      <View style={styles.stepHeader}>
        <View style={styles.iconContainer}>
          <Crown size={48} color="#FFD700" />
        </View>
        <Text style={styles.stepTitle}>Choose the plan that fits your journey</Text>
      </View>

      {/* Plan Cards */}
      <View style={styles.plansContainer}>
        {plans.map((plan) => (
          <View key={plan.id} style={styles.planCardWrapper}>
            {plan.popular && (
              <View style={styles.popularBadge}>
                <Star size={12} color="#FFFFFF" />
                <Text style={styles.popularText}>Most Popular</Text>
              </View>
            )}
            <TouchableOpacity
              style={[
                styles.planCard,
                { borderColor: plan.color },
                plan.popular && styles.popularCard
              ]}
              onPress={() => onSelectPlan(plan.id)}
            >
              <View style={styles.planHeader}>
                <Text style={styles.planName}>{plan.name}</Text>
                <View style={styles.priceContainer}>
                  <Text style={[styles.planPrice, { color: plan.color }]}>{plan.price}</Text>
                  <Text style={styles.planPeriod}>{plan.period}</Text>
                </View>
              </View>

              {plan.trial && (
                <View style={styles.trialBadge}>
                  <Text style={styles.trialText}>{plan.trial}</Text>
                </View>
              )}

              {plan.savings && (
                <View style={[styles.savingsBadge, { backgroundColor: 'rgba(127, 221, 170, 0.2)' }]}>
                  <Text style={[styles.savingsText, { color: plan.color }]}>{plan.savings}</Text>
                </View>
              )}

              {plan.limited && (
                <View style={styles.limitedBadge}>
                  <Text style={styles.limitedText}>{plan.limited}</Text>
                </View>
              )}

              {/* Plan Features */}
              <View style={styles.featuresContainer}>
                <View style={styles.featureItem}>
                  <Check size={16} color={plan.color} />
                  <Text style={styles.featureText}>Personalized nutrition insights</Text>
                </View>
                <View style={styles.featureItem}>
                  <Check size={16} color={plan.color} />
                  <Text style={styles.featureText}>AI-powered recommendations</Text>
                </View>
                <View style={styles.featureItem}>
                  <Check size={16} color={plan.color} />
                  <Text style={styles.featureText}>Progress tracking & analytics</Text>
                </View>
                <View style={styles.featureItem}>
                  <Check size={16} color={plan.color} />
                  <Text style={styles.featureText}>Expert-curated meal plans</Text>
                </View>
                {plan.id === 'lifetime' && (
                  <View style={styles.featureItem}>
                    <Check size={16} color={plan.color} />
                    <Text style={styles.featureText}>Priority support & early access</Text>
                  </View>
                )}
              </View>

              {/* CTA Button */}
              <TouchableOpacity
                style={[styles.ctaButton, { backgroundColor: plan.color }]}
                onPress={() => onSelectPlan(plan.id)}
              >
                <Text style={styles.ctaButtonText}>
                  {plan.id === 'monthly' ? 'Start Free Trial' : 
                   plan.id === 'annual' ? 'Get Early Access' : 
                   'Secure Lifetime Access'}
                </Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Secondary Link */}
      <TouchableOpacity style={styles.secondaryLink} onPress={onStartTrial}>
        <Text style={styles.secondaryLinkText}>
          Prefer to try before committing? Start your free 7-day trial.
        </Text>
      </TouchableOpacity>

      {/* Footnote */}
      <View style={styles.footnote}>
        <Text style={styles.footnoteText}>Prices include VAT where applicable.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  paywallWrapper: {
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
    lineHeight: 34,
    paddingHorizontal: 20,
  },
  plansContainer: {
    gap: 20,
    marginBottom: 32,
  },
  planCardWrapper: {
    position: 'relative',
  },
  popularBadge: {
    position: 'absolute',
    top: -8,
    left: '50%',
    transform: [{ translateX: -50 }],
    backgroundColor: '#7FDDAA',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    zIndex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  popularText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  planCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  popularCard: {
    borderWidth: 3,
    transform: [{ scale: 1.02 }],
  },
  planHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  planName: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  planPrice: {
    fontSize: 36,
    fontFamily: 'Inter-Bold',
    lineHeight: 40,
  },
  planPeriod: {
    fontSize: 18,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  trialBadge: {
    backgroundColor: '#F0F9FF',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: 'center',
    marginBottom: 16,
  },
  trialText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#0369A1',
  },
  savingsBadge: {
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: 'center',
    marginBottom: 16,
  },
  savingsText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  limitedBadge: {
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FCD34D',
  },
  limitedText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#92400E',
  },
  featuresContainer: {
    gap: 12,
    marginBottom: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    flex: 1,
  },
  ctaButton: {
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  ctaButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  secondaryLink: {
    alignSelf: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  secondaryLinkText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    textAlign: 'center',
    textDecorationLine: 'underline',
    lineHeight: 24,
  },
  footnote: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  footnoteText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    textAlign: 'center',
  },
});