import { HapticTab } from '@/components/haptic-tab';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { useTabBarHeight } from '../blocks/tabBarContext';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { setTabBarHeight } = useTabBarHeight();

  return (
    <ThemedView
      onLayout={(e) => {
        // setTabBarHeight(e.nativeEvent.layout.height);
      }}
      style={{ flex: 1 }}
    >
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarStyle: {
            height: 58,
            paddingBottom: Platform.OS === 'ios' ? 12 : 8,
          },
          tabBarLabelStyle: {
            marginBottom: 0,
          },
        }}
      >
        {/*<Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="house.fill" color={color} />
            ),
          }}
        />*/}
        <Tabs.Screen
          name="index"
          options={{
            title: 'Workout',
            tabBarIcon: ({ color }) => (
              <Ionicons name="barbell-outline" size={28} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color }) => (
              <Ionicons name="person-circle-outline" size={28} color={color} />
            ),
          }}
        />
      </Tabs>
    </ThemedView>
  );
}
