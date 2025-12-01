import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { clearWorkouts, getWorkouts, initDB } from '@/database/database';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';

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

export default function PastWorkouts() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const router = useRouter();

  const backgroundColor = useThemeColor({}, 'background');
  const secondaryColor = useThemeColor({}, 'secondary');
  const textColor = useThemeColor({}, 'text');

  useEffect(() => {
    (async () => {
      await clearWorkouts();
      await initDB();
      await new Promise(resolve => setTimeout(resolve, 100));
      const data = await getWorkouts();
      setWorkouts(data);
    })();
  }, []);

  const renderWorkoutItem = (item: Workout) => (
    <Pressable key={item.id} onPress={() => router.push({
      pathname: `/workouts/details`,
      params: { id: item.id, name: item.name },
    })}>
      
    <ThemedView style={[styles.workoutItem, { backgroundColor: secondaryColor }]}>
      <ThemedText style={[styles.workoutName, { color: textColor }]}>
        {item.name}
      </ThemedText>
      <ThemedText style={[styles.workoutDetails, { color: textColor, paddingBottom: 8 }]}>
        {item.duration} • {item.date}
      </ThemedText>
      <ThemedView style={{ flexDirection: 'column', gap: 20, borderRadius: 6,
         paddingLeft: 10, paddingTop: 4, paddingBottom: 12, overflow: 'hidden' }}>
        <ThemedView style={{ display: 'flex', gap: 5, overflow: 'hidden', flexDirection: 'row' }}>
          {/* Volume */}
          <ThemedView style={[{ alignItems: 'center' }, { margin: 0 }, { padding: 0 }]}>
            <ThemedText style={{ fontSize: 12, color: textColor }}>Volume</ThemedText>
            <ThemedText style={{ fontSize: 18, fontWeight: '700', color: textColor }}>
              {item.totalVolume || 0}
            </ThemedText>
          </ThemedView>

          {/* Exercises */}
          <ThemedView style={{ alignItems: 'center' }}>
            <ThemedText style={{ fontSize: 12, color: textColor }}>Exercises</ThemedText>
            <ThemedText style={{ fontSize: 18, fontWeight: '700', color: textColor }}>
              {item.exercises?.length || 0}
            </ThemedText>
          </ThemedView>
        </ThemedView>

        {/*Exercise list*/}
        <ThemedView style={{ display: 'flex', gap: 5, overflow: 'hidden' }}>
          {item.exercises.slice(0, 4).map((exercise, index) => (
            <ThemedText key={index} style={{ fontSize: 18, color: textColor, 
            marginBottom: 8 }}>
              {exercise.name}
            </ThemedText>
          ))}

          {item.exercises?.length > 4 && (
            <ThemedText style={{ fontSize: 12, color: textColor, opacity: 0.7, marginTop: 8 }}>
              See {item.exercises.length - 4} more exercise{item.exercises.length - 4 === 1? '' : 's'}
            </ThemedText>
          )}
        </ThemedView>
      </ThemedView>
    </ThemedView>

    </Pressable>

  );

  if (workouts.length === 0) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>No workouts found</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      {workouts.map(renderWorkoutItem)}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  workoutItem: {
    padding: 12,
    marginBottom: 12,
    borderRadius: 6,
  },
  workoutName: {
    fontSize: 16,
    fontWeight: '600',
  },
  workoutDetails: {
    fontSize: 14,
  },
  exerciseCount: {
    fontSize: 14,
  },
});