import React, { useEffect } from 'react';
import { Tabs } from 'expo-router';
import { Chrome as Home, Plus, TrendingUp, User } from 'lucide-react-native';
import { StyleSheet, Platform, Dimensions, View, Text } from 'react-native';
import { useRouter, useRootNavigationState } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { useAuth } from '@/components/AuthProvider';
import { usePathname } from 'expo-router';

const { width: screenWidth } = Dimensions.get('window');

export default function TabLayout() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const rootNavigationState = useRootNavigationState();
  
  // Redirect to login if not authenticated
  useEffect(() => {
    // Only redirect if router is ready, auth is not loading, user is not authenticated,
    // and we're not already on an auth route
    if (rootNavigationState?.key && !authLoading && !user && !pathname.startsWith('/auth')) {
      router.replace('/auth/login');
    }
  }, [user, authLoading, router, pathname, rootNavigationState?.key]);

  // Don't render tabs if still loading auth or user is not authenticated
  if (authLoading || !user) {
    return null;
  }

  const getTabBarHeight = () => {
    const iconSize = 24;
    const textHeight = 12;
    const iconTextGap = 4;
    const topPadding = 16;
    const bottomPadding = Platform.select({
      ios: Math.max(insets.bottom + 12, 20),
      android: 20,
      web: 20,
      default: 20,
    });
    
    return {
      height: iconSize + textHeight + iconTextGap + topPadding + bottomPadding + 16,
      paddingBottom: bottomPadding,
      paddingTop: topPadding,
    };
  };

  const tabBarConfig = getTabBarHeight();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: [
          styles.tabBar,
          {
            height: tabBarConfig.height,
            paddingBottom: tabBarConfig.paddingBottom,
            paddingTop: tabBarConfig.paddingTop,
          }
        ],
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarLabelStyle: styles.tabLabel,
        tabBarItemStyle: styles.tabItem,
        tabBarShowLabel: true,
        tabBarAllowFontScaling: false,
        tabBarBackground: () => (
          <BlurView intensity={100} style={StyleSheet.absoluteFill} />
        ),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused, color, size }) => (
            <Home 
              size={24} 
              color={color} 
              strokeWidth={2} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="log"
        options={{
          title: 'Log',
          tabBarIcon: ({ focused, color, size }) => (
            <Plus 
              size={24} 
              color={color} 
              strokeWidth={2} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="trends"
        options={{
          title: 'Trends',
          tabBarIcon: ({ focused, color, size }) => (
            <TrendingUp 
              size={24} 
              color={color} 
              strokeWidth={2} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused, color, size }) => (
            <User 
              size={24} 
              color={color} 
              strokeWidth={2} 
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 8,
    paddingHorizontal: 8,
  },
  tabItem: {
    paddingTop: 8,
  },
  tabLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 11,
    fontWeight: '500',
    marginTop: 4,
  },
});