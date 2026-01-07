import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { getExercises } from '@/database/database';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import React, { useEffect, useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useWorkoutPanel } from './blocks/workoutPanelContext';

export type Exercise = {
  id: number;
  name: string;
  equipment: string;
  primaryMuscleGroup: string;
  secondaryMuscleGroups: string[];
  sets?: { weight: number; reps: number, completed: boolean }[];
};

type SelectedExercise = {
  [key: number]: boolean;
};

export default function ModalScreen() {
  const [masterExercises, setMasterExercises] = useState<Exercise[]>([]);
  const [selectedExercises, setSelectedExercises] = useState<SelectedExercise>({});
  const { setExercises, exercises, replacingExerciseId, setReplacingExerciseId } = useWorkoutPanel();

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
              <ThemedView style={[
                styles.avatarWrapper,
                selectedExercises[exercise.id] && styles.avatarGlow
              ]}>
                <Image
                  source={{ uri: 'https://via.placeholder.com/50' }}
                  style={[
                    styles.avatar,
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
        if (replacingExerciseId !== null) {
          if (chosen.length === 1) {
            setExercises(prev => prev.map(e => e.id === replacingExerciseId ? { ...chosen[0], sets: [{ weight: 0, reps: 0, completed: false }] } : e));
          }
          setReplacingExerciseId(null);
        } else {
          const duplicates = chosen.filter(e => exercises.some(ex => ex.id === e.id));
          if (duplicates.length > 0) {
            Alert.alert('Duplicate Exercise', 'Some selected exercises are already in the workout.');
            return;
          }
          setExercises(prev => [
            ...prev,
            ...chosen.map(e => ({ ...e, sets: [{ weight: 0, reps: 0, completed: false }] }))
          ]);
        }
        router.back();
      }}
    >
      <ThemedText style={styles.addButtonText}>
        {replacingExerciseId !== null ? 'Replace' : 'Add'} {selectedCount} exercise{selectedCount !== 1 ? "s" : ""}
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
    paddingHorizontal: 10,
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
    overflow: 'visible'
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
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 2,
    borderColor: '#0D86FF',
  },
  avatarWrapper: {
    width: 53,
    height: 53,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
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