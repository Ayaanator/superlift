import UserInfo from "@/app/blocks/userInfo";
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { clearWorkouts, getWorkouts, initDB } from '@/database/database';
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

interface Workout {
  id: string;
  name: string;
  duration: string;
  date: string;
  exercises: Exercise[];
}

export default function TabTwoScreen() {
  const [workouts, setWorkouts] = useState<any[]>([]);

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

  const renderWorkoutItem = ({ item }) => (
    <ThemedView style={styles.workoutItem}>
      <ThemedText style={styles.workoutName}>{item.name}</ThemedText>
      <ThemedText style={styles.workoutDetails}>
        {item.duration} • {item.date}
      </ThemedText>
      <ThemedText style={styles.exerciseCount}>
        {item.exercises?.length || 0} exercises
      </ThemedText>
    </ThemedView>
  );

  return (
    <ThemedView style={{ flex: 1 }}>
      <UserInfo />
      <ThemedText style={styles.title}>Workouts from DB:</ThemedText>
      
      {workouts.length === 0 ? (
        <ThemedText>No workouts found</ThemedText>
      ) : (
        <FlatList
          data={workouts}
          renderItem={renderWorkoutItem}
          keyExtractor={(item) => item.id}
          style={styles.list}
        />
      )}
    </ThemedView>
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
});
