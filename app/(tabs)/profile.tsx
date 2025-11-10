import UserInfo from "@/app/blocks/userInfo";
import { ThemedView } from '@/components/themed-view';
import React from 'react';
import { StyleSheet } from 'react-native';
import PastWorkouts from "../blocks/pastWorkouts";

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

  return (
    <ThemedView style={{ flex: 1 }}>
      <UserInfo/>
      <PastWorkouts/>
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  workoutItem: {
    padding: 12,
    marginVertical: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  workoutName: {
    fontSize: 16,
    fontWeight: '600',
  },
  workoutDetails: {
    fontSize: 14,
    color: '#666',
  },
  exerciseCount: {
    fontSize: 14,
    color: '#888',
  },
  list: {
    paddingHorizontal: 16,
  },
});
