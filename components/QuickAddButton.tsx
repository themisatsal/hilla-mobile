import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';

interface QuickAddButtonProps {
  icon: React.ReactNode;
  label: string;
  backgroundColor: string;
  borderColor?: string;
  style?: any;
  onPress?: () => void;
}

export default function QuickAddButton({ 
  icon, 
  label, 
  backgroundColor, 
  borderColor,
  style,
  onPress
}: QuickAddButtonProps) {
  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        { 
          backgroundColor,
          borderColor: borderColor || 'rgba(255, 255, 255, 0.6)'
        },
        style
      ]} 
      activeOpacity={0.8}
      onPress={onPress}
    >
      <View style={styles.iconContainer}>
        {icon}
      </View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    minHeight: 88,
    gap: 12,
    width: '48%',
    maxWidth: 200,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1D1D1F',
    textAlign: 'center',
    fontWeight: '600',
  },
});