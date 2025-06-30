import { View, Text, StyleSheet, TouchableOpacity, Switch, Platform } from 'react-native';
import { Shield, Bell, Heart } from 'lucide-react-native';
import { useState } from 'react';

interface PermissionsStepProps {
  permissions: {
    pushReminders: boolean;
    healthData: boolean;
  };
  onPermissionsChange: (permissions: { pushReminders: boolean; healthData: boolean }) => void;
}

export default function PermissionsStep({ 
  permissions, 
  onPermissionsChange 
}: PermissionsStepProps) {
  const togglePermission = (key: 'pushReminders' | 'healthData') => {
    onPermissionsChange({
      ...permissions,
      [key]: !permissions[key]
    });
  };

  return (
    <View style={styles.permissionsWrapper}>
      <View style={styles.stepHeader}>
        <View style={styles.iconContainer}>
          <Shield size={48} color="#B8A9FF" />
        </View>
        <Text style={styles.stepTitle}>Your data, your rules.</Text>
      </View>

      {/* Data Safety Highlights */}
      <View style={styles.safetyHighlights}>
        <View style={styles.highlightItem}>
          <View style={styles.highlightDot} />
          <Text style={styles.highlightText}>On-device processing</Text>
        </View>
        <View style={styles.highlightItem}>
          <View style={styles.highlightDot} />
          <Text style={styles.highlightText}>Encrypted sync</Text>
        </View>
        <View style={styles.highlightItem}>
          <View style={styles.highlightDot} />
          <Text style={styles.highlightText}>Revocable anytime</Text>
        </View>
      </View>

      {/* Permission Toggles */}
      <View style={styles.permissionsContainer}>
        {/* Push Reminders */}
        <View style={styles.permissionCard}>
          <View style={styles.permissionHeader}>
            <View style={styles.permissionIconContainer}>
              <Bell size={24} color="#B8A9FF" />
            </View>
            <View style={styles.permissionInfo}>
              <Text style={styles.permissionTitle}>Push Reminders</Text>
              <Text style={styles.permissionDescription}>
                Gentle nudges for nutrition tracking and meal timing
              </Text>
            </View>
            <Switch
              value={permissions.pushReminders}
              onValueChange={() => togglePermission('pushReminders')}
              trackColor={{ false: '#E5E7EB', true: '#B8A9FF' }}
              thumbColor={permissions.pushReminders ? '#FFFFFF' : '#F3F4F6'}
              ios_backgroundColor="#E5E7EB"
            />
          </View>
        </View>

        {/* Health Data */}
        <View style={styles.permissionCard}>
          <View style={styles.permissionHeader}>
            <View style={styles.permissionIconContainer}>
              <Heart size={24} color="#FF8F65" />
            </View>
            <View style={styles.permissionInfo}>
              <Text style={styles.permissionTitle}>
                Health Data {Platform.OS === 'ios' ? '(Apple Health)' : '(Google Fit)'}
              </Text>
              <Text style={styles.permissionDescription}>
                Sync nutrition data with your health apps for a complete picture
              </Text>
            </View>
            <Switch
              value={permissions.healthData}
              onValueChange={() => togglePermission('healthData')}
              trackColor={{ false: '#E5E7EB', true: '#FF8F65' }}
              thumbColor={permissions.healthData ? '#FFFFFF' : '#F3F4F6'}
              ios_backgroundColor="#E5E7EB"
            />
          </View>
        </View>
      </View>

      {/* Privacy Note */}
      <View style={styles.privacyNote}>
        <Text style={styles.privacyNoteText}>
          You can change these permissions anytime in Settings. Hilla works great even with permissions disabled.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  permissionsWrapper: {
    flex: 1,
  },
  stepHeader: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 32,
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
  safetyHighlights: {
    backgroundColor: '#F0F9FF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#E0F2FE',
  },
  highlightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  highlightDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0369A1',
    marginRight: 12,
  },
  highlightText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#0369A1',
  },
  permissionsContainer: {
    gap: 16,
    marginBottom: 32,
  },
  permissionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  permissionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  permissionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F8F6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  permissionInfo: {
    flex: 1,
    marginRight: 16,
  },
  permissionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  permissionDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
  },
  privacyNote: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FCD34D',
  },
  privacyNoteText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#92400E',
    textAlign: 'center',
    lineHeight: 20,
  },
});