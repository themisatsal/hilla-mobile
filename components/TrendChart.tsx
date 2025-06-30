import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Svg, Path, Circle, Defs, LinearGradient, Stop, Line } from 'react-native-svg';

interface TrendChartProps {
  data: Array<{ label: string; value: number }>;
  target: number;
  color: string;
}

const { width: screenWidth } = Dimensions.get('window');

export default function TrendChart({ data, target, color }: TrendChartProps) {
  // Responsive chart sizing
  const getChartDimensions = () => {
    const containerPadding = 32; // Account for container padding
    const availableWidth = screenWidth - containerPadding;
    
    return {
      width: Math.min(availableWidth, 400), // Max width for larger screens
      height: screenWidth < 375 ? 140 : 160, // Responsive height
      padding: screenWidth < 375 ? 24 : 32,
    };
  };

  const { width: chartWidth, height: chartHeight, padding } = getChartDimensions();
  
  const innerWidth = chartWidth - (padding * 2);
  const innerHeight = chartHeight - (padding * 2);
  
  const maxValue = Math.max(...data.map(d => d.value), target) * 1.1;
  const minValue = Math.max(0, Math.min(...data.map(d => d.value)) * 0.8);
  const valueRange = maxValue - minValue;
  
  const points = data.map((item, index) => {
    const x = padding + (index / (data.length - 1)) * innerWidth;
    const y = padding + ((maxValue - item.value) / valueRange) * innerHeight;
    return { x, y, value: item.value, label: item.label };
  });

  // Target line Y position
  const targetY = padding + ((maxValue - target) / valueRange) * innerHeight;

  // Create smooth curve path
  const createSmoothPath = (points: Array<{x: number, y: number}>) => {
    if (points.length < 2) return '';
    
    let path = `M ${points[0].x} ${points[0].y}`;
    
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      
      if (i === 1) {
        // First curve
        const cp1x = prev.x + (curr.x - prev.x) * 0.3;
        const cp1y = prev.y;
        const cp2x = curr.x - (curr.x - prev.x) * 0.3;
        const cp2y = curr.y;
        path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
      } else {
        // Smooth curves for middle points
        const cp1x = prev.x + (curr.x - prev.x) * 0.3;
        const cp1y = prev.y;
        const cp2x = curr.x - (curr.x - prev.x) * 0.3;
        const cp2y = curr.y;
        path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
      }
    }
    
    return path;
  };

  const pathData = createSmoothPath(points);

  // Responsive font sizes
  const fontSize = screenWidth < 375 ? 10 : 11;

  return (
    <View style={styles.container}>
      <View style={[styles.chartContainer, { width: chartWidth, height: chartHeight }]}>
        <Svg width={chartWidth} height={chartHeight}>
          <Defs>
            <LinearGradient id={`lineGradient-${color}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor={color} stopOpacity="0.8" />
              <Stop offset="50%" stopColor={color} stopOpacity="0.9" />
              <Stop offset="100%" stopColor={color} stopOpacity="0.8" />
            </LinearGradient>
            <LinearGradient id={`areaGradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor={color} stopOpacity="0.15" />
              <Stop offset="100%" stopColor={color} stopOpacity="0.02" />
            </LinearGradient>
          </Defs>
          
          {/* Grid lines for better readability */}
          {[0.25, 0.5, 0.75].map((fraction, index) => {
            const y = padding + (innerHeight * fraction);
            return (
              <Line
                key={index}
                x1={padding}
                y1={y}
                x2={chartWidth - padding}
                y2={y}
                stroke="#F2F2F7"
                strokeWidth={1}
                strokeOpacity={0.5}
              />
            );
          })}
          
          {/* Target line with improved styling */}
          <Line
            x1={padding}
            y1={targetY}
            x2={chartWidth - padding}
            y2={targetY}
            stroke="#FF9500"
            strokeWidth={2}
            strokeDasharray="8,4"
            strokeOpacity={0.8}
          />
          
          {/* Area under curve */}
          <Path
            d={`${pathData} L ${points[points.length - 1].x} ${chartHeight - padding} L ${points[0].x} ${chartHeight - padding} Z`}
            fill={`url(#areaGradient-${color})`}
          />
          
          {/* Main curve with enhanced styling */}
          <Path
            d={pathData}
            stroke={`url(#lineGradient-${color})`}
            strokeWidth={3}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              filter: 'drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.1))',
            }}
          />
          
          {/* Data points with improved visibility */}
          {points.map((point, index) => (
            <g key={index}>
              {/* Outer glow */}
              <Circle
                cx={point.x}
                cy={point.y}
                r={10}
                fill={color}
                fillOpacity={0.1}
              />
              {/* Main point */}
              <Circle
                cx={point.x}
                cy={point.y}
                r={5}
                fill="#FFFFFF"
                stroke={color}
                strokeWidth={3}
                style={{
                  filter: 'drop-shadow(0px 1px 3px rgba(0, 0, 0, 0.2))',
                }}
              />
              {/* Inner dot */}
              <Circle
                cx={point.x}
                cy={point.y}
                r={2}
                fill={color}
              />
            </g>
          ))}
        </Svg>
        
        {/* Labels with improved spacing */}
        <View style={[styles.labelsContainer, { paddingHorizontal: padding - 8 }]}>
          {data.map((item, index) => (
            <View key={index} style={styles.labelWrapper}>
              <Text style={[styles.label, { fontSize }]} numberOfLines={1} adjustsFontSizeToFit>
                {item.label}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 0.5,
    borderColor: 'rgba(0, 0, 0, 0.04)',
  },
  chartContainer: {
    position: 'relative',
    alignSelf: 'center',
  },
  labelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  labelWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  label: {
    fontFamily: 'Inter-Medium',
    color: '#8E8E93',
    fontWeight: '500',
    textAlign: 'center',
  },
});