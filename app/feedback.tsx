import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Star, Heart, ArrowRight } from 'lucide-react-native';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';
import { useOnboardingState } from '@/hooks/useOnboardingState';

export default function FeedbackScreen() {
  const router = useRouter();
  const { state } = useOnboardingState();
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  
  // Animation refs
  const fadeInAnimation = useRef(new Animated.Value(0)).current;
  const scaleAnimation = useRef(new Animated.Value(0.9)).current;
  const starAnimations = useRef(Array.from({ length: 5 }, () => new Animated.Value(1))).current;
  const ratingTextAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start content fade in and scale
    Animated.parallel([
      Animated.timing(fadeInAnimation, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnimation, {
        toValue: 1,
        tension: 80,
        friction: 8,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const handleStarPress = (rating: number) => {
    console.log('Star pressed:', rating);
    
    // If the same rating is selected, deselect it
    if (selectedRating === rating) {
      setSelectedRating(null);
      // Reset rating text animation
      Animated.timing(ratingTextAnimation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
      return;
    }
    
    setSelectedRating(rating);
    
    // Animate the rating text appearing
    Animated.timing(ratingTextAnimation, {
      toValue: 1,
      duration: 300,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
    
    // Animate the selected star with a bounce effect
    const starIndex = rating - 1;
    Animated.sequence([
      Animated.timing(starAnimations[starIndex], {
        toValue: 1.3,
        duration: 150,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.spring(starAnimations[starIndex], {
        toValue: 1,
        tension: 300,
        friction: 8,
        useNativeDriver: true,
      })
    ]).start();
  };

  const handleSubmitFeedback = () => {
    if (selectedRating === null) return;
    
    setHasSubmitted(true);
    
    // Here you would typically send the rating to your analytics service
    console.log('User rating:', selectedRating);
    
    // Navigate to main app after a brief delay
    setTimeout(() => {
      router.replace('/(tabs)');
    }, 1500);
  };

  const handleSkip = () => {
    router.replace('/(tabs)');
  };

  // Get personalized title based on user's stage
  const getPersonalizedTitle = () => {
    const name = state.name || 'there';
    const stage = state.selectedStage;
    
    switch (stage) {
      case 'ttc':
        return `How's your TTC journey, ${name}?`;
      case 't1':
        return `How's first trimester going, ${name}?`;
      case 't2':
        return `How's second trimester going, ${name}?`;
      case 't3':
        return `How's the final stretch, ${name}?`;
      case 'postpartum':
        return `How's recovery going, ${name}?`;
      default:
        return `How's it going, ${name}?`;
    }
  };

  const renderStar = (index: number) => {
    const starNumber = index + 1;
    const isSelected = selectedRating !== null && starNumber <= selectedRating;
    const starScale = starAnimations[index];
    
    return (
      <TouchableOpacity
        key={index}
        onPress={() => handleStarPress(starNumber)}
        style={styles.starButton}
        activeOpacity={0.6}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Animated.View
          style={[
            styles.starContainer,
            {
              transform: [{ scale: starScale }]
            }
          ]}
        >
          <Star
            size={36}
            color={isSelected ? '#FFD700' : '#D1D5DB'}
            fill={isSelected ? '#FFD700' : 'transparent'}
            strokeWidth={isSelected ? 1 : 2}
          />
        </Animated.View>
      </TouchableOpacity>
    );
  };

  if (hasSubmitted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.thankYouContainer}>
          <View style={styles.heartContainer}>
            <Heart size={48} color="#FF8F65" fill="#FF8F65" />
          </View>
          <Text style={styles.thankYouTitle}>Thank you!</Text>
          <Text style={styles.thankYouSubtitle}>
            Your feedback helps us improve Hilla.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeInAnimation,
            transform: [{ scale: scaleAnimation }]
          }
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{getPersonalizedTitle()}</Text>
        </View>

        {/* Star Rating Section */}
        <View style={styles.ratingSection}>
          <Text style={styles.ratingLabel}>Tap to rate your experience</Text>
          <View style={styles.starsContainer}>
            {Array.from({ length: 5 }, (_, index) => renderStar(index))}
          </View>
          
          {/* Fixed height container for rating text to prevent layout shift */}
          <View style={styles.ratingTextContainer}>
            {selectedRating && (
              <Animated.View 
                style={[
                  styles.ratingTextContent,
                  {
                    opacity: ratingTextAnimation,
                    transform: [{
                      translateY: ratingTextAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [10, 0],
                      })
                    }]
                  }
                ]}
              >
                <Text style={styles.ratingText}>
                  {selectedRating === 1 && "We'll do better! 😔"}
                  {selectedRating === 2 && "Thanks for the feedback! 🤔"}
                  {selectedRating === 3 && "Good to know! 😊"}
                  {selectedRating === 4 && "Great to hear! 😄"}
                  {selectedRating === 5 && "Amazing! Thank you! 🎉"}
                </Text>
              </Animated.View>
            )}
          </View>
        </View>
      </Animated.View>

      {/* Action Buttons - Fixed at bottom with much more spacing */}
      <View style={styles.buttonContainer}>
        {selectedRating ? (
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmitFeedback}
            activeOpacity={0.8}
          >
            <Text style={styles.submitButtonText}>Submit Feedback</Text>
            <ArrowRight size={20} color="#FFFFFF" />
          </TouchableOpacity>
        ) : null}
        
        <TouchableOpacity
          style={styles.skipButton}
          onPress={handleSkip}
          activeOpacity={0.7}
        >
          <Text style={styles.skipButtonText}>Skip for now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFBFC',
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 80,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    textAlign: 'center',
    letterSpacing: -0.6,
    lineHeight: 34,
    paddingHorizontal: 16,
  },
  ratingSection: {
    alignItems: 'center',
    marginBottom: 60,
  },
  ratingLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginBottom: 32,
    textAlign: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  starButton: {
    padding: 8,
    borderRadius: 8,
  },
  starContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingTextContainer: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  ratingTextContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#B8A9FF',
    textAlign: 'center',
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 80,
    gap: 24,
  },
  submitButton: {
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
  submitButtonText: {
    fontSize: 17,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  skipButton: {
    alignSelf: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  skipButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
  // Thank you screen styles
  thankYouContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  heartContainer: {
    marginBottom: 32,
  },
  thankYouTitle: {
    fontSize: 30,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  thankYouSubtitle: {
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 260,
  },
});