import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, CircleCheck as CheckCircle, Circle as XCircle, Database, User, Calendar, Settings } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';

export default function SupabaseTestScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<{
    connection: boolean;
    usersTable: boolean;
    mealsTable: boolean;
    dailyLogsTable: boolean;
    trackingSettingsTable: boolean;
    error?: string;
  }>({
    connection: false,
    usersTable: false,
    mealsTable: false,
    dailyLogsTable: false,
    trackingSettingsTable: false
  });

  useEffect(() => {
    testSupabaseConnection();
  }, []);

  const testSupabaseConnection = async () => {
    setLoading(true);
    try {
      // Test basic connection
      const { data: healthData, error: healthError } = await supabase.from('users').select('count(*)');
      
      if (healthError) {
        setResults({
          connection: false,
          usersTable: false,
          mealsTable: false,
          dailyLogsTable: false,
          trackingSettingsTable: false,
          error: healthError.message
        });
        setLoading(false);
        return;
      }
      
      // Test users table
      const { data: usersData, error: usersError } = await supabase.from('users').select('id').limit(1);
      
      // Test meals table
      const { data: mealsData, error: mealsError } = await supabase.from('meals').select('id').limit(1);
      
      // Test daily_logs table
      const { data: logsData, error: logsError } = await supabase.from('daily_logs').select('id').limit(1);
      
      // Test tracking_settings table
      const { data: settingsData, error: settingsError } = await supabase.from('tracking_settings').select('id').limit(1);
      
      setResults({
        connection: true,
        usersTable: !usersError,
        mealsTable: !mealsError,
        dailyLogsTable: !logsError,
        trackingSettingsTable: !settingsError,
        error: usersError?.message || mealsError?.message || logsError?.message || settingsError?.message
      });
    } catch (error) {
      setResults({
        connection: false,
        usersTable: false,
        mealsTable: false,
        dailyLogsTable: false,
        trackingSettingsTable: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setLoading(false);
    }
  };

  const testApiEndpoints = async () => {
    try {
      // Test health endpoint
      const healthResponse = await fetch('/api/health');
      const healthData = await healthResponse.json();
      
      console.log('Health API response:', healthData);
      
      // Test users endpoint
      const usersResponse = await fetch('/api/users');
      const usersData = await usersResponse.json();
      
      console.log('Users API response:', usersData);
      
      // More tests can be added here
      
      alert('API tests completed. Check console for results.');
    } catch (error) {
      console.error('API test error:', error);
      alert('API test failed. Check console for details.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#1D1D1F" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Supabase Connection Test</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Testing Supabase connection...</Text>
          </View>
        ) : (
          <>
            <View style={styles.resultCard}>
              <View style={styles.resultHeader}>
                <Database size={24} color="#007AFF" />
                <Text style={styles.resultTitle}>Connection Status</Text>
              </View>
              
              <View style={styles.resultItem}>
                <Text style={styles.resultLabel}>Supabase Connection</Text>
                {results.connection ? (
                  <View style={styles.successBadge}>
                    <CheckCircle size={16} color="#34C759" />
                    <Text style={styles.successText}>Connected</Text>
                  </View>
                ) : (
                  <View style={styles.errorBadge}>
                    <XCircle size={16} color="#FF3B30" />
                    <Text style={styles.errorText}>Failed</Text>
                  </View>
                )}
              </View>
              
              {results.error && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorTitle}>Error Details:</Text>
                  <Text style={styles.errorMessage}>{results.error}</Text>
                </View>
              )}
            </View>

            <View style={styles.resultCard}>
              <View style={styles.resultHeader}>
                <User size={24} color="#FF9500" />
                <Text style={styles.resultTitle}>Database Tables</Text>
              </View>
              
              <View style={styles.resultItem}>
                <Text style={styles.resultLabel}>Users Table</Text>
                {results.usersTable ? (
                  <View style={styles.successBadge}>
                    <CheckCircle size={16} color="#34C759" />
                    <Text style={styles.successText}>Available</Text>
                  </View>
                ) : (
                  <View style={styles.errorBadge}>
                    <XCircle size={16} color="#FF3B30" />
                    <Text style={styles.errorText}>Not Found</Text>
                  </View>
                )}
              </View>
              
              <View style={styles.resultItem}>
                <Text style={styles.resultLabel}>Meals Table</Text>
                {results.mealsTable ? (
                  <View style={styles.successBadge}>
                    <CheckCircle size={16} color="#34C759" />
                    <Text style={styles.successText}>Available</Text>
                  </View>
                ) : (
                  <View style={styles.errorBadge}>
                    <XCircle size={16} color="#FF3B30" />
                    <Text style={styles.errorText}>Not Found</Text>
                  </View>
                )}
              </View>
              
              <View style={styles.resultItem}>
                <Text style={styles.resultLabel}>Daily Logs Table</Text>
                {results.dailyLogsTable ? (
                  <View style={styles.successBadge}>
                    <CheckCircle size={16} color="#34C759" />
                    <Text style={styles.successText}>Available</Text>
                  </View>
                ) : (
                  <View style={styles.errorBadge}>
                    <XCircle size={16} color="#FF3B30" />
                    <Text style={styles.errorText}>Not Found</Text>
                  </View>
                )}
              </View>
              
              <View style={styles.resultItem}>
                <Text style={styles.resultLabel}>Tracking Settings Table</Text>
                {results.trackingSettingsTable ? (
                  <View style={styles.successBadge}>
                    <CheckCircle size={16} color="#34C759" />
                    <Text style={styles.successText}>Available</Text>
                  </View>
                ) : (
                  <View style={styles.errorBadge}>
                    <XCircle size={16} color="#FF3B30" />
                    <Text style={styles.errorText}>Not Found</Text>
                  </View>
                )}
              </View>
            </View>

            <View style={styles.resultCard}>
              <View style={styles.resultHeader}>
                <Settings size={24} color="#8A6DFF" />
                <Text style={styles.resultTitle}>API Endpoints</Text>
              </View>
              
              <TouchableOpacity 
                style={styles.apiTestButton}
                onPress={testApiEndpoints}
              >
                <Text style={styles.apiTestButtonText}>Test API Endpoints</Text>
              </TouchableOpacity>
              
              <Text style={styles.apiNote}>
                This will test the API endpoints and log results to the console.
              </Text>
            </View>

            <View style={styles.actionContainer}>
              <TouchableOpacity 
                style={styles.retryButton}
                onPress={testSupabaseConnection}
              >
                <Text style={styles.retryButtonText}>Retry Connection Test</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.backHomeButton}
                onPress={() => router.push('/(tabs)')}
              >
                <Text style={styles.backHomeButtonText}>Back to Home</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontFamily: 'Inter-SemiBold',
    color: '#1D1D1F',
    fontWeight: '600',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#8E8E93',
    marginTop: 16,
  },
  resultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  resultTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1D1D1F',
    marginLeft: 12,
    fontWeight: '700',
  },
  resultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  resultLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1D1D1F',
  },
  successBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 199, 89, 0.1)',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  successText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#34C759',
    marginLeft: 6,
    fontWeight: '500',
  },
  errorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  errorText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#FF3B30',
    marginLeft: 6,
    fontWeight: '500',
  },
  errorContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: 'rgba(255, 59, 48, 0.05)',
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#FF3B30',
  },
  errorTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FF3B30',
    marginBottom: 8,
    fontWeight: '600',
  },
  errorMessage: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#1D1D1F',
    lineHeight: 20,
  },
  apiTestButton: {
    backgroundColor: '#8A6DFF',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  apiTestButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    fontWeight: '600',
  },
  apiNote: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
    textAlign: 'center',
  },
  actionContainer: {
    marginTop: 20,
    gap: 12,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  retryButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    fontWeight: '600',
  },
  backHomeButton: {
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  backHomeButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#8E8E93',
    fontWeight: '600',
  },
});