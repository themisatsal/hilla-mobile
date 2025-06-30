import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, TextInput, Alert, Modal, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Clock, Search, Plus, Camera, Barcode, Mic, Zap, Sparkles, ChevronRight, Star, TrendingUp, X, Image as ImageIcon } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';

const getResponsiveDimensions = () => {
  const { width, height } = Dimensions.get('window');
  return {
    width,
    height,
    isTablet: width >= 768,
    isDesktop: width >= 1024,
    isSmall: width < 375,
  };
};

export default function LogScreen() {
  // ... [rest of the component code remains exactly the same until the handleGalleryPick function]

  const handleGalleryPick = async () => {
    try {
      // Launch image library
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setCapturedImage(result.assets[0].uri);
        setPhotoModalVisible(true);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to select image. Please try again.');
    }
  };

  // ... [rest of the component code remains exactly the same]

  return (
    // ... [rest of the JSX remains exactly the same]
  );
}

const styles = StyleSheet.create({
  // ... [styles remain exactly the same]
});