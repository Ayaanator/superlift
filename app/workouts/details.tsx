import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { getWorkout } from '@/database/database';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';

interface WorkoutSet {
  setOrder: number;
  weight: number;
  reps: number;
}

interface Exercise {
  name: string;
  sets: WorkoutSet[];
}

export interface Workout {
  id: string;
  name: string;
  duration: string;
  date: string;
  totalVolume: number,
  exercises: Exercise[];
}

export default function WorkoutDetails() {
  const { id, name } = useLocalSearchParams();
  const [workout, setWorkout] = useState<Workout>();

  const backgroundColor = useThemeColor({}, 'background');
  const secondaryColor = useThemeColor({}, 'secondary');
  const textColor = useThemeColor({}, 'text');

  useEffect(() => {
    const loadData = async () => {
      const data = await getWorkout(id);
      setWorkout(data);
    }

    loadData();
  }, [])

  return (
    <ThemedView style={{ flex: 1, padding: 20, display: 'flex' }}>
      <ThemedText style={[styles.workoutName, { color: textColor }]}>
        {name}
      </ThemedText>
      <ThemedText style={[styles.workoutDetails, { color: textColor, paddingBottom: 12 }]}>
        {workout?.duration} • {workout?.date}
      </ThemedText>
      <ThemedView style={{ height: 2, backgroundColor: secondaryColor, opacity: 0.3, marginVertical: 12 }}/>

      <ThemedView style={styles.exerciseContainer}>
        {workout?.exercises.map((exercise, index) => (
          <ThemedView key={`${exercise.name}-${index}`}>
            <ThemedText>{exercise.name}</ThemedText>
            {exercise?.sets.map((set, index) => (
              <ThemedText key={`${set.setOrder}-${index}`}>{set.setOrder}: {set.weight} lbs x {set.reps} reps</ThemedText>
            ))}
          </ThemedView>
        ))}
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  exerciseContainer: {
    marginVertical: 6,
    borderRadius: 6,
  },
  workoutName: {
    fontSize: 16,
    fontWeight: '600',
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
  },
  exerciseDetails: {
    fontSize: 14,
  },
  exerciseCount: {
    fontSize: 14,
  },
});