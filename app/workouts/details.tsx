import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';

export default function WorkoutDetails() {
  const { id, name } = useLocalSearchParams();

  return (
    <ThemedView style={{ flex: 1, padding: 20 }}>
      <ThemedText>Workout ID: {id}</ThemedText>
      <ThemedText>Workout Name: {name}</ThemedText>
    </ThemedView>
  );
}
