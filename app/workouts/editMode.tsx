import { ThemedText } from '@/components/themed-text';
import { getWorkout } from '@/database/database';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';

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

export default function useEditMode() {
  const { id } = useLocalSearchParams();
  const [workout, setWorkout] = useState<Workout>();

  useEffect(() => {
    const loadData = async () => {
      const data = await getWorkout(id);
      setWorkout(data);
    }

    loadData();
  }, [])

  return (
    <ThemedText>Test! {id}</ThemedText>
  )
}