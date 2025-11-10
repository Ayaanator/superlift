import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { clearWorkouts, getWorkouts, initDB } from '@/database/database';
import { useThemeColor } from '@/hooks/use-theme-color';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';

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

  const backgroundColor = useThemeColor({}, 'background');
  const secondaryColor = useThemeColor({}, 'secondary');
  const textColor = useThemeColor({}, 'text');

  useEffect(() => {
    const loadData = async () => {
      await clearWorkouts();
      await initDB();
      await new Promise(resolve => setTimeout(resolve, 100));
      const data = await getWorkouts();
      setWorkouts(data);
    };
    loadData();
  }, []);

  const renderWorkoutItem = ({ item }: { item: Workout }) => (
    <ThemedView style={[styles.workoutItem, { backgroundColor: secondaryColor }]}>
      <ThemedText style={[styles.workoutName, { color: textColor }]}>
        {item.name}
      </ThemedText>
      <ThemedText style={[styles.workoutDetails, { color: textColor }]}>
        {item.duration} • {item.date}
      </ThemedText>
      <ThemedView style={{ flexDirection: 'row', gap: 20, borderRadius: 6,
         paddingLeft: 10, paddingTop: 4, overflow: 'hidden' }}>
        {/* Volume */}
        <ThemedView style={{ alignItems: 'center' }}>
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
    </ThemedView>
  );

  if (workouts.length === 0) {
    return <ThemedText>No workouts found</ThemedText>;
  }

  return (
    <FlatList
      data={workouts}
      renderItem={renderWorkoutItem}
      keyExtractor={(item) => item.id}
      style={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  workoutItem: {
    padding: 12,
    marginVertical: 6,
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
  list: {
    paddingHorizontal: 16,
  },
});
