import { View, Text, StyleSheet, TextInput, Platform } from 'react-native';
import { User } from 'lucide-react-native';
import { useEffect, useRef } from 'react';

interface NameInputStepProps {
  name: string;
  onNameChange: (name: string) => void;
}

export default function NameInputStep({ name, onNameChange }: NameInputStepProps) {
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    // Focus the input when component mounts, but only on web
    if (Platform.OS === 'web') {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <View style={styles.stepContainer}>
      <View style={styles.iconContainer}>
        <User size={64} color="#B8A9FF" />
      </View>
      <Text style={styles.stepTitle}>What's your name?</Text>
      <Text style={styles.stepSubtitle}>
        Let's personalize your experience
      </Text>
      <TextInput
        ref={inputRef}
        style={styles.textInput}
        placeholder="Enter your name"
        value={name}
        onChangeText={onNameChange}
        autoFocus={Platform.OS !== 'web'} // Only auto-focus on native platforms
        autoComplete="name"
        autoCapitalize="words"
        autoCorrect={false}
        returnKeyType="done"
        blurOnSubmit={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  stepContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 24,
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
  textInput: {
    width: '100%',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    fontFamily: 'Inter-Regular',
    backgroundColor: '#FFFFFF',
    textAlign: 'center',
    ...(Platform.OS === 'web' && {
      outlineStyle: 'none', // Remove default web outline
    }),
  },
});