import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, Image as ImageIcon, CircleAlert as AlertCircle } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useSetAtom } from 'jotai';
import { analysisAtom } from '@/atoms/analysis';

export default function FoodAnalysisScreen() {
  const router = useRouter();
  const setAnalysis = useSetAtom(analysisAtom);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const captureImage = async (useCamera: boolean) => {
    try {
      setLoading(true);
      setError(null);
      
      let result;
      
      if (useCamera) {
        // Request camera permissions
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Permission Required',
            'Camera access is needed to take photos of your food',
            [{ text: 'OK' }]
          );
          setLoading(false);
          return;
        }
        
        // Launch camera
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.8,
          base64: true,
        });
      } else {
        // Launch image library
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.8,
          base64: true,
        });
      }
      
      if (result.canceled) {
        setLoading(false);
        return;
      }
      
      if (!result.assets || !result.assets[0].base64) {
        throw new Error('Failed to get image data');
      }
      
      // For demo purposes, use mock data if in development
      if (__DEV__ && process.env.EXPO_PUBLIC_USE_MOCK_DATA === 'true') {
        // Import mock data
        const mockData = require('@/assets/response.json');
        mockData.foodAnalysis.image = result.assets[0].uri;
        
        // Simulate API delay
        setTimeout(() => {
          setAnalysis(mockData.foodAnalysis);
          setLoading(false);
          router.push('/food-analysis/result');
        }, 1500);
        
        return;
      }
      
      // Send image to API for analysis
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: {
            inlineData: {
              data: result.assets[0].base64,
              mimeType: 'image/jpeg',
            },
          },
        }),
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.success || !data.data || !data.data.foodAnalysis) {
        throw new Error('Invalid response from API');
      }
      
      // Add image URI to the analysis data
      const foodAnalysis = data.data.foodAnalysis;
      foodAnalysis.image = result.assets[0].uri;
      
      // Set analysis data and navigate to result screen
      setAnalysis(foodAnalysis);
      router.push('/food-analysis/result');
    } catch (err) {
      console.error('Error analyzing image:', err);
      setError(err instanceof Error ? err.message : 'Failed to analyze image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.headerSection}>
          <Text style={styles.title}>Food Analysis</Text>
          <Text style={styles.subtitle}>
            Take a photo of your food to get detailed nutritional information
          </Text>
        </View>
        
        <View style={styles.optionsContainer}>
          <TouchableOpacity 
            style={styles.optionCard}
            onPress={() => captureImage(true)}
            disabled={loading}
          >
            <View style={[styles.iconContainer, { backgroundColor: 'rgba(0, 122, 255, 0.1)' }]}>
              <Camera size={32} color="#007AFF" strokeWidth={2} />
            </View>
            <Text style={styles.optionTitle}>Take Photo</Text>
            <Text style={styles.optionDescription}>
              Use your camera to capture food
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.optionCard}
            onPress={() => captureImage(false)}
            disabled={loading}
          >
            <View style={[styles.iconContainer, { backgroundColor: 'rgba(52, 199, 89, 0.1)' }]}>
              <ImageIcon size={32} color="#34C759" strokeWidth={2} />
            </View>
            <Text style={styles.optionTitle}>Choose from Gallery</Text>
            <Text style={styles.optionDescription}>
              Select an existing food photo
            </Text>
          </TouchableOpacity>
        </View>
        
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Analyzing your food...</Text>
          </View>
        )}
        
        {error && (
          <View style={styles.errorContainer}>
            <AlertCircle size={24} color="#FF3B30" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
        
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>How it works</Text>
          <View style={styles.infoCard}>
            <Text style={styles.infoStep}>1. Take a clear photo of your food</Text>
            <Text style={styles.infoStep}>2. Our AI analyzes the image</Text>
            <Text style={styles.infoStep}>3. Get detailed nutritional information</Text>
            <Text style={styles.infoStep}>4. Save to your meal log (optional)</Text>
          </View>
          
          <Text style={styles.disclaimer}>
            Note: Analysis provides estimates based on visual recognition. Actual nutritional content may vary.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  headerSection: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#1D1D1F',
    marginBottom: 8,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
    lineHeight: 22,
  },
  optionsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  optionCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  optionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1D1D1F',
    marginBottom: 8,
    fontWeight: '600',
    textAlign: 'center',
  },
  optionDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
    textAlign: 'center',
  },
  loadingContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#1D1D1F',
    marginTop: 16,
    fontWeight: '500',
  },
  errorContainer: {
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  errorText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#FF3B30',
    marginLeft: 12,
    flex: 1,
    fontWeight: '500',
  },
  infoSection: {
    marginTop: 8,
  },
  infoTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1D1D1F',
    marginBottom: 12,
    fontWeight: '700',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  infoStep: {
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    color: '#1D1D1F',
    marginBottom: 12,
    paddingLeft: 16,
    position: 'relative',
  },
  disclaimer: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 18,
  },
});