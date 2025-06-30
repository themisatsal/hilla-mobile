import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Star, Clock, Users, ChefHat, Plus, Minus, Heart, Share2 } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function MealDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [servings, setServings] = useState(2);
  const [isFavorited, setIsFavorited] = useState(false);

  // Mock meal data - in real app this would come from API
  const mealData = {
    '1': {
      title: 'Iron-Rich Power Bowl',
      description: 'A nutrient-dense bowl packed with iron, protein, and vitamins perfect for pregnancy',
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
      prepTime: '15 min',
      cookTime: '10 min',
      difficulty: 'Easy',
      rating: 4.8,
      reviews: 127,
      servings: 2,
      nutrients: {
        iron: '18mg',
        protein: '24g',
        fiber: '12g',
        vitaminC: '60mg',
        calories: 420
      },
      ingredients: [
        { name: 'Quinoa, cooked', amount: '1 cup', iron: '2.8mg' },
        { name: 'Baby spinach', amount: '2 cups', iron: '3.6mg' },
        { name: 'Chickpeas, cooked', amount: '1/2 cup', iron: '2.4mg' },
        { name: 'Pumpkin seeds', amount: '2 tbsp', iron: '2.1mg' },
        { name: 'Red bell pepper', amount: '1/2 cup', iron: '0.3mg', vitC: '95mg' },
        { name: 'Avocado', amount: '1/2 medium', iron: '0.6mg' },
        { name: 'Lemon juice', amount: '1 tbsp', vitC: '7mg' },
        { name: 'Olive oil', amount: '1 tbsp', iron: '0.1mg' }
      ],
      instructions: [
        'Cook quinoa according to package directions and let cool slightly',
        'Wash and dry baby spinach thoroughly',
        'Dice red bell pepper and slice avocado',
        'In a large bowl, combine quinoa, spinach, and chickpeas',
        'Top with bell pepper, avocado, and pumpkin seeds',
        'Drizzle with olive oil and lemon juice',
        'Toss gently and serve immediately'
      ],
      tips: [
        'Pair with vitamin C-rich foods like bell peppers to enhance iron absorption',
        'Add a squeeze of lemon for extra vitamin C and flavor',
        'Can be made ahead - just add avocado before serving'
      ]
    }
  };

  const meal = mealData[id as keyof typeof mealData];

  if (!meal) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Meal not found</Text>
      </SafeAreaView>
    );
  }

  const adjustedIngredients = meal.ingredients.map(ingredient => ({
    ...ingredient,
    amount: adjustAmount(ingredient.amount, servings / meal.servings)
  }));

  function adjustAmount(amount: string, multiplier: number): string {
    const match = amount.match(/^(\d+(?:\.\d+)?)\s*(.*)$/);
    if (match) {
      const [, num, unit] = match;
      const adjusted = (parseFloat(num) * multiplier).toFixed(1);
      return `${adjusted} ${unit}`;
    }
    return amount;
  }

  const handleAddToLog = () => {
    Alert.alert('Added to Log', `${meal.title} (${servings} servings) added to your nutrition log!`);
  };

  const handleShare = () => {
    Alert.alert('Share Recipe', 'Recipe shared successfully!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: meal.image }} style={styles.mealImage} />
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.favoriteButton} 
            onPress={() => setIsFavorited(!isFavorited)}
          >
            <Heart 
              size={24} 
              color={isFavorited ? "#FF3B30" : "#FFFFFF"} 
              fill={isFavorited ? "#FF3B30" : "transparent"}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {/* Title and Rating */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>{meal.title}</Text>
            <View style={styles.ratingContainer}>
              <Star size={16} color="#FFD60A" fill="#FFD60A" />
              <Text style={styles.rating}>{meal.rating}</Text>
              <Text style={styles.reviews}>({meal.reviews} reviews)</Text>
            </View>
          </View>

          <Text style={styles.description}>{meal.description}</Text>

          {/* Quick Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Clock size={16} color="#8E8E93" />
              <Text style={styles.statText}>{meal.prepTime}</Text>
            </View>
            <View style={styles.statItem}>
              <ChefHat size={16} color="#8E8E93" />
              <Text style={styles.statText}>{meal.difficulty}</Text>
            </View>
            <View style={styles.statItem}>
              <Users size={16} color="#8E8E93" />
              <Text style={styles.statText}>{servings} servings</Text>
            </View>
          </View>

          {/* Servings Adjuster */}
          <View style={styles.servingsContainer}>
            <Text style={styles.sectionTitle}>Servings</Text>
            <View style={styles.servingsControls}>
              <TouchableOpacity 
                style={styles.servingsButton}
                onPress={() => setServings(Math.max(1, servings - 1))}
              >
                <Minus size={16} color="#007AFF" />
              </TouchableOpacity>
              <Text style={styles.servingsText}>{servings}</Text>
              <TouchableOpacity 
                style={styles.servingsButton}
                onPress={() => setServings(servings + 1)}
              >
                <Plus size={16} color="#007AFF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Nutrition Highlights */}
          <View style={styles.nutritionSection}>
            <Text style={styles.sectionTitle}>Nutrition Highlights</Text>
            <View style={styles.nutritionGrid}>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>{meal.nutrients.iron}</Text>
                <Text style={styles.nutritionLabel}>Iron</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>{meal.nutrients.protein}</Text>
                <Text style={styles.nutritionLabel}>Protein</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>{meal.nutrients.vitaminC}</Text>
                <Text style={styles.nutritionLabel}>Vitamin C</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>{meal.nutrients.calories}</Text>
                <Text style={styles.nutritionLabel}>Calories</Text>
              </View>
            </View>
          </View>

          {/* Ingredients */}
          <View style={styles.ingredientsSection}>
            <Text style={styles.sectionTitle}>Ingredients</Text>
            {adjustedIngredients.map((ingredient, index) => (
              <View key={index} style={styles.ingredientItem}>
                <Text style={styles.ingredientAmount}>{ingredient.amount}</Text>
                <Text style={styles.ingredientName}>{ingredient.name}</Text>
                {ingredient.iron && (
                  <Text style={styles.ingredientNutrient}>Iron: {ingredient.iron}</Text>
                )}
              </View>
            ))}
          </View>

          {/* Instructions */}
          <View style={styles.instructionsSection}>
            <Text style={styles.sectionTitle}>Instructions</Text>
            {meal.instructions.map((instruction, index) => (
              <View key={index} style={styles.instructionItem}>
                <View style={styles.instructionNumber}>
                  <Text style={styles.instructionNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.instructionText}>{instruction}</Text>
              </View>
            ))}
          </View>

          {/* Tips */}
          <View style={styles.tipsSection}>
            <Text style={styles.sectionTitle}>Pro Tips</Text>
            {meal.tips.map((tip, index) => (
              <View key={index} style={styles.tipItem}>
                <Text style={styles.tipBullet}>💡</Text>
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Share2 size={20} color="#007AFF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.addToLogButton} onPress={handleAddToLog}>
          <Plus size={20} color="#FFFFFF" />
          <Text style={styles.addToLogText}>Add to Log</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  imageContainer: {
    position: 'relative',
    height: 300,
  },
  mealImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 20,
  },
  titleSection: {
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#1D1D1F',
    marginBottom: 8,
    fontWeight: '700',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#1D1D1F',
    fontWeight: '600',
  },
  reviews: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
  },
  description: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
    lineHeight: 24,
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  statItem: {
    alignItems: 'center',
    gap: 8,
  },
  statText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1D1D1F',
    fontWeight: '600',
  },
  servingsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  servingsControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  servingsButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  servingsText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1D1D1F',
    fontWeight: '700',
    minWidth: 30,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1D1D1F',
    marginBottom: 16,
    fontWeight: '700',
  },
  nutritionSection: {
    marginBottom: 32,
  },
  nutritionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
  },
  nutritionItem: {
    alignItems: 'center',
    flex: 1,
  },
  nutritionValue: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#007AFF',
    fontWeight: '700',
    marginBottom: 4,
  },
  nutritionLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#8E8E93',
    fontWeight: '500',
  },
  ingredientsSection: {
    marginBottom: 32,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  ingredientAmount: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#007AFF',
    fontWeight: '700',
    minWidth: 80,
  },
  ingredientName: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    color: '#1D1D1F',
    marginLeft: 12,
  },
  ingredientNutrient: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#FF9500',
    fontWeight: '500',
  },
  instructionsSection: {
    marginBottom: 32,
  },
  instructionItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  instructionNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  instructionNumberText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    fontWeight: '700',
  },
  instructionText: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    color: '#1D1D1F',
    lineHeight: 22,
  },
  tipsSection: {
    marginBottom: 100,
  },
  tipItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  tipBullet: {
    fontSize: 16,
    marginRight: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#1D1D1F',
    lineHeight: 20,
  },
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
    gap: 12,
  },
  shareButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addToLogButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    borderRadius: 24,
    padding: 12,
    gap: 8,
  },
  addToLogText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    fontWeight: '600',
  },
});