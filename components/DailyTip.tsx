import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Lightbulb, ExternalLink } from 'lucide-react-native';

interface DailyTipProps {
  tip: string;
  category: string;
  source?: string;
  sourceUrl?: string;
  accentColor?: string;
}

export default function DailyTip({ 
  tip, 
  category, 
  source, 
  sourceUrl, 
  accentColor = '#FF9500' 
}: DailyTipProps) {
  return (
    <View style={styles.container}>
      <View style={[styles.accentStripe, { backgroundColor: accentColor }]} />
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Lightbulb size={16} color={accentColor} />
          </View>
          <Text style={[styles.category, { color: accentColor }]}>Daily Tip • {category}</Text>
        </View>
        <Text style={styles.tip}>{tip}</Text>
        
        {source && (
          <View style={styles.sourceContainer}>
            <View style={styles.sourceDivider} />
            <View style={styles.sourceRow}>
              <Text style={styles.sourceLabel}>Source: </Text>
              <Text style={styles.sourceText}>{source}</Text>
              {sourceUrl && (
                <TouchableOpacity style={styles.sourceLink} activeOpacity={0.7}>
                  <ExternalLink size={12} color="#007AFF" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    flexDirection: 'row',
    minHeight: 100,
  },
  accentStripe: {
    width: 4,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    backgroundColor: '#F2F2F7',
  },
  category: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: '600',
  },
  tip: {
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    color: '#1D1D1F',
    lineHeight: 22,
    marginBottom: 12,
  },
  sourceContainer: {
    marginTop: 8,
  },
  sourceDivider: {
    height: 1,
    backgroundColor: '#F2F2F7',
    marginBottom: 8,
  },
  sourceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  sourceLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#8E8E93',
    fontWeight: '500',
  },
  sourceText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
    flex: 1,
    marginRight: 8,
  },
  sourceLink: {
    padding: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
  },
});