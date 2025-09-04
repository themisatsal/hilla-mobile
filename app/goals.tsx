import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Plus, CreditCard as Edit, Trash2, Check, X, Target, Calendar, Award } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useGoals } from '@/hooks/useGoals';
import { Goal } from '@/types/api';

export default function GoalsScreen() {
  const router = useRouter();
  const userId = '550e8400-e29b-41d4-a716-446655440000'; // Default to sample user ID
  const { goals, loading, error, fetchGoals, addGoal, updateGoal, deleteGoal, updateGoalProgress } = useGoals(userId);
  
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetValue: '0',
    currentValue: '0',
    unit: '',
    category: 'nutrition',
    color: '#007AFF',
    targetDate: ''
  });

  // Reset form when modal closes
  useEffect(() => {
    if (!isAddModalVisible && !isEditModalVisible) {
      setFormData({
        title: '',
        description: '',
        targetValue: '0',
        currentValue: '0',
        unit: '',
        category: 'nutrition',
        color: '#007AFF',
        targetDate: ''
      });
    }
  }, [isAddModalVisible, isEditModalVisible]);

  // Set form data when editing
  useEffect(() => {
    if (selectedGoal && isEditModalVisible) {
      setFormData({
        title: selectedGoal.title,
        description: selectedGoal.description || '',
        targetValue: selectedGoal.targetValue.toString(),
        currentValue: selectedGoal.currentValue.toString(),
        unit: selectedGoal.unit,
        category: selectedGoal.category,
        color: selectedGoal.color,
        targetDate: selectedGoal.targetDate || ''
      });
    }
  }, [selectedGoal, isEditModalVisible]);

  const handleAddGoal = async () => {
    if (!formData.title.trim()) {
      Alert.alert('Error', 'Title is required');
      return;
    }

    const newGoal = {
      title: formData.title,
      description: formData.description,
      targetValue: parseFloat(formData.targetValue) || 0,
      currentValue: parseFloat(formData.currentValue) || 0,
      unit: formData.unit,
      category: formData.category,
      color: formData.color,
      startDate: new Date().toISOString().split('T')[0],
      targetDate: formData.targetDate || undefined,
      isCompleted: false
    };

    const result = await addGoal(newGoal);
    if (result) {
      setIsAddModalVisible(false);
    }
  };

  const handleEditGoal = async () => {
    if (!selectedGoal || !formData.title.trim()) {
      Alert.alert('Error', 'Title is required');
      return;
    }

    const updatedGoal = {
      title: formData.title,
      description: formData.description,
      targetValue: parseFloat(formData.targetValue) || 0,
      currentValue: parseFloat(formData.currentValue) || 0,
      unit: formData.unit,
      category: formData.category,
      color: formData.color,
      targetDate: formData.targetDate || undefined,
      isCompleted: parseFloat(formData.currentValue) >= parseFloat(formData.targetValue)
    };

    const result = await updateGoal(selectedGoal.id, updatedGoal);
    if (result) {
      setIsEditModalVisible(false);
      setSelectedGoal(null);
    }
  };

  const handleDeleteGoal = async (goalId: string) => {
    Alert.alert(
      'Delete Goal',
      'Are you sure you want to delete this goal?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            const success = await deleteGoal(goalId);
            if (success) {
              if (selectedGoal?.id === goalId) {
                setSelectedGoal(null);
                setIsEditModalVisible(false);
              }
            }
          }
        }
      ]
    );
  };

  const handleUpdateProgress = async (goalId: string, newValue: number) => {
    await updateGoalProgress(goalId, newValue);
  };

  const calculateProgress = (current: number, target: number) => {
    return Math.min(100, Math.round((current / target) * 100));
  };

  const getColorForCategory = (category: string) => {
    switch (category) {
      case 'nutrition': return '#007AFF';
      case 'supplements': return '#34C759';
      case 'hydration': return '#5AC8FA';
      case 'exercise': return '#FF9500';
      case 'sleep': return '#AF52DE';
      case 'wellness': return '#FF2D55';
      default: return '#8E8E93';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'nutrition': return <Target size={20} color="#FFFFFF" />;
      case 'supplements': return <Award size={20} color="#FFFFFF" />;
      case 'hydration': return <Droplets size={20} color="#FFFFFF" />;
      case 'exercise': return <Activity size={20} color="#FFFFFF" />;
      case 'sleep': return <Moon size={20} color="#FFFFFF" />;
      case 'wellness': return <Heart size={20} color="#FFFFFF" />;
      default: return <Target size={20} color="#FFFFFF" />;
    }
  };

  // Group goals by category
  const groupedGoals = goals.reduce((acc, goal) => {
    if (!acc[goal.category]) {
      acc[goal.category] = [];
    }
    acc[goal.category].push(goal);
    return acc;
  }, {} as Record<string, Goal[]>);

  // Available categories
  const categories = [
    { id: 'nutrition', label: 'Nutrition' },
    { id: 'supplements', label: 'Supplements' },
    { id: 'hydration', label: 'Hydration' },
    { id: 'exercise', label: 'Exercise' },
    { id: 'sleep', label: 'Sleep' },
    { id: 'wellness', label: 'Wellness' }
  ];

  // Available colors
  const colors = [
    '#007AFF', // Blue
    '#34C759', // Green
    '#FF9500', // Orange
    '#FF3B30', // Red
    '#5856D6', // Purple
    '#FF2D55', // Pink
    '#8E8E93'  // Gray
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#1D1D1F" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Goals</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setIsAddModalVisible(true)}>
          <Plus size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      {loading && goals.length === 0 ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading goals...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchGoals}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : goals.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Target size={48} color="#8E8E93" />
          <Text style={styles.emptyTitle}>No Goals Yet</Text>
          <Text style={styles.emptyText}>
            Set nutrition and wellness goals to track your progress throughout your journey.
          </Text>
          <TouchableOpacity 
            style={styles.addFirstGoalButton} 
            onPress={() => setIsAddModalVisible(true)}
          >
            <Text style={styles.addFirstGoalButtonText}>Add Your First Goal</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {/* Active Goals */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Active Goals</Text>
            
            {Object.entries(groupedGoals).map(([category, categoryGoals]) => {
              const activeGoals = categoryGoals.filter(goal => !goal.isCompleted);
              if (activeGoals.length === 0) return null;
              
              return (
                <View key={category} style={styles.categorySection}>
                  <Text style={styles.categoryTitle}>
                    {categories.find(c => c.id === category)?.label || category}
                  </Text>
                  
                  {activeGoals.map(goal => (
                    <View key={goal.id} style={styles.goalCard}>
                      <View style={styles.goalHeader}>
                        <View style={[styles.goalCategoryIcon, { backgroundColor: goal.color }]}>
                          {getCategoryIcon(goal.category)}
                        </View>
                        <View style={styles.goalInfo}>
                          <Text style={styles.goalTitle}>{goal.title}</Text>
                          {goal.description ? (
                            <Text style={styles.goalDescription}>{goal.description}</Text>
                          ) : null}
                        </View>
                        <View style={styles.goalActions}>
                          <TouchableOpacity 
                            style={styles.goalActionButton}
                            onPress={() => {
                              setSelectedGoal(goal);
                              setIsEditModalVisible(true);
                            }}
                          >
                            <Edit size={16} color="#8E8E93" />
                          </TouchableOpacity>
                          <TouchableOpacity 
                            style={styles.goalActionButton}
                            onPress={() => handleDeleteGoal(goal.id)}
                          >
                            <Trash2 size={16} color="#FF3B30" />
                          </TouchableOpacity>
                        </View>
                      </View>
                      
                      <View style={styles.goalProgress}>
                        <View style={styles.progressBarContainer}>
                          <View style={styles.progressBar}>
                            <View 
                              style={[
                                styles.progressFill, 
                                { 
                                  width: `${calculateProgress(goal.currentValue, goal.targetValue)}%`,
                                  backgroundColor: goal.color
                                }
                              ]} 
                            />
                          </View>
                        </View>
                        <View style={styles.progressValues}>
                          <Text style={styles.currentValue}>
                            {goal.currentValue} {goal.unit}
                          </Text>
                          <Text style={styles.targetValue}>
                            {goal.targetValue} {goal.unit}
                          </Text>
                        </View>
                      </View>
                      
                      <View style={styles.goalControls}>
                        <TouchableOpacity 
                          style={styles.decrementButton}
                          onPress={() => {
                            const newValue = Math.max(0, goal.currentValue - 1);
                            handleUpdateProgress(goal.id, newValue);
                          }}
                        >
                          <Text style={styles.decrementButtonText}>-</Text>
                        </TouchableOpacity>
                        <View style={styles.currentValueContainer}>
                          <Text style={styles.currentValueText}>
                            {goal.currentValue} / {goal.targetValue} {goal.unit}
                          </Text>
                        </View>
                        <TouchableOpacity 
                          style={[styles.incrementButton, { backgroundColor: goal.color }]}
                          onPress={() => {
                            const newValue = goal.currentValue + 1;
                            handleUpdateProgress(goal.id, newValue);
                          }}
                        >
                          <Text style={styles.incrementButtonText}>+</Text>
                        </TouchableOpacity>
                      </View>
                      
                      {goal.targetDate && (
                        <View style={styles.goalFooter}>
                          <Calendar size={14} color="#8E8E93" />
                          <Text style={styles.targetDate}>
                            Target: {new Date(goal.targetDate).toLocaleDateString()}
                          </Text>
                        </View>
                      )}
                    </View>
                  ))}
                </View>
              );
            })}
          </View>
          
          {/* Completed Goals */}
          {goals.some(goal => goal.isCompleted) && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Completed Goals</Text>
              
              {Object.entries(groupedGoals).map(([category, categoryGoals]) => {
                const completedGoals = categoryGoals.filter(goal => goal.isCompleted);
                if (completedGoals.length === 0) return null;
                
                return (
                  <View key={`${category}-completed`} style={styles.categorySection}>
                    <Text style={styles.categoryTitle}>
                      {categories.find(c => c.id === category)?.label || category}
                    </Text>
                    
                    {completedGoals.map(goal => (
                      <View key={goal.id} style={[styles.goalCard, styles.completedGoalCard]}>
                        <View style={styles.goalHeader}>
                          <View style={[styles.goalCategoryIcon, { backgroundColor: goal.color }]}>
                            <Check size={20} color="#FFFFFF" />
                          </View>
                          <View style={styles.goalInfo}>
                            <Text style={styles.goalTitle}>{goal.title}</Text>
                            {goal.description ? (
                              <Text style={styles.goalDescription}>{goal.description}</Text>
                            ) : null}
                          </View>
                          <TouchableOpacity 
                            style={styles.goalActionButton}
                            onPress={() => handleDeleteGoal(goal.id)}
                          >
                            <Trash2 size={16} color="#FF3B30" />
                          </TouchableOpacity>
                        </View>
                        
                        <View style={styles.completedInfo}>
                          <Text style={styles.completedText}>
                            Completed: {goal.targetValue} {goal.unit}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>
                );
              })}
            </View>
          )}
        </ScrollView>
      )}

      {/* Add Goal Modal */}
      <Modal
        visible={isAddModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsAddModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Goal</Text>
              <TouchableOpacity 
                style={styles.modalCloseButton}
                onPress={() => setIsAddModalVisible(false)}
              >
                <X size={24} color="#8E8E93" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalScrollView}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Title *</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.title}
                  onChangeText={(text) => setFormData({...formData, title: text})}
                  placeholder="Enter goal title"
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Description</Text>
                <TextInput
                  style={[styles.formInput, styles.textArea]}
                  value={formData.description}
                  onChangeText={(text) => setFormData({...formData, description: text})}
                  placeholder="Enter goal description"
                  multiline
                  numberOfLines={3}
                />
              </View>
              
              <View style={styles.formRow}>
                <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.formLabel}>Target Value</Text>
                  <TextInput
                    style={styles.formInput}
                    value={formData.targetValue}
                    onChangeText={(text) => setFormData({...formData, targetValue: text})}
                    placeholder="0"
                    keyboardType="numeric"
                  />
                </View>
                
                <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
                  <Text style={styles.formLabel}>Unit</Text>
                  <TextInput
                    style={styles.formInput}
                    value={formData.unit}
                    onChangeText={(text) => setFormData({...formData, unit: text})}
                    placeholder="mg, g, servings, etc."
                  />
                </View>
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Category</Text>
                <View style={styles.categoryButtons}>
                  {categories.map(category => (
                    <TouchableOpacity
                      key={category.id}
                      style={[
                        styles.categoryButton,
                        formData.category === category.id && { 
                          backgroundColor: getColorForCategory(category.id),
                          borderColor: getColorForCategory(category.id)
                        }
                      ]}
                      onPress={() => setFormData({
                        ...formData, 
                        category: category.id,
                        color: getColorForCategory(category.id)
                      })}
                    >
                      <Text style={[
                        styles.categoryButtonText,
                        formData.category === category.id && { color: '#FFFFFF' }
                      ]}>
                        {category.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Color</Text>
                <View style={styles.colorButtons}>
                  {colors.map(color => (
                    <TouchableOpacity
                      key={color}
                      style={[
                        styles.colorButton,
                        { backgroundColor: color },
                        formData.color === color && styles.colorButtonSelected
                      ]}
                      onPress={() => setFormData({...formData, color})}
                    />
                  ))}
                </View>
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Target Date</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.targetDate}
                  onChangeText={(text) => setFormData({...formData, targetDate: text})}
                  placeholder="YYYY-MM-DD"
                />
                <Text style={styles.formHint}>
                  Format: YYYY-MM-DD (e.g., 2025-07-15)
                </Text>
              </View>
            </ScrollView>
            
            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setIsAddModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.saveButton}
                onPress={handleAddGoal}
              >
                <Text style={styles.saveButtonText}>Add Goal</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Goal Modal */}
      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Goal</Text>
              <TouchableOpacity 
                style={styles.modalCloseButton}
                onPress={() => setIsEditModalVisible(false)}
              >
                <X size={24} color="#8E8E93" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalScrollView}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Title *</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.title}
                  onChangeText={(text) => setFormData({...formData, title: text})}
                  placeholder="Enter goal title"
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Description</Text>
                <TextInput
                  style={[styles.formInput, styles.textArea]}
                  value={formData.description}
                  onChangeText={(text) => setFormData({...formData, description: text})}
                  placeholder="Enter goal description"
                  multiline
                  numberOfLines={3}
                />
              </View>
              
              <View style={styles.formRow}>
                <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.formLabel}>Current Value</Text>
                  <TextInput
                    style={styles.formInput}
                    value={formData.currentValue}
                    onChangeText={(text) => setFormData({...formData, currentValue: text})}
                    placeholder="0"
                    keyboardType="numeric"
                  />
                </View>
                
                <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
                  <Text style={styles.formLabel}>Target Value</Text>
                  <TextInput
                    style={styles.formInput}
                    value={formData.targetValue}
                    onChangeText={(text) => setFormData({...formData, targetValue: text})}
                    placeholder="0"
                    keyboardType="numeric"
                  />
                </View>
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Unit</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.unit}
                  onChangeText={(text) => setFormData({...formData, unit: text})}
                  placeholder="mg, g, servings, etc."
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Category</Text>
                <View style={styles.categoryButtons}>
                  {categories.map(category => (
                    <TouchableOpacity
                      key={category.id}
                      style={[
                        styles.categoryButton,
                        formData.category === category.id && { 
                          backgroundColor: getColorForCategory(category.id),
                          borderColor: getColorForCategory(category.id)
                        }
                      ]}
                      onPress={() => setFormData({
                        ...formData, 
                        category: category.id,
                        color: getColorForCategory(category.id)
                      })}
                    >
                      <Text style={[
                        styles.categoryButtonText,
                        formData.category === category.id && { color: '#FFFFFF' }
                      ]}>
                        {category.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Color</Text>
                <View style={styles.colorButtons}>
                  {colors.map(color => (
                    <TouchableOpacity
                      key={color}
                      style={[
                        styles.colorButton,
                        { backgroundColor: color },
                        formData.color === color && styles.colorButtonSelected
                      ]}
                      onPress={() => setFormData({...formData, color})}
                    />
                  ))}
                </View>
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Target Date</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.targetDate}
                  onChangeText={(text) => setFormData({...formData, targetDate: text})}
                  placeholder="YYYY-MM-DD"
                />
                <Text style={styles.formHint}>
                  Format: YYYY-MM-DD (e.g., 2025-07-15)
                </Text>
              </View>
            </ScrollView>
            
            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.deleteButton}
                onPress={() => {
                  if (selectedGoal) {
                    handleDeleteGoal(selectedGoal.id);
                  }
                }}
              >
                <Trash2 size={20} color="#FFFFFF" />
              </TouchableOpacity>
              
              <View style={styles.modalActions}>
                <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={() => setIsEditModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.saveButton}
                  onPress={handleEditGoal}
                >
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1D1D1F',
    fontWeight: '700',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#8E8E93',
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#FF3B30',
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  retryButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1D1D1F',
    marginTop: 16,
    marginBottom: 8,
    fontWeight: '700',
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  addFirstGoalButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
  },
  addFirstGoalButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1D1D1F',
    marginBottom: 16,
    fontWeight: '700',
  },
  categorySection: {
    marginBottom: 16,
  },
  categoryTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#8E8E93',
    marginBottom: 12,
    fontWeight: '600',
  },
  goalCard: {
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
  completedGoalCard: {
    backgroundColor: '#F9F9FB',
    opacity: 0.8,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  goalCategoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  goalInfo: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1D1D1F',
    marginBottom: 4,
    fontWeight: '600',
  },
  goalDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
  },
  goalActions: {
    flexDirection: 'row',
    gap: 8,
  },
  goalActionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  goalProgress: {
    marginBottom: 16,
  },
  progressBarContainer: {
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#F2F2F7',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressValues: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  currentValue: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#8E8E93',
    fontWeight: '500',
  },
  targetValue: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#8E8E93',
    fontWeight: '500',
  },
  goalControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  decrementButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  decrementButtonText: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#8E8E93',
    fontWeight: '600',
  },
  currentValueContainer: {
    flex: 1,
    alignItems: 'center',
  },
  currentValueText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1D1D1F',
    fontWeight: '600',
  },
  incrementButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  incrementButtonText: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    fontWeight: '600',
  },
  goalFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  targetDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
  },
  completedInfo: {
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  completedText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#34C759',
    fontWeight: '500',
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
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1D1D1F',
    fontWeight: '700',
  },
  modalCloseButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalScrollView: {
    padding: 20,
    maxHeight: '70%',
  },
  formGroup: {
    marginBottom: 16,
  },
  formRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1D1D1F',
    marginBottom: 8,
    fontWeight: '600',
  },
  formInput: {
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1D1D1F',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  formHint: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
    marginTop: 4,
  },
  categoryButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    backgroundColor: '#F2F2F7',
    marginBottom: 8,
  },
  categoryButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#8E8E93',
    fontWeight: '500',
  },
  colorButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  colorButtonSelected: {
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  modalFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: '#F2F2F7',
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#8E8E93',
    fontWeight: '600',
  },
  saveButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: '#007AFF',
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    fontWeight: '600',
  },
  deleteButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

// Import the Droplets, Activity, Moon, and Heart icons
import { Droplets, Activity, Moon, Heart } from 'lucide-react-native';