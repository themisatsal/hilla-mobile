import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import { ArrowRight, ChevronLeft } from 'lucide-react-native';
import { useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';

interface AllSetStepProps {
  selectedStage: string;
  onEnterHilla: () => void;
  onBack?: () => void;
}

export default function AllSetStep({ selectedStage, onEnterHilla, onBack }: AllSetStepProps) {
  const router = useRouter();
  
  // Animation refs - increased confetti count to 15
  const confettiAnimations = useRef(Array.from({ length: 15 }, () => new Animated.Value(0))).current;
  const fadeInAnimation = useRef(new Animated.Value(0)).current;
  const scaleAnimation = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    // Start confetti animation
    const confettiAnimationSequence = confettiAnimations.map((anim, index) => 
      Animated.timing(anim, {
        toValue: 1,
        duration: 2000 + (index * 80),
        delay: index * 120,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      })
    );

    // Start content fade in and scale
    const contentAnimation = Animated.parallel([
      Animated.timing(fadeInAnimation, {
        toValue: 1,
        duration: 600,
        delay: 300,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnimation, {
        toValue: 1,
        delay: 300,
        tension: 60,
        friction: 8,
        useNativeDriver: true,
      })
    ]);

    // Start all animations
    Animated.parallel([
      ...confettiAnimationSequence,
      contentAnimation
    ]).start();
  }, []);

  const getStageContent = () => {
    switch (selectedStage) {
      case 'ttc':
        return {
          headline: "Your conception journey starts here.",
          subheadline: "Let's nourish your future.",
          emoji: "🌱"
        };
      case 't1':
        return {
          headline: "You're supported from the beginning.",
          subheadline: "Let's start strong.",
          emoji: "💚"
        };
      case 't2':
        return {
          headline: "Fuel growth & energy.",
          subheadline: "Let's sustain your strength.",
          emoji: "💪"
        };
      case 't3':
        return {
          headline: "Ready for the final stretch.",
          subheadline: "Let's prepare for birth.",
          emoji: "❤️"
        };
      case 'postpartum':
        return {
          headline: "Recovery is nourishment too.",
          subheadline: "Let's rebuild with care.",
          emoji: "🌸"
        };
      default:
        return {
          headline: "Your nutrition journey starts here.",
          subheadline: "Let's nourish your future.",
          emoji: "✨"
        };
    }
  };

  const { headline, subheadline, emoji } = getStageContent();

  const handleEnterHilla = () => {
    // Complete onboarding first
    onEnterHilla();
    // Navigate to feedback screen instead of directly to tabs
    router.replace('/feedback');
  };

  const renderConfettiPiece = (index: number) => {
    const colors = ['#B8A9FF', '#7FDDAA', '#FF8F65', '#60A5FA', '#F59E0B', '#EF4444', '#EC4899', '#8B5CF6'];
    const color = colors[index % colors.length];
    
    const translateY = confettiAnimations[index].interpolate({
      inputRange: [0, 1],
      outputRange: [-50, 600],
    });

    const translateX = confettiAnimations[index].interpolate({
      inputRange: [0, 1],
      outputRange: [0, (index % 2 === 0 ? 1 : -1) * (50 + Math.random() * 100)],
    });

    const rotate = confettiAnimations[index].interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', `${360 + Math.random() * 180}deg`],
    });

    const opacity = confettiAnimations[index].interpolate({
      inputRange: [0, 0.1, 0.8, 1],
      outputRange: [0, 1, 1, 0],
    });

    const scale = confettiAnimations[index].interpolate({
      inputRange: [0, 0.3, 0.7, 1],
      outputRange: [0.5, 1.3, 1.1, 0.6],
    });

    return (
      <Animated.View
        key={index}
        style={[
          styles.confettiPiece,
          {
            backgroundColor: color,
            left: `${5 + (index * 6)}%`,
            transform: [
              { translateY },
              { translateX },
              { rotate },
              { scale }
            ],
            opacity,
          }
        ]}
      />
    );
  };

  return (
    <View style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <ChevronLeft size={24} color="#6B7280" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.stepIndicator}>Step 13 of 13</Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      {/* Confetti Animation */}
      <View style={styles.confettiContainer}>
        {Array.from({ length: 15 }, (_, index) => renderConfettiPiece(index))}
      </View>

      {/* Main Content Container with proper spacing */}
      <View style={styles.contentWrapper}>
        <Animated.View 
          style={[
            styles.content,
            {
              opacity: fadeInAnimation,
              transform: [{ scale: scaleAnimation }]
            }
          ]}
        >
          {/* Emoji Icon */}
          <View style={styles.iconContainer}>
            <Text style={styles.emojiIcon}>{emoji}</Text>
          </View>

          {/* All Set Title */}
          <Text style={styles.allSetTitle}>All Set!</Text>

          {/* Dynamic Headlines */}
          <View style={styles.headlineContainer}>
            <Text style={styles.headline}>{headline}</Text>
            <Text style={styles.subheadline}>{subheadline}</Text>
          </View>

          {/* Simple Subtext */}
          <Text style={styles.subtext}>
            Hilla is here for every step of your journey.
          </Text>
        </Animated.View>
      </View>

      {/* Enter Hilla Button - Fixed at bottom */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.enterButton}
          onPress={handleEnterHilla}
          activeOpacity={0.8}
        >
          <Text style={styles.enterButtonText}>Enter Hilla</Text>
          <ArrowRight size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFBFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 20,
    backgroundColor: '#FAFBFC',
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  stepIndicator: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  placeholder: {
    width: 40,
  },
  confettiContainer: {
    position: 'absolute',
    top: 80,
    left: 0,
    right: 0,
    height: '100%',
    zIndex: 1,
    pointerEvents: 'none',
  },
  confettiPiece: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  contentWrapper: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingTop: 40,
    paddingBottom: 40,
    zIndex: 2,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 32,
    height: 80,
    justifyContent: 'center',
  },
  emojiIcon: {
    fontSize: 64,
    textAlign: 'center',
    lineHeight: 72,
  },
  allSetTitle: {
    fontSize: 36,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 28,
    letterSpacing: -0.8,
  },
  headlineContainer: {
    marginBottom: 24,
    alignItems: 'center',
  },
  headline: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 8,
    letterSpacing: -0.3,
    maxWidth: 320,
  },
  subheadline: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#B8A9FF',
    textAlign: 'center',
    lineHeight: 26,
    letterSpacing: -0.3,
    maxWidth: 320,
  },
  subtext: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 280,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 20,
    backgroundColor: '#FAFBFC',
    zIndex: 10,
  },
  enterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#B8A9FF',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 24,
    gap: 8,
    shadowColor: '#B8A9FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  enterButtonText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
});