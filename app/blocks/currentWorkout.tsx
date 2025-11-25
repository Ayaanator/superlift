import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useWorkoutPanel } from './workoutPanelContext';

type Props = {
  preview?: boolean;
  fullScreen?: boolean;
};

export default function CurrentWorkout({ preview = false, fullScreen = false }: Props) {
  const { closeWorkout, setExpanded } = useWorkoutPanel();
  const insets = useSafeAreaInsets();

  const handleClose = () => {
    closeWorkout();
  };

  if (preview) {
    return (
      <ThemedView style={styles.previewContainer}>
        <ThemedText style={styles.previewText}>Workout in progress...</ThemedText>
        <ThemedText style={styles.previewSubtext}>Tap to expand</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={[
      styles.fullScreenContainer,
      { paddingBottom: insets.bottom + 20 } // Add space for home indicator
    ]}>
      <ThemedText style={styles.fullTitle}>Current Workout</ThemedText>
      
      {/* Workout content goes here */}
      <ThemedView style={styles.workoutContent}>
        <ThemedText style={styles.exerciseText}>Exercise 1: Bench Press</ThemedText>
        <ThemedText style={styles.exerciseText}>Exercise 2: Squats</ThemedText>
        <ThemedText style={styles.exerciseText}>Exercise 3: Deadlifts</ThemedText>
        
        {/* Actual workout exercises, sets, reps, etc. */}
      </ThemedView>

      {/* Action buttons with safe area consideration */}
      <ThemedView style={styles.actions}>
        <Pressable 
          style={[styles.button, styles.closeButton]}
          onPress={handleClose}
        >
          <ThemedText style={styles.buttonText}>Close Workout</ThemedText>
        </Pressable>
        
        <Pressable 
          style={[styles.button, styles.addButton]}
          onPress={() => {
            // Add exercise logic here
            console.log('Add exercise pressed');
          }}
        >
          <ThemedText style={styles.buttonText}>Add Exercises</ThemedText>
        </Pressable>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  previewContainer: {
    flex: 1,
    padding: 15,
    justifyContent: 'center',
    backgroundColor: '#151718',
  },
  previewText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  previewSubtext: {
    fontSize: 14,
    opacity: 0.7,
  },
  fullScreenContainer: {
    flex: 1,
    padding: 20,
    paddingTop: 10,
  },
  fullTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  workoutContent: {
    flex: 1,
    gap: 15,
    padding: 10,
    marginBottom: 10,
  },
  exerciseText: {
    fontSize: 16,
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 8,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 'auto',
    paddingBottom: 10,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  closeButton: {
    backgroundColor: '#ff4444',
  },
  addButton: {
    backgroundColor: '#7eb8c7',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});