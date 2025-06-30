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
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [dimensions, setDimensions] = useState(getResponsiveDimensions());
  const [searchQuery, setSearchQuery] = useState('');
  const [photoModalVisible, setPhotoModalVisible] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', () => {
      setDimensions(getResponsiveDimensions());
    });
    return () => subscription?.remove();
  }, []);
  
  const recentFoods = [
    { 
      name: 'Greek Yogurt with Berries', 
      time: '8:30 AM', 
      calories: 180, 
      nutrients: ['Protein', 'Calcium'],
      mood: '😊',
      color: '#FF9500',
      rating: 4.5,
      ironContent: '2mg'
    },
    { 
      name: 'Prenatal Vitamin', 
      time: '8:00 AM', 
      calories: 0, 
      nutrients: ['Folate', 'Iron'],
      mood: '💊',
      color: '#007AFF',
      rating: 5,
      ironContent: '18mg'
    },
    { 
      name: 'Spinach Smoothie', 
      time: '7:45 AM', 
      calories: 220, 
      nutrients: ['Iron', 'Vitamin C'],
      mood: '🌱',
      color: '#34C759',
      rating: 4,
      ironContent: '3.5mg'
    },
  ];

  const quickAdd = [
    { name: 'Water (8 fl oz)', icon: '💧', color: '#007AFF', category: 'Hydration' },
    { name: 'Apple', icon: '🍎', color: '#34C759', category: 'Fruit' },
    { name: 'Almonds (1 oz)', icon: '🥜', color: '#FF9500', category: 'Snack' },
    { name: 'Prenatal Vitamin', icon: '💊', color: '#AF52DE', category: 'Supplement' },
    { name: 'Avocado Toast', icon: '🥑', color: '#34C759', category: 'Meal' },
    { name: 'Eggs (2 large)', icon: '🥚', color: '#FFD60A', category: 'Protein' },
  ];

  const mealSuggestions = [
    {
      title: 'Iron-Rich Power Bowl',
      description: 'Quinoa, spinach, chickpeas & pumpkin seeds',
      nutrients: ['18mg Iron', '60mg Vitamin C'],
      time: '25 min',
      mood: '💪',
      color: '#007AFF',
      difficulty: 'Easy',
      servings: 2
    },
    {
      title: 'Calcium Boost Smoothie',
      description: 'Greek yogurt, almonds & fortified plant milk',
      nutrients: ['300mg Calcium', '15g Protein'],
      time: '5 min',
      mood: '🦴',
      color: '#34C759',
      difficulty: 'Very Easy',
      servings: 1
    }
  ];

  // Calculate bottom padding to account for the tab bar
  const getBottomPadding = () => {
    const baseTabHeight = 90;
    const extraPadding = 40;
    
    return Platform.select({
      ios: baseTabHeight + Math.max(insets.bottom + 30, extraPadding),
      android: baseTabHeight + extraPadding,
      web: baseTabHeight + extraPadding,
      default: baseTabHeight + extraPadding,
    });
  };

  // Get responsive styles
  const getResponsiveStyles = () => {
    const { isTablet, isDesktop, isSmall } = dimensions;
    
    return {
      containerPadding: isDesktop ? 48 : isTablet ? 32 : isSmall ? 16 : 20,
      maxWidth: isDesktop ? 1200 : isTablet ? 800 : '100%',
      fontSize: {
        title: isDesktop ? 42 : isTablet ? 38 : isSmall ? 28 : 32,
        sectionTitle: isDesktop ? 28 : isTablet ? 26 : isSmall ? 18 : 20,
      },
    };
  };

  const responsiveStyles = getResponsiveStyles();

  const handleQuickAdd = (item: any) => {
    Alert.alert('Quick Add', `Added ${item.name} to your log!`);
  };

  const handleFoodLog = (food: any) => {
    Alert.alert('Food Details', `View details for ${food.name}`);
  };
  
  const handleVoiceInput = () => {
    Alert.alert('Voice Input', 'Listening for food description...');
  };

  const handleMealSuggestion = (meal: any) => {
    router.push('/meal-details/1');
  };


  const handlePhotoCapture = async () => {
    try {
      // Request camera permissions
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Camera access is needed to take photos of your food',
          [{ text: 'OK' }]
        );
        return;
      }
      
      // Launch camera
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

  const handleAnalyzePhoto = () => {
    setAnalyzing(true);
    
    // Simulate analysis delay
    setTimeout(() => {
      setPhotoModalVisible(false);
      setAnalyzing(false);
      setCapturedImage(null);
      
      // Navigate to food analysis screen
      router.push('/food-analysis');
    }, 1000);
  };


  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={12}
        color={index < Math.floor(rating) ? '#FFD60A' : '#E5E5EA'}
        fill={index < Math.floor(rating) ? '#FFD60A' : 'transparent'}
      />
    ));
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <View style={[styles.contentWrapper, { 
          maxWidth: responsiveStyles.maxWidth,
          alignSelf: 'center',
          width: '100%'
        }]}>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            { 
              paddingBottom: getBottomPadding(),
              paddingHorizontal: responsiveStyles.containerPadding
            }
          ]}
          bounces={true}
          scrollEventThrottle={16}
        >
          {/* Header */}
          <View style={[styles.header, { paddingHorizontal: 0 }]}>
            <Text style={[styles.title, { fontSize: responsiveStyles.fontSize.title }]}>Nutrition Log</Text>
            <Text style={styles.subtitle}>Track your meals and nutrients</Text>
          </View>

          {/* Enhanced Search Bar */}
          <View style={[styles.searchSection, { paddingHorizontal: 0 }]}>
            <View style={styles.searchBar}>
              <Search size={20} color="#8E8E93" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search foods or ask Hilla..."
                placeholderTextColor="#8E8E93"
                placeholderTextColor="#8E8E93"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              <TouchableOpacity style={styles.voiceButton} activeOpacity={0.7} onPress={handleVoiceInput}>
                <Mic size={16} color="#007AFF" />
              </TouchableOpacity>
            </View>

            <View style={styles.captureButtons}>
              <TouchableOpacity 
                style={styles.captureButton} 
                activeOpacity={0.8} 
                onPress={handlePhotoCapture}
              >
                <Camera size={20} color="#FFFFFF" />
                <Text style={styles.captureText}>Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.captureButton, { backgroundColor: '#34C759' }]} 
                activeOpacity={0.8} 
                onPress={handleGalleryPick}
              >
                <ImageIcon size={20} color="#FFFFFF" />
                <Text style={styles.captureText}>Gallery</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.captureButton, { backgroundColor: '#FF9500' }]} 
                activeOpacity={0.8} 
                onPress={handleBarcodeScan}
              >
                <Barcode size={20} color="#FFFFFF" />
                <Text style={styles.captureText}>Scan</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Today's Summary */}
          <View style={[styles.section, { paddingHorizontal: 0 }]}>
            <Text style={[styles.sectionTitle, { fontSize: responsiveStyles.fontSize.sectionTitle }]}>Today's Summary</Text>
            <View style={styles.summaryCard}>
              <View style={styles.summaryStats}>
                <View style={styles.summaryStatItem}>
                  <Text style={styles.summaryStatValue}>1,240</Text>
                  <Text style={styles.summaryStatLabel}>Calories</Text>
                  <Text style={styles.summaryStatTarget}>of 2,200</Text>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryStatItem}>
                  <Text style={styles.summaryStatValue}>23.5mg</Text>
                  <Text style={styles.summaryStatLabel}>Iron</Text>
                  <Text style={styles.summaryStatTarget}>of 25mg</Text>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryStatItem}>
                  <Text style={styles.summaryStatValue}>5</Text>
                  <Text style={styles.summaryStatLabel}>Water</Text>
                  <Text style={styles.summaryStatTarget}>of 8 glasses</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Recent Foods */}
          <View style={[styles.section, { paddingHorizontal: 0 }]}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <Clock size={18} color="#8E8E93" />
                <Text style={[styles.sectionTitle, { fontSize: responsiveStyles.fontSize.sectionTitle }]}>Recent Foods</Text>
              </View>
              <TouchableOpacity style={styles.seeAllButton} activeOpacity={0.7}>
                <Text style={styles.seeAllText}>See all</Text>
                <ChevronRight size={14} color="#007AFF" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.recentFoodsContainer}>
              {recentFoods.map((food, index) => (
                <TouchableOpacity key={index} style={styles.foodCard} activeOpacity={0.8} onPress={() => handleFoodLog(food)}>
                  <View style={styles.foodHeader}>
                    <Text style={styles.foodMood}>{food.mood}</Text>
                    <View style={styles.foodRating}>
                      {renderStars(food.rating)}
                    </View>
                    <View style={[styles.foodColorDot, { backgroundColor: food.color }]} />
                  </View>
                  <View style={styles.foodInfo}>
                    <Text style={styles.foodName}>{food.name}</Text>
                    <Text style={styles.foodTime}>{food.time}</Text>
                    <View style={styles.foodDetails}>
                      <Text style={styles.foodCalories}>{food.calories} cal</Text>
                      <Text style={styles.foodIron}>Iron: {food.ironContent}</Text>
                    </View>
                    <View style={styles.nutrientTags}>
                      {food.nutrients.map((nutrient, idx) => (
                        <View key={idx} style={[styles.nutrientTag, {
                          backgroundColor: `${food.color}15`
                        }]}>
                          <Text style={[styles.nutrientTagText, { color: food.color }]}>{nutrient}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                  <TouchableOpacity style={[styles.addButton, { backgroundColor: food.color }]} activeOpacity={0.7}>
                    <Plus size={16} color="#FFFFFF" />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Quick Add Grid */}
          <View style={[styles.section, { paddingHorizontal: 0 }]}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { fontSize: responsiveStyles.fontSize.sectionTitle }]}>Quick Add</Text>
              <TouchableOpacity style={styles.customizeButton} activeOpacity={0.7}>
                <Sparkles size={14} color="#FF9500" />
                <Text style={styles.customizeText}>Customize</Text>
              </TouchableOpacity>
            </View>
            
            <View style={[styles.quickAddGrid, {
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: dimensions.isTablet ? 'flex-start' : 'space-between',
              gap: 12
            }]}>
              {quickAdd.map((item, index) => (
                <TouchableOpacity key={index} style={[styles.quickAddCard, {
                  backgroundColor: `${item.color}10`,
                  borderColor: `${item.color}30`,
                  width: dimensions.isTablet ? `${100 / responsiveStyles.gridColumns - 3}%` : '47%'
                }]} activeOpacity={0.8} onPress={() => handleQuickAdd(item)}>
                  <View style={[styles.quickAddIcon, { backgroundColor: `${item.color}20` }]}>
                    <Text style={styles.quickAddEmoji}>{item.icon}</Text>
                  </View>
                  <Text style={styles.quickAddText}>{item.name}</Text>
                  <Text style={styles.quickAddCategory}>{item.category}</Text>
                  <TouchableOpacity style={[styles.quickAddButton, { backgroundColor: item.color }]} activeOpacity={0.7}>
                    <Plus size={12} color="#FFFFFF" />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Meal Suggestions */}
          <View style={[styles.section, { paddingHorizontal: 0 }]}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { fontSize: responsiveStyles.fontSize.sectionTitle }]}>Meal Ideas for You</Text>
              <TouchableOpacity style={styles.aiButton} activeOpacity={0.7}>
                <Zap size={14} color="#FF9500" />
                <Text style={styles.aiText}>AI</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.mealSuggestions}>
              {mealSuggestions.map((meal, index) => (
                <TouchableOpacity key={index} style={styles.mealCard} activeOpacity={0.8} onPress={() => handleMealSuggestion(meal)}>
                  <View style={styles.mealImageContainer}>
                    <View style={[styles.mealImage, { backgroundColor: `${meal.color}15` }]}>
                      <Text style={styles.mealMood}>{meal.mood}</Text>
                    </View>
                    <View style={styles.mealBadges}>
                      <View style={styles.mealTime}>
                        <Text style={styles.mealTimeText}>{meal.time}</Text>
                      </View>
                      <View style={styles.mealDifficulty}>
                        <Text style={styles.mealDifficultyText}>{meal.difficulty}</Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.mealContent}>
                    <View style={styles.mealHeader}>
                      <Text style={styles.mealTitle}>{meal.title}</Text>
                      <View style={styles.mealServings}>
                        <Text style={styles.mealServingsText}>{meal.servings} servings</Text>
                      </View>
                    </View>
                    <Text style={styles.mealDescription}>{meal.description}</Text>
                    <View style={styles.mealNutrients}>
                      {meal.nutrients.map((nutrient, idx) => (
                        <View key={idx} style={[styles.mealNutrientTag, {
                          backgroundColor: `${meal.color}15`
                        }]}>
                          <Text style={[styles.mealNutrientText, { color: meal.color }]}>{nutrient}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Hydration Tracking */}
          <View style={[styles.section, { paddingHorizontal: 0, marginBottom: 16 }]}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { fontSize: responsiveStyles.fontSize.sectionTitle }]}>Hydration Goal</Text>
              <View style={styles.hydrationProgress}>
                <Text style={styles.hydrationProgressText}>5 of 8 glasses</Text>
                <View style={styles.hydrationTrend}>
                  <TrendingUp size={12} color="#34C759" />
                  <Text style={styles.hydrationTrendText}>+2 vs yesterday</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.hydrationCard}>
              <View style={styles.hydrationHeader}>
                <Text style={styles.hydrationTitle}>Daily Water Intake</Text>
                <Text style={styles.hydrationAmount}>40 fl oz</Text>
              </View>
              
              <View style={styles.waterGlasses}>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((glass, index) => (
                  <TouchableOpacity 
                    key={index} 
                    style={[
                      styles.waterGlass, 
                      index < 5 && styles.waterGlassFilled,
                      dimensions.isTablet && { width: 40, height: 48 }
                    ]}
                    activeOpacity={0.7}
                    onPress={() => {
                      if (index < 5) {
                        // Remove water glass
                        Alert.alert('Remove Water', `Removed glass ${glass} from your log!`);
                      } else {
                        // Add water glass
                        handleQuickAdd({ name: 'Water (8 fl oz)', icon: '💧' });
                      }
                    }}
                  >
                    <Text style={[
                      styles.glassNumber,
                      index < 5 && styles.glassNumberFilled
                    ]}>
                      {glass}
                    </Text>
                    {index < 5 && (
                      <View style={styles.removeIndicator}>
                        <Text style={styles.removeText}>-</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
              
              <View style={styles.waterActions}>
                <TouchableOpacity style={styles.removeWaterButton} activeOpacity={0.8} onPress={() => Alert.alert('Remove Water', 'Removed 1 glass from your log!')}>
                  <Text style={styles.removeWaterText}>Remove Glass</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.addWaterButton} activeOpacity={0.8} onPress={() => handleQuickAdd({ name: 'Water (8 fl oz)', icon: '💧' })}>
                  <Plus size={14} color="#FFFFFF" />
                  <Text style={styles.addWaterText}>Add Glass</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* View Details Explanation */}
          <View style={[styles.section, { paddingHorizontal: 0 }]}>
            <View style={styles.detailsExplanationCard}>
              <Text style={styles.detailsTitle}>What's in "View Details"?</Text>
              <View style={styles.detailsList}>
                <View style={styles.detailsItem}>
                  <Text style={styles.detailsBullet}>•</Text>
                  <Text style={styles.detailsText}>Complete nutrient breakdown (vitamins, minerals, macros)</Text>
                </View>
                <View style={styles.detailsItem}>
                  <Text style={styles.detailsBullet}>•</Text>
                  <Text style={styles.detailsText}>Weekly trends and progress charts</Text>
                </View>
                <View style={styles.detailsItem}>
                  <Text style={styles.detailsBullet}>•</Text>
                  <Text style={styles.detailsText}>Personalized recommendations based on your stage</Text>
                </View>
                <View style={styles.detailsItem}>
                  <Text style={styles.detailsBullet}>•</Text>
                  <Text style={styles.detailsText}>Meal timing and absorption optimization tips</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.viewDetailsButton} activeOpacity={0.8}>
                <Text style={styles.viewDetailsButtonText}>Explore Detailed Analytics</Text>
                <ChevronRight size={16} color="#007AFF" />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
        </View>
        
        {/* Photo Capture Modal */}
        <Modal
          visible={photoModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={closePhotoModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Food Photo</Text>
                <TouchableOpacity 
                  style={styles.closeButton} 
                  onPress={closePhotoModal}
                >
                  <X size={24} color="#1D1D1F" />
                </TouchableOpacity>
              </View>
              
              {capturedImage && (
                <View style={styles.imagePreviewContainer}>
                  <Image 
                    source={{ uri: capturedImage }} 
                    style={styles.imagePreview} 
                    resizeMode="cover"
                  />
                </View>
              )}
              
              <View style={styles.modalActions}>
                <TouchableOpacity 
                  style={styles.cancelButton} 
                  onPress={closePhotoModal}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.analyzeButton}
                  onPress={handleAnalyzePhoto}
                  disabled={analyzing}
                >
                  {analyzing ? (
                    <Text style={styles.analyzeButtonText}>Analyzing...</Text>
                  ) : (
                    <>
                      <Zap size={16} color="#FFFFFF" />
                      <Text style={styles.analyzeButtonText}>Analyze</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  safeArea: {
    flex: 1,
  },
  contentWrapper: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 24,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#1D1D1F',
    letterSpacing: -0.6,
    marginBottom: 8,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 17,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
    letterSpacing: 0.2,
  },
  searchSection: {
    marginBottom: 32,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1D1D1F',
  },
  voiceButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtons: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  captureButton: {
    flex: 1, 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    borderRadius: 16,
    padding: 16,
    gap: 8,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  captureText: {
    fontSize: 15,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    fontWeight: '600',
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1D1D1F',
    fontWeight: '700',
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  summaryStatItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryStatValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1D1D1F',
    fontWeight: '700',
    marginBottom: 4,
  },
  summaryStatLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#8E8E93',
    fontWeight: '500',
    marginBottom: 2,
  },
  summaryStatTarget: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#F2F2F7',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
  },
  seeAllText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#007AFF',
    fontWeight: '600',
  },
  customizeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 149, 0, 0.1)',
  },
  customizeText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#FF9500',
    fontWeight: '600',
  },
  recentFoodsContainer: {
    gap: 16,
  },
  foodCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  foodHeader: {
    alignItems: 'center',
    marginRight: 16,
  },
  foodMood: {
    fontSize: 24,
    marginBottom: 8,
  },
  foodRating: {
    flexDirection: 'row',
    gap: 2,
    marginBottom: 8,
  },
  foodColorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  foodInfo: {
    flex: 1,
  },
  foodName: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#1D1D1F',
    marginBottom: 4,
    fontWeight: '600',
  },
  foodTime: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
    marginBottom: 8,
  },
  foodDetails: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  foodCalories: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: '#8E8E93',
    fontWeight: '500',
  },
  foodIron: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: '#FF9500',
    fontWeight: '500',
  },
  nutrientTags: {
    flexDirection: 'row',
    gap: 8,
  },
  nutrientTag: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  nutrientTagText: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    fontWeight: '600',
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  quickAddGrid: {
    gap: 12,
  },
  quickAddCard: {
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    minHeight: 120,
    justifyContent: 'space-between',
  },
  quickAddIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickAddEmoji: {
    fontSize: 20,
  },
  quickAddText: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: '#1D1D1F',
    textAlign: 'center',
    marginBottom: 4,
    fontWeight: '600',
  },
  quickAddCategory: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 8,
  },
  quickAddButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 149, 0, 0.1)',
  },
  aiText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#FF9500',
    fontWeight: '700',
  },
  mealSuggestions: {
    gap: 16,
  },
  mealCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  mealImageContainer: {
    position: 'relative',
    height: 120,
  },
  mealImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mealMood: {
    fontSize: 40,
  },
  mealBadges: {
    position: 'absolute',
    top: 12,
    right: 12,
    gap: 8,
  },
  mealTime: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  mealTimeText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    fontWeight: '600',
  },
  mealDifficulty: {
    backgroundColor: 'rgba(52, 199, 89, 0.9)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  mealDifficultyText: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    fontWeight: '600',
  },
  mealContent: {
    padding: 16,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  mealTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#1D1D1F',
    fontWeight: '700',
    flex: 1,
    marginRight: 8,
  },
  mealServings: {
    backgroundColor: '#F2F2F7',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  mealServingsText: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    color: '#8E8E93',
    fontWeight: '500',
  },
  mealDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
    marginBottom: 12,
    lineHeight: 20,
  },
  mealNutrients: {
    flexDirection: 'row',
    gap: 8,
  },
  mealNutrientTag: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  mealNutrientText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    fontWeight: '600',
  },
  hydrationProgress: {
    alignItems: 'flex-end',
  },
  hydrationProgressText: {
    fontSize: 15,
    fontFamily: 'Inter-Medium',
    color: '#007AFF',
    fontWeight: '600',
    marginBottom: 4,
  },
  hydrationTrend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  hydrationTrendText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#34C759',
  },
  hydrationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  hydrationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  hydrationTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#1D1D1F',
    fontWeight: '600',
  },
  hydrationAmount: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#007AFF',
    fontWeight: '700',
  },
  waterGlasses: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  waterGlass: {
    width: 32,
    height: 40,
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    position: 'relative',
  },
  waterGlassFilled: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  removeIndicator: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    fontWeight: '700',
  },
  glassNumber: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#8E8E93',
    fontWeight: '700',
  },
  glassNumberFilled: {
    color: '#FFFFFF',
  },
  waterActions: {
    flexDirection: 'row',
    gap: 12,
  },
  removeWaterButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  removeWaterText: {
    fontSize: 15,
    fontFamily: 'Inter-Medium',
    color: '#8E8E93',
    fontWeight: '600',
  },
  addWaterButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  addWaterText: {
    fontSize: 15,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    fontWeight: '600',
  },
  detailsExplanationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  detailsTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1D1D1F',
    marginBottom: 16,
    fontWeight: '700',
  },
  detailsList: {
    marginBottom: 16,
  },
  detailsItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  detailsBullet: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#007AFF',
    marginRight: 8,
    fontWeight: '700',
    marginTop: 2,
  },
  detailsText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#1D1D1F',
    lineHeight: 20,
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  viewDetailsButtonText: {
    fontSize: 15,
    fontFamily: 'Inter-Medium',
    color: '#007AFF',
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1D1D1F',
    fontWeight: '600',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePreviewContainer: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
    backgroundColor: '#F2F2F7',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#8E8E93',
    fontWeight: '500',
  },
  analyzeButton: {
    flex: 2,
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  analyzeButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    fontWeight: '600',
  },
});