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
  const [searchQuery, setSearchQuery] = useState('');
  const [photoModalVisible, setPhotoModalVisible] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const dimensions = getResponsiveDimensions();

  const recentMeals = [
    { id: 1, name: 'Greek Yogurt with Berries', time: '8:30 AM', calories: 180, type: 'breakfast' },
    { id: 2, name: 'Quinoa Salad Bowl', time: '12:45 PM', calories: 420, type: 'lunch' },
    { id: 3, name: 'Apple with Almond Butter', time: '3:15 PM', calories: 190, type: 'snack' },
  ];

  const quickAddItems = [
    { id: 1, name: 'Water', icon: '💧', calories: 0 },
    { id: 2, name: 'Coffee', icon: '☕', calories: 5 },
    { id: 3, name: 'Green Tea', icon: '🍵', calories: 2 },
    { id: 4, name: 'Banana', icon: '🍌', calories: 105 },
  ];

  const handleCameraCapture = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Camera permission is required to take photos.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
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
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

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

  const handleAnalyzeFood = async () => {
    if (!capturedImage) return;
    
    setIsAnalyzing(true);
    try {
      // Simulate API call for food analysis
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setPhotoModalVisible(false);
      setCapturedImage(null);
      
      // Navigate to analysis result
      router.push('/food-analysis/result');
    } catch (error) {
      console.error('Error analyzing food:', error);
      Alert.alert('Error', 'Failed to analyze food. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleVoiceInput = () => {
    Alert.alert('Voice Input', 'Voice input feature coming soon!');
  };

  const handleBarcodeScanner = () => {
    Alert.alert('Barcode Scanner', 'Barcode scanner feature coming soon!');
  };

  const handleQuickAdd = (item: any) => {
    Alert.alert('Quick Add', `Added ${item.name} to your log!`);
  };

  const getMealTypeColor = (type: string) => {
    switch (type) {
      case 'breakfast': return '#FF9B4A';
      case 'lunch': return '#28C391';
      case 'dinner': return '#8A6DFF';
      case 'snack': return '#FADDEA';
      default: return '#FAF9F7';
    }
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Food Log</Text>
        <Text style={styles.headerSubtitle}>Track your nutrition journey</Text>
      </View>

      {/* Command Palette */}
      <View style={styles.commandPalette}>
        <View style={styles.searchContainer}>
          <Search size={20} color="#8A6DFF" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Log or ask..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.actionButton} onPress={handleCameraCapture}>
              <Camera size={24} color="#8A6DFF" />
              <Text style={styles.actionText}>Photo</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton} onPress={handleGalleryPick}>
              <ImageIcon size={24} color="#8A6DFF" />
              <Text style={styles.actionText}>Gallery</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton} onPress={handleVoiceInput}>
              <Mic size={24} color="#8A6DFF" />
              <Text style={styles.actionText}>Voice</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton} onPress={handleBarcodeScanner}>
              <Barcode size={24} color="#8A6DFF" />
              <Text style={styles.actionText}>Scan</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Add */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Add</Text>
          <View style={styles.quickAddGrid}>
            {quickAddItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.quickAddItem}
                onPress={() => handleQuickAdd(item)}
              >
                <Text style={styles.quickAddIcon}>{item.icon}</Text>
                <Text style={styles.quickAddName}>{item.name}</Text>
                <Text style={styles.quickAddCalories}>{item.calories} cal</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Meals */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Meals</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {recentMeals.map((meal) => (
            <TouchableOpacity key={meal.id} style={styles.mealItem}>
              <View style={[styles.mealTypeIndicator, { backgroundColor: getMealTypeColor(meal.type) }]} />
              <View style={styles.mealInfo}>
                <Text style={styles.mealName}>{meal.name}</Text>
                <Text style={styles.mealTime}>{meal.time}</Text>
              </View>
              <View style={styles.mealStats}>
                <Text style={styles.mealCalories}>{meal.calories} cal</Text>
                <ChevronRight size={16} color="#999" />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Today's Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Summary</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>1,247</Text>
                <Text style={styles.summaryLabel}>Calories</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>65g</Text>
                <Text style={styles.summaryLabel}>Protein</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>8</Text>
                <Text style={styles.summaryLabel}>Glasses H₂O</Text>
              </View>
            </View>
            
            <TouchableOpacity style={styles.viewDetailsButton}>
              <TrendingUp size={16} color="#8A6DFF" />
              <Text style={styles.viewDetailsText}>View Detailed Analytics</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Wellness Tip */}
        <View style={styles.section}>
          <View style={styles.tipCard}>
            <View style={styles.tipHeader}>
              <Sparkles size={20} color="#FF9B4A" />
              <Text style={styles.tipTitle}>Daily Tip</Text>
            </View>
            <Text style={styles.tipText}>
              Iron boosts fetal oxygen. Add lentils at lunch.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Photo Analysis Modal */}
      <Modal
        visible={photoModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => {
                setPhotoModalVisible(false);
                setCapturedImage(null);
              }}
              style={styles.closeButton}
            >
              <X size={24} color="#1E1E28" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Analyze Food</Text>
            <View style={styles.placeholder} />
          </View>

          {capturedImage && (
            <View style={styles.imageContainer}>
              <Image source={{ uri: capturedImage }} style={styles.capturedImage} />
            </View>
          )}

          <View style={styles.modalContent}>
            <Text style={styles.analysisTitle}>AI Food Analysis</Text>
            <Text style={styles.analysisDescription}>
              Our AI will identify the food and estimate nutritional values including calories, macros, and key nutrients.
            </Text>

            <TouchableOpacity
              style={[styles.analyzeButton, isAnalyzing && styles.analyzeButtonDisabled]}
              onPress={handleAnalyzeFood}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <Text style={styles.analyzeButtonText}>Analyzing...</Text>
              ) : (
                <>
                  <Zap size={20} color="#FFFFFF" />
                  <Text style={styles.analyzeButtonText}>Analyze Food</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F7',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1E1E28',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  commandPalette: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1E1E28',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E1E28',
    marginBottom: 12,
  },
  seeAllText: {
    fontSize: 14,
    color: '#8A6DFF',
    fontWeight: '500',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  actionText: {
    fontSize: 12,
    color: '#1E1E28',
    marginTop: 8,
    fontWeight: '500',
  },
  quickAddGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickAddItem: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  quickAddIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  quickAddName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1E1E28',
    marginBottom: 4,
  },
  quickAddCalories: {
    fontSize: 12,
    color: '#666',
  },
  mealItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  mealTypeIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: 12,
  },
  mealInfo: {
    flex: 1,
  },
  mealName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1E1E28',
    marginBottom: 4,
  },
  mealTime: {
    fontSize: 14,
    color: '#666',
  },
  mealStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mealCalories: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1E1E28',
    marginRight: 8,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E1E28',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  viewDetailsText: {
    fontSize: 14,
    color: '#8A6DFF',
    fontWeight: '500',
    marginLeft: 8,
  },
  tipCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9B4A',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E1E28',
    marginLeft: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FAF9F7',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  closeButton: {
    padding: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E1E28',
  },
  placeholder: {
    width: 32,
  },
  imageContainer: {
    flex: 1,
    padding: 20,
  },
  capturedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    resizeMode: 'cover',
  },
  modalContent: {
    padding: 20,
  },
  analysisTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E1E28',
    marginBottom: 8,
  },
  analysisDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 24,
  },
  analyzeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8A6DFF',
    paddingVertical: 16,
    borderRadius: 12,
  },
  analyzeButtonDisabled: {
    opacity: 0.6,
  },
  analyzeButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 8,
  },
});