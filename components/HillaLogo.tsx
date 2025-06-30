import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Svg, Circle, Path, Defs, RadialGradient, Stop } from 'react-native-svg';

interface HillaLogoProps {
  size?: 'small' | 'medium' | 'large';
  variant?: 'wordmark' | 'icon' | 'full';
  color?: 'default' | 'white';
}

export default function HillaLogo({ 
  size = 'medium', 
  variant = 'full',
  color = 'default' 
}: HillaLogoProps) {
  const dimensions = {
    small: { width: 80, height: 32, fontSize: 20 },
    medium: { width: 120, height: 48, fontSize: 30 },
    large: { width: 160, height: 64, fontSize: 40 }
  };

  const { width, height, fontSize } = dimensions[size];
  const dotSize = fontSize * 0.12; // Size of the cloudberry dot replacing the 'i' dot

  // Cloudberry dot that replaces the 'i' dot - three rounded lobes with mint leaf
  const CloudberryDot = ({ size: dotSize }: { size: number }) => (
    <View style={[styles.cloudberryDot, { width: dotSize * 2, height: dotSize * 2 }]}>
      <Svg width={dotSize * 2} height={dotSize * 2} viewBox="0 0 20 20">
        <Defs>
          <RadialGradient id="cloudberryGradient" cx="50%" cy="30%" r="70%">
            <Stop offset="0%" stopColor="#FFC989" />
            <Stop offset="100%" stopColor="#FF9B4A" />
          </RadialGradient>
        </Defs>
        {/* Three rounded lobes forming cloudberry */}
        <Circle cx="10" cy="7" r="3" fill="url(#cloudberryGradient)" />
        <Circle cx="7" cy="12" r="2.5" fill="url(#cloudberryGradient)" />
        <Circle cx="13" cy="12" r="2.5" fill="url(#cloudberryGradient)" />
        {/* Tiny mint leaf */}
        <Path 
          d="M10 4 C9 3, 8 3.5, 8.5 4.5 C9 5, 9.5 4.5, 10 4 Z" 
          fill="#7FDDAA" 
        />
      </Svg>
    </View>
  );

  // App Icon - circular gradient with white wordmark
  const AppIcon = ({ size: iconSize }: { size: number }) => (
    <View style={[styles.appIcon, { width: iconSize, height: iconSize }]}>
      <Text style={[
        styles.appIconText, 
        { fontSize: iconSize * 0.25 }
      ]}>
        hilla
      </Text>
    </View>
  );

  if (variant === 'icon') {
    return <AppIcon size={width} />;
  }

  // Wordmark with cloudberry dot replacing 'i' dot
  const renderWordmark = () => (
    <View style={styles.wordmarkContainer}>
      <Text style={[
        styles.wordmark, 
        { 
          fontSize,
          color: color === 'white' ? '#FFFFFF' : '#1F2937'
        }
      ]}>
        h
      </Text>
      <View style={styles.iContainer}>
        <Text style={[
          styles.wordmark, 
          styles.iStem,
          { 
            fontSize,
            color: color === 'white' ? '#FFFFFF' : '#1F2937'
          }
        ]}>
          i
        </Text>
        <View style={[styles.dotPosition, { top: -fontSize * 0.15 }]}>
          <CloudberryDot size={dotSize} />
        </View>
      </View>
      <Text style={[
        styles.wordmark, 
        { 
          fontSize,
          color: color === 'white' ? '#FFFFFF' : '#1F2937'
        }
      ]}>
        lla
      </Text>
    </View>
  );

  if (variant === 'wordmark') {
    return renderWordmark();
  }

  // Full logo
  return (
    <View style={[styles.container, { width, height }]}>
      {renderWordmark()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  wordmarkContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    position: 'relative',
  },
  wordmark: {
    fontFamily: 'Inter-Bold', // Using Inter-Bold as closest to Clash Display Bold
    fontWeight: '800',
    letterSpacing: -1.5,
    textTransform: 'lowercase',
  },
  iContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  iStem: {
    // Remove the default dot from 'i' by making it invisible
    textShadowColor: 'transparent',
  },
  dotPosition: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cloudberryDot: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  appIcon: {
    borderRadius: 1000,
    // Circular gradient: Lavender → Cloudberry Orange at 45°
    backgroundColor: '#B8A9FF', // Fallback lavender
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#B8A9FF',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    // Note: For true gradient at 45°, would need LinearGradient component
    // Using solid lavender as fallback for React Native compatibility
  },
  appIconText: {
    fontFamily: 'Inter-Bold',
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -1,
    textTransform: 'lowercase',
  },
});