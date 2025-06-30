import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, Image as ImageIcon, Upload, Zap } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';

export default function FoodCameraScreen() {
  const router = useRouter();
  const [recentAnalyses, setRecentAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleCameraPress = () => {
    router.push('/food-analysis');
  };

  useEffect(() => {
    // Fetch recent analyses when the screen is focused
    const fetchRecentAnalyses = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/food-analysis?userId=550e8400-e29b-41d4-a716-446655440000&limit=3');
        const data = await response.json();
        
        if (data.success) {
          setRecentAnalyses(data.data || []);
        }
      } catch (error) {
        console.error('Error fetching recent analyses:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecentAnalyses();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Food Analysis</Text>
        <Text style={styles.subtitle}>Analyze your food for nutritional information</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <View style={styles.cameraCard}>
          <TouchableOpacity 
            style={styles.cameraButton} 
            activeOpacity={0.8}
            onPress={handleCameraPress}
          >
            <Camera size={48} color="#007AFF" />
            <Text style={styles.cameraText}>Take a photo of your food</Text>
            <Text style={styles.cameraSubtext}>Get instant nutritional analysis</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.featuresSection}>
          <Text style={styles.featuresTitle}>Features</Text>
          
          <View style={styles.featureCard}>
            <View style={styles.featureIcon}>
              <Zap size={24} color="#FF9500" />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Instant Analysis</Text>
              <Text style={styles.featureDescription}>
                Get detailed nutritional information in seconds using advanced AI
              </Text>
            </View>
          </View>
          
          <View style={styles.featureCard}>
            <View style={styles.featureIcon}>
              <ImageIcon size={24} color="#34C759" />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Food Recognition</Text>
              <Text style={styles.featureDescription}>
                Identifies multiple food items in a single image with high accuracy
              </Text>
            </View>
          </View>
          
          <View style={styles.featureCard}>
            <View style={styles.featureIcon}>
              <Upload size={24} color="#007AFF" />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Save & Track</Text>
              <Text style={styles.featureDescription}>
                Save analysis to your meal log and track your nutrition over time
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.recentSection}>
          <Text style={styles.recentTitle}>Recent Analyses</Text>
          
          {loading ? (
            <View style={styles.loadingState}>
              <Text style={styles.loadingText}>Loading recent analyses...</Text>
            </View>
          ) : recentAnalyses.length > 0 ? (
            <View style={styles.recentList}>
              {recentAnalyses.map((analysis: any) => (
                <TouchableOpacity 
                  key={analysis.id} 
                  style={styles.recentItem}
                  onPress={() => {
                    // Navigate to details or re-analyze
                    console.log('View analysis:', analysis.id);
                  }}
                >
                  {analysis.image_url ? (
                    <Image 
                      source={{ uri: analysis.image_url }} 
                      style={styles.recentItemImage} 
                    />
                  ) : (
                    <View style={styles.recentItemImagePlaceholder}>
                      <ImageIcon size={24} color="#8E8E93" />
                    </View>
                  )}
                  <View style={styles.recentItemContent}>
                    <Text style={styles.recentItemTitle} numberOfLines={1}>
                      {analysis.food_name}
                    </Text>
                    <Text style={styles.recentItemDate}>
                      {new Date(analysis.created_at).toLocaleDateString()}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No recent analyses</Text>
              <Text style={styles.emptyStateSubtext}>
                Take a photo of your food to get started
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
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
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  cameraCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  cameraButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  cameraText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1D1D1F',
    marginTop: 16,
    marginBottom: 8,
    fontWeight: '600',
  },
  cameraSubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
    textAlign: 'center',
  },
  featuresSection: {
    marginBottom: 24,
  },
  featuresTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1D1D1F',
    marginBottom: 16,
    fontWeight: '700',
  },
  featureCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1D1D1F',
    marginBottom: 4,
    fontWeight: '600',
  },
  featureDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
    lineHeight: 20,
  },
  recentSection: {
    marginBottom: 24,
  },
  recentTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1D1D1F',
    marginBottom: 16,
    fontWeight: '700',
  },
  emptyState: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#1D1D1F',
    marginBottom: 8,
    fontWeight: '500',
  },
  emptyStateSubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
    textAlign: 'center',
  },
  loadingState: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#8E8E93',
    fontWeight: '500',
  },
  recentList: {
    gap: 12,
  },
  recentItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  recentItemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  recentItemImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recentItemContent: {
    flex: 1,
  },
  recentItemTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1D1D1F',
    marginBottom: 4,
    fontWeight: '600',
  },
  recentItemDate: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
  },
});