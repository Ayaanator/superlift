import WorkoutPanel from '@/app/blocks/workoutPanel';
import { ThemedText } from '@/components/themed-text';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Link, Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Alert, Pressable, StyleSheet } from 'react-native';
import 'react-native-reanimated';
import { useDeleteWorkoutTest } from './blocks/pastWorkouts';
import { TabBarHeightProvider } from './blocks/tabBarContext';
import { WorkoutPanelProvider } from './blocks/workoutPanelContext';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const deleteWorkout = useDeleteWorkoutTest();

  const handleDelete = () => {
    
    deleteWorkout();
    router.back();
  }

  return (
    <WorkoutPanelProvider>
      <TabBarHeightProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
            <Stack.Screen name="exercises" options={{ presentation: 'modal', 
              title: 'Add Exercise',
              headerRight: () => (
                <Pressable onPress={() => console.log('Create pressed')}>
                  <ThemedText style={[{ color: '#007AFF', fontSize: 17 }, styles.text]}>
                    Create
                  </ThemedText>
                </Pressable>
              ),
              headerLeft: () => (
                <Pressable onPress={() => router.back()}>
                  <Link href="/" dismissTo>
                    <ThemedText style={[{ color: '#FF3B30', fontSize: 17 }, styles.text]}>
                      Cancel
                    </ThemedText>
                  </Link>
                </Pressable>
              ),
              }} />
            <Stack.Screen name="workouts/details" options={{ presentation: 'modal', 
              title: 'Workout Details',
              headerRight: () => (
                <Pressable
                  onPress={() =>
                    Alert.alert(
                      'Options',
                      '',
                      [
                        { text: 'Edit', onPress: () => {} },
                        { 
                          text: 'Delete', 
                          style: 'destructive',
                          onPress: () => {
                            Alert.alert(
                              'Delete Workout',
                              'Are you sure you want to delete this workout? This action cannot be undone.',
                              [
                                { text: 'Cancel', style: 'cancel' },
                                { text: 'Delete', style: 'destructive', onPress: handleDelete },
                              ]
                            );
                          } 
                        },
                        { text: 'Cancel', style: 'cancel' },
                      ]
                    )
                  }
                  style={{ marginRight: 16 }}
                >
                  <Ionicons name="ellipsis-vertical" size={22} color="#007AFF" />
                </Pressable>
              ),
              headerLeft: () => (
                <Pressable onPress={() => router.back()}>
                  <Link href="/" dismissTo>
                    <ThemedText style={{ color: '#FF3B30', fontSize: 17, marginLeft: 16 }}>
                      Back
                    </ThemedText>
                  </Link>
                </Pressable>
              ),
            }}/>
          </Stack>

          <WorkoutPanel />
          <StatusBar style="auto" />
        </ThemeProvider>
      </TabBarHeightProvider>
    </WorkoutPanelProvider>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  text: {
    justifyContent: 'center',
    alignItems: 'center',
  }
});
