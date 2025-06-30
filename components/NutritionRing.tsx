import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Circle, Svg } from 'react-native-svg';

interface NutritionRingProps {
  percentage: number;
  label: string;
  current: number;
  target: number;
  unit: string;
  accentColor?: string;
}

const { width: screenWidth } = Dimensions.get('window');

export default function NutritionRing({ 
  percentage, 
  label, 
  current, 
  target, 
  unit, 
  accentColor = '#007AFF' 
}: NutritionRingProps) {
  // Responsive sizing based on screen width
  const getResponsiveSize = () => {
    if (screenWidth < 375) return 160; // Small phones
    if (screenWidth < 414) return 180; // Standard phones
    if (screenWidth >= 768) return 220; // Tablets
    return 200; // Default
  };

  const size = getResponsiveSize();
  const strokeWidth = Math.max(12, size * 0.07); // Responsive stroke width
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Get color based on percentage with Apple colors
  const getColor = () => {
    if (percentage >= 85) return '#34C759'; // Apple Green
    if (percentage >= 70) return '#FF9500'; // Apple Orange
    if (percentage >= 50) return '#007AFF'; // Apple Blue
    return '#FF3B30'; // Apple Red
  };

  const ringColor = getColor();

  // Responsive font sizes
  const getFontSizes = () => {
    const baseSize = size / 180; // Scale factor based on ring size
    return {
      percentage: Math.round(36 * baseSize),
      percentageSymbol: Math.round(20 * baseSize),
      label: Math.round(16 * baseSize),
      values: Math.round(13 * baseSize),
    };
  };

  const fontSizes = getFontSizes();

  return (
    <View style={styles.container}>
      <View style={[styles.ringContainer, { width: size + 20, height: size + 20 }]}>
        <Svg width={size} height={size} style={styles.svg}>
          {/* Background circle with subtle shadow */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#F2F2F7"
            strokeWidth={strokeWidth}
            fill="transparent"
            opacity={0.3}
          />
          {/* Progress circle with enhanced styling */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={ringColor}
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            style={{
              filter: 'drop-shadow(0px 2px 8px rgba(0, 0, 0, 0.15))',
            }}
          />
          {/* Inner glow effect */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius - strokeWidth/2}
            stroke={ringColor}
            strokeWidth={2}
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            opacity={0.3}
          />
        </Svg>
        
        {/* Center content with improved layout */}
        <View style={[styles.centerContent, { width: size - strokeWidth * 2 }]}>
          <View style={styles.percentageContainer}>
            <Text style={[styles.percentage, { 
              color: ringColor,
              fontSize: fontSizes.percentage,
              lineHeight: fontSizes.percentage + 4
            }]}>
              {percentage}
            </Text>
            <Text style={[styles.percentageSymbol, { 
              fontSize: fontSizes.percentageSymbol,
              lineHeight: fontSizes.percentageSymbol + 2
            }]}>
              %
            </Text>
          </View>
          
          <Text style={[styles.label, { 
            fontSize: fontSizes.label,
            lineHeight: fontSizes.label + 2
          }]} numberOfLines={2} adjustsFontSizeToFit>
            {label}
          </Text>
          
          {label === 'Wellness Score' ? (
            <Text style={[styles.values, { 
              fontSize: fontSizes.values,
              lineHeight: fontSizes.values + 2
            }]} numberOfLines={2} adjustsFontSizeToFit>
              Overall health rating
            </Text>
          ) : (
            <Text style={[styles.values, { 
              fontSize: fontSizes.values,
              lineHeight: fontSizes.values + 2
            }]} numberOfLines={2} adjustsFontSizeToFit>
              {current}{unit} of {target}{unit}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  ringContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  svg: {
    position: 'absolute',
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  percentageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginBottom: 8,
  },
  percentage: {
    fontFamily: 'Inter-Bold',
    letterSpacing: -2,
    fontWeight: '700',
    textAlign: 'center',
  },
  percentageSymbol: {
    fontFamily: 'Inter-Bold',
    color: '#8E8E93',
    fontWeight: '700',
    marginLeft: 2,
    marginTop: 4,
  },
  label: {
    fontFamily: 'Inter-Medium',
    color: '#1D1D1F',
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 4,
    maxWidth: '100%',
  },
  values: {
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
    textAlign: 'center',
    maxWidth: '100%',
  },
});