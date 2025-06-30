import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Send, Bot, CircleCheck as CheckCircle, Circle as XCircle } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function AiTestScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message?: string;
    model?: string;
    error?: string;
  } | null>(null);
  const [prompt, setPrompt] = useState('What are good sources of iron during pregnancy?');
  const [response, setResponse] = useState('');

  const testConnection = async () => {
    setLoading(true);
    setTestResult(null);
    setResponse(''); 
    
    try {
      const result = await fetch('/api/ai/test', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await result.json();
      
      setTestResult({
        success: data.success,
        message: data.data?.message,
        model: data.data?.model,
        error: data.error
      });
    } catch (error) {
      setTestResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setLoading(false);
    }
  };

  const testNutritionAdvice = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    setResponse('');
    
    try {
      const result = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: '550e8400-e29b-41d4-a716-446655440000', // Sample user ID
          message: prompt,
          previousMessages: []
        })
      });
      
      const data = await result.json();
      
      if (data.success) {
        setResponse(data.data.text);
      } else {
        setResponse(`Error: ${data.error}`);
      }
    } catch (error) {
      setResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#1D1D1F" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AI Integration Test</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Connection Test */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>OpenRouter AI Connection Test</Text>
          <Text style={styles.sectionDescription}>
            Test the connection to the OpenRouter AI service.
          </Text>
          
          <TouchableOpacity 
            style={styles.testButton}
            onPress={testConnection}
            disabled={loading}
          >
            <Text style={styles.testButtonText}>Test Connection</Text>
          </TouchableOpacity>
          
          {loading && !response && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text style={styles.loadingText}>Testing connection...</Text>
            </View>
          )}
          
          {testResult && (
            <View style={styles.resultContainer}>
              <View style={styles.resultHeader}>
                {testResult.success ? (
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
              
              {testResult.model && (
                <View style={styles.resultItem}>
                  <Text style={styles.resultLabel}>Model:</Text>
                  <Text style={styles.resultValue}>{testResult.model}</Text>
                </View>
              )}
              
              {testResult.message && (
                <View style={styles.messageContainer}>
                  <Text style={styles.messageLabel}>Response:</Text>
                  <Text style={styles.messageText}>{testResult.message}</Text>
                </View>
              )}
              
              {testResult.error && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorTitle}>Error:</Text>
                  <Text style={styles.errorMessage}>{testResult.error}</Text>
                </View>
              )}
            </View>
          )}
        </View>

        {/* AI Chat Test */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AI Chat Test</Text>
          <Text style={styles.sectionDescription}>
            Test the AI chat API with a custom prompt.
          </Text>
          
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Enter your nutrition question"
              value={prompt}
              onChangeText={setPrompt}
              multiline
              numberOfLines={3}
            />
            <TouchableOpacity 
              style={styles.sendButton}
              onPress={testNutritionAdvice}
              disabled={loading || !prompt.trim()}
            > 
              <Send size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          
          {loading && response === '' && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text style={styles.loadingText}>Generating response...</Text>
            </View>
          )}
          
          {response && (
            <View style={styles.responseContainer}>
              <View style={styles.responseHeader}>
                <Bot size={20} color="#007AFF" />
                <Text style={styles.responseTitle}>AI Response</Text>
              </View>
              <Text style={styles.responseText}>{response}</Text>
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
  section: {
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
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1D1D1F',
    marginBottom: 8,
    fontWeight: '700',
  },
  sectionDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
    marginBottom: 16,
    lineHeight: 20,
  },
  testButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  testButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#8E8E93',
    marginTop: 12,
  },
  resultContainer: {
    backgroundColor: '#F9F9FB',
    borderRadius: 12,
    padding: 16,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
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
  resultItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  resultLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1D1D1F',
    marginRight: 8,
    fontWeight: '600',
  },
  resultValue: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#1D1D1F',
    flex: 1,
  },
  messageContainer: {
    marginTop: 8,
  },
  messageLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1D1D1F',
    marginBottom: 8,
    fontWeight: '600',
  },
  messageText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#1D1D1F',
    lineHeight: 20,
  },
  errorContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: 'rgba(255, 59, 48, 0.05)',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#FF3B30',
  },
  errorTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FF3B30',
    marginBottom: 4,
    fontWeight: '600',
  },
  errorMessage: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#1D1D1F',
    lineHeight: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1D1D1F',
    marginRight: 12,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  responseContainer: {
    backgroundColor: '#F9F9FB',
    borderRadius: 12,
    padding: 16,
  },
  responseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  responseTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1D1D1F',
    marginLeft: 8,
    fontWeight: '600',
  },
  responseText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#1D1D1F',
    lineHeight: 20,
  }
});