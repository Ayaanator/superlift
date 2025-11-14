import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { getWorkout } from '@/database/database';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';


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
    <GestureHandlerRootView style={{ flex: 1 }}>
    <ScrollView 
      showsVerticalScrollIndicator={false}
    >
      <ThemedView style={{ flex: 1, padding: 20, display: 'flex', backgroundColor: backgroundColor }}>
        <ThemedText style={[styles.title, { color: textColor }]}>
          {name}
        </ThemedText>
        <ThemedText style={[styles.workoutDetails, { color: textColor, paddingBottom: 12 }]}>
          {workout?.duration} • {workout?.date}
        </ThemedText>
        <ThemedView style={{ height: 2, backgroundColor: secondaryColor, opacity: 0.3, marginBottom: 12 }}/>

        <ThemedView style={styles.exerciseContainer}>
          {workout?.exercises.map((exercise, index) => (
            <ThemedView key={`${exercise.name}-${index}`} style={styles.exerciseContainer}>
              <ThemedText style={styles.title}>{exercise.name}</ThemedText>
              {exercise?.sets.map((set, index) => (
                <ThemedView key={`${set.setOrder}-${index}`} style={{display: 'flex', flexDirection: 'row'}}>
                  <ThemedText style={[styles.subtitle, {marginRight: 5}]}>{set.setOrder} </ThemedText>
                  <ThemedText>{set.weight} lbs x </ThemedText>
                  <ThemedText>{set.reps} reps</ThemedText>
                </ThemedView>
              ))}
            </ThemedView>
          ))}
        </ThemedView>
      </ThemedView>
    </ScrollView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 17,
    fontWeight: '600'
  },
  paragraph: {
    fontSize: 16,
    fontWeight: '500'
  },
  workoutDetails: {
    fontSize: 14,
  },
  exerciseContainer: {
    marginBottom: 20,
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