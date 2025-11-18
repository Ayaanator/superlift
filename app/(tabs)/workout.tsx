import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWorkoutPanel } from '../blocks/workoutPanelContext';

export default function WorkoutScreen() {
  const backgroundColor = useThemeColor({}, 'background');
  const secondaryColor = useThemeColor({}, 'secondary');
  const { active, setActive, setExpanded } = useWorkoutPanel();
  
  const toggleWorkout = () => {
    if (active) {
      // If workout is active, close it
      setActive(false);
      setExpanded(false);
    } else {
      // If no workout, start one
      setActive(true);
      setExpanded(false); // Start in collapsed mode
    }
  };

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: backgroundColor}}>
      <ThemedView style={[styles.container, { overflow: 'visible', justifyContent: 'flex-start' }]}>
        <ThemedText style={[styles.title]}>Quick Start</ThemedText>
        <Pressable 
          style={[styles.button, {backgroundColor: secondaryColor}]}
          onPress={toggleWorkout}
        >
          <ThemedText style={[styles.title]}>
            {active ? 'Close Workout' : 'Start Empty Workout'}
          </ThemedText>
        </Pressable>

        {/* Additional workout content can go here */}
        <ThemedView style={styles.workoutOptions}>
          <ThemedText style={styles.subtitle}>Workout Templates</ThemedText>
          {/* Add your workout templates or other content here */}
        </ThemedView>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    padding: 15,
    marginVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  container: {
    padding: 20,
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 17,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 16,
    fontWeight: '500'
  },
  workoutOptions: {
    marginTop: 20,
  },
});