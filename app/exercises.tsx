import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { getExercises } from '@/database/database';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import React, { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useWorkoutPanel } from './blocks/workoutPanelContext';

export type Exercise = {
  id: number;
  name: string;
  equipment: string;
  primaryMuscleGroup: string;
  secondaryMuscleGroups: string[];
};

type SelectedExercise = {
  [key: number]: boolean;
};

export default function ModalScreen() {
  const [masterExercises, setMasterExercises] = useState<Exercise[]>([]);
  const [selectedExercises, setSelectedExercises] = useState<SelectedExercise>({});
  const { setExercises } = useWorkoutPanel();

  const router = useRouter();
  const iconColor = useThemeColor({}, 'text');
  const selectedCount = Object.values(selectedExercises).filter(Boolean).length;
  const insets = useSafeAreaInsets();

  useEffect(() => {
    (async () => {
      const exercises = await getExercises();
      setMasterExercises(exercises);
    })();
    // console.log(masterExercises);
  }, [])

  const toggleExerciseSelection = (exerciseId: number) => {
    setSelectedExercises(prev => ({
      ...prev,
      [exerciseId]: !prev[exerciseId]
    }));

  };

  return (
    <ThemedView style={styles.container}>
    <ScrollView 
      style={{ flex: 1 }}
      contentContainerStyle={{ paddingBottom: 20 }}
      showsVerticalScrollIndicator={false}
    >
      <ThemedText type="subtitle" style={{marginBottom: 30}}>Available Exercises</ThemedText>
      <ThemedView style={styles.exerciseContainer}>
        {masterExercises.map((exercise, index) => (
          <ThemedView key={index} style={styles.exercise}>
            <Pressable 
              onPress={() => toggleExerciseSelection(exercise.id)}
              style={({ pressed }) => [
                styles.exerciseContent,
                pressed && styles.exercisePressed
              ]}
            >
              <ThemedView style={styles.avatarContainer}>
                <Image
                  source={{ uri: 'https://via.placeholder.com/50' }}
                  style={[
                    styles.avatar,
                    selectedExercises[exercise.id] && styles.avatarGlow
                  ]}
                />
              </ThemedView>

              <ThemedView style={styles.exerciseInfo}>
                <ThemedText style={{fontWeight: '800'}}>{exercise.name}</ThemedText>
                <ThemedText style={{fontWeight: '400'}}>{exercise.primaryMuscleGroup}</ThemedText>
              </ThemedView>
            </Pressable>

            <Pressable>
              <Ionicons name="chevron-forward" size={20} color={iconColor}/>
            </Pressable>
          </ThemedView>
        ))}
      </ThemedView>
    </ScrollView>

    <Pressable style={ selectedCount === 0 ? styles.hide : [styles.stickyButton, { bottom: insets.bottom }]}
      onPress={() => { 
        const chosen = masterExercises.filter(e => selectedExercises[e.id]);
        setExercises(prev => [...prev, ...chosen]);
        router.back();
      }}
    >
      <ThemedText style={styles.addButtonText}>
        Add {selectedCount} exercise{selectedCount !== 1 ? "s" : ""}
      </ThemedText>
    </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  exerciseContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 25,
    width: '100%',
  },
  exercise: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  exerciseContent: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 15,
  },
  exercisePressed: {
  },
  exerciseInfo: {
    flex: 1,
  },
  avatarContainer: {
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ccc',
  },
  avatarGlow: {
    shadowColor: '#0D86FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10, // For Android
    borderWidth: 2,
    borderColor: '#0D86FF',
  },
  stickyButton: {
    position: 'absolute',
    left: 20,
    right: 20,
    backgroundColor: '#0D86FF',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#0D86FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
  addButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  hide: {
    display: 'none'
  }
});