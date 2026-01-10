import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { getWorkout, updateWorkout } from '@/database/database';
import { useThemeColor } from '@/hooks/use-theme-color';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { Alert, Animated, Image, KeyboardAvoidingView, PanResponder, Platform, Pressable, ScrollView, StyleSheet, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useWorkoutPanel } from '../blocks/workoutPanelContext';
import { Exercise } from '../exercises';

type SwipeableSetProps = {
  children: ReactNode;
  onDelete: () => void;
  exerciseId: number;
  setId: number;
};

const SwipeableSet = ({ children, onDelete, exerciseId, setId }: SwipeableSetProps) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const SWIPE_THRESHOLD = 20;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gesture) => {
        return Math.abs(gesture.dx) > 10 && Math.abs(gesture.dx) > Math.abs(gesture.dy) * 1.2;
      },
      onPanResponderMove: (_, gesture) => {
        translateX.setValue(gesture.dx);
      },
      onPanResponderRelease: (_, gesture) => {
        if (Math.abs(gesture.dx) > SWIPE_THRESHOLD) {
          Animated.timing(translateX, {
            toValue: gesture.dx > 0 ? 1000 : -1000,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            onDelete();
          });
        } else {
          Animated.spring(translateX, {
            toValue: 0,
            tension: 100,
            friction: 8,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  return (
    <Animated.View
      style={{
        transform: [{ translateX }],
      }}
      {...panResponder.panHandlers}
    >
      {children}
    </Animated.View>
  );
};

export default function EditMode() {
  const { id } = useLocalSearchParams();
  const { setExercises, exercises, workoutAdded, setWorkoutAdded, setReplacingExerciseId } = useWorkoutPanel();
  const [workoutName, setWorkoutName] = useState("");

  const insets = useSafeAreaInsets();
  const router = useRouter();
  const secondaryColor = useThemeColor({}, 'secondary');
  const textColor = useThemeColor({}, 'text');

  const inputRefs = useRef<Record<string, TextInput | null>>({});

  useEffect(() => {
    const loadWorkout = async () => {
      try {
        const workoutData = await getWorkout(id as string);
        if (workoutData) {
          setWorkoutName(workoutData.name);
          interface WorkoutExercise {
            name: string;
            sets: { setOrder: number; weight: number; reps: number }[];
          }
          
          const transformedExercises: Exercise[] = workoutData.exercises.map((exercise: WorkoutExercise, index: number) => ({
            id: Date.now() + index, 
            name: exercise.name,
            equipment: '',
            primaryMuscleGroup: '',
            secondaryMuscleGroups: [],
            sets: exercise.sets.map((set: { setOrder: number; weight: number; reps: number }, setIndex: number) => ({
              id: Date.now() + index * 1000 + setIndex,
              weight: set.weight,
              reps: set.reps,
              completed: false,
            })),
          }));
          setExercises(transformedExercises);
        }
      } catch (error) {
        console.error('Failed to load workout:', error);
        Alert.alert('Error', 'Failed to load workout');
      }
    };

    loadWorkout();
  }, [id, setExercises]);

  const addSet = (exerciseId: number) => {
    setExercises(prev =>
      prev.map(e =>
        e.id === exerciseId
          ? { ...e, sets: [...(e.sets || []), { id: Date.now(), weight: 0, reps: 0, completed: false }] }
          : e
      )
    );
  };

  const toggleSetCompleted = (exerciseId: number, setId: number) => {
    setExercises(prev =>
      prev.map(e =>
        e.id === exerciseId
          ? {
              ...e,
              sets: e.sets?.map((s) =>
                s.id === setId ? { ...s, completed: !s.completed } : s
              ),
            }
          : e
      )
    );
  };

  const deleteSet = (exerciseId: number, setId: number) => {
    setExercises(prev =>
      prev.map(e =>
        e.id === exerciseId
          ? {
              ...e,
              sets: e.sets?.filter((s) => s.id !== setId),
            }
          : e
      )
    );
    
    delete inputRefs.current[`${exerciseId}-${setId}-weight`];
    delete inputRefs.current[`${exerciseId}-${setId}-reps`];
  };

  const updateSetField = (
    exerciseId: number,
    setId: number,
    field: 'weight' | 'reps',
    input: string
  ) => {
    const value = input === '' ? 0 : Number(input);
    setExercises(prev =>
      prev.map(ex =>
        ex.id === exerciseId
          ? {
              ...ex,
              sets: ex.sets?.map((s) =>
                s.id === setId
                  ? { ...s, [field]: value }
                  : s
              ),
            }
          : ex
      )
    );
  };

  const handleClose = () => {
    setExercises([]);
    router.back();
  };

  return (
    <ThemedView
      style={[
        styles.fullScreenContainer,
        { paddingBottom: insets.bottom + 20 },
      ]}
    >
      <Pressable
        style={[styles.button, { backgroundColor: '#7ec782ff', height: '5%', width: '100%', flex: 0,
          marginBottom: 20
         }]}
         onPress={async () => {
          try {
            const originalWorkout = await getWorkout(id as string);
            if (!originalWorkout) {
              Alert.alert('Error', 'Workout not found');
              return;
            }
            await updateWorkout(id as string, {
              name: workoutName,
              duration: originalWorkout.duration,
              exercises,
            });
            setExercises([]);
            router.push('/profile');
            setWorkoutAdded(prev => !prev);
          } catch (error) {
            console.error('Failed to save workout:', error);
            Alert.alert('Error', 'Failed to save workout');
          }
        }}
      >
        <ThemedText style={styles.buttonText}>Save</ThemedText>
      </Pressable>
      
      <TextInput
        style={[styles.nameInput, {color: textColor}]}
        value={String(workoutName)}
        onChangeText={(text) =>
          setWorkoutName(text)
        }
      ></TextInput>

      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: 'transparent' }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={140}
      >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
      <ThemedView style={styles.workoutContent}>
        <ThemedView style={styles.exerciseContainer}>
          {exercises.map((exercise, index) => (
            <ThemedView key={exercise.id} style={[styles.exerciseContent]}>
              {/* Top layer: icon, name, options*/}
              <ThemedView
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                {/* Top layer left: icon, name*/}
                <ThemedView style={{ display: 'flex', flexDirection: 'row' }}>
                  <Image
                    source={{ uri: 'https://via.placeholder.com/50' }}
                    style={[styles.avatar]}
                  />
                  <ThemedText style={styles.exerciseText}>
                    {exercise.name}
                  </ThemedText>
                </ThemedView>

                <Pressable
                  onPress={() => {
                    Alert.alert(
                      'Exercise Options',
                      'Choose an action',
                      [
                        { text: 'Remove', onPress: () => setExercises(prev => prev.filter(e => e.id !== exercise.id)) },
                        { text: 'Replace', onPress: () => { setReplacingExerciseId(exercise.id); router.push('/exercises'); } },
                        { text: 'Cancel', style: 'cancel' }
                      ]
                    );
                  }}
                >
                  <MaterialIcons name="more-horiz" size={24} color="gray" />
                </Pressable>
              </ThemedView>
              {/* Set, Previous, LBS, REPS, Checkmark */}
              <ThemedView style={{ display: 'flex', flexDirection: 'row' }}>
                <ThemedView style={{ display: 'flex', flexDirection: 'row', width: '10%',
                  alignItems: 'center', justifyContent: 'center'
                  }}>
                  <ThemedText>Set</ThemedText>
                </ThemedView>

                <ThemedView style={{ display: 'flex', flexDirection: 'row', width: '30%',
                  alignItems: 'center', justifyContent: 'center'
                  }}>
                  <ThemedText>Previous</ThemedText>
                </ThemedView>

                <ThemedView style={{ display: 'flex', flexDirection: 'row', width: '30%',
                  alignItems: 'center', justifyContent: 'center'
                  }}>
                  <ThemedText>LBS</ThemedText>
                </ThemedView>

                <ThemedView style={{ display: 'flex', flexDirection: 'row', width: '20%',
                  alignItems: 'center', justifyContent: 'center'
                  }}>
                  <ThemedText>Reps</ThemedText>
                </ThemedView>

                <ThemedView style={{ display: 'flex', flexDirection: 'row', width: '10%',
                  alignItems: 'center', justifyContent: 'center'
                  }}>
                  <MaterialIcons name="check-circle" size={24} color="gray"/>
                </ThemedView>

              </ThemedView>
              {(exercise.sets || []).map((set, i) => (
                <SwipeableSet
                  key={set.id}
                  exerciseId={exercise.id}
                  setId={set.id}
                  onDelete={() => deleteSet(exercise.id, set.id)}
                >
                  <ThemedView
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingVertical: 6,
                    }}
                  >
                    {/* SET NUMBER */}
                    <ThemedView style={{ width: '10%', alignItems: 'center' }}>
                      <ThemedText>{i + 1}</ThemedText>
                    </ThemedView>

                    {/* PREVIOUS (placeholder for now) */}
                    <ThemedView style={{ width: '30%', alignItems: 'center' }}>
                      <ThemedText>-</ThemedText>
                    </ThemedView>

                    {/* LBS */}
                    <ThemedView style={{ width: '30%', alignItems: 'center' }}>
                      <TextInput
                        style={[styles.input, {color: textColor}]}
                        keyboardType='numeric'
                        value={String(set.weight)}
                        selectTextOnFocus={true}
                        contextMenuHidden={true}
                        caretHidden={true}
                        showSoftInputOnFocus={true}
                        returnKeyType="done"
                        onSubmitEditing={() => inputRefs.current[`${exercise.id}-${set.id}-weight`]?.blur()}
                        onChangeText={(text) =>
                          updateSetField(exercise.id, set.id, 'weight', text)
                        }
                        ref={(ref) => {
                          inputRefs.current[`${exercise.id}-${set.id}-weight`] = ref;
                        }}
                      ></TextInput>
                    </ThemedView>

                    {/* REPS */}
                    <ThemedView style={{ width: '20%', alignItems: 'center' }}>
                      <TextInput
                        style={[styles.input, {color: textColor}]}
                        keyboardType='numeric'
                        value={String(set.reps)}
                        selectTextOnFocus={true}
                        contextMenuHidden={true}
                        caretHidden={true}
                        showSoftInputOnFocus={true}
                        returnKeyType="done"
                        onSubmitEditing={() => inputRefs.current[`${exercise.id}-${set.id}-reps`]?.blur()}
                        onChangeText={(text) =>
                          updateSetField(exercise.id, set.id, 'reps', text)
                        }
                        ref={(ref) => {
                          inputRefs.current[`${exercise.id}-${set.id}-reps`] = ref;
                        }}
                      ></TextInput>
                    </ThemedView>

                    {/* CHECKMARK */}
                    <ThemedView style={{ width: '10%', alignItems: 'center' }}>
                      <Pressable
                        onPress={()=>{toggleSetCompleted(exercise.id, set.id); }}
                      >
                        <MaterialIcons name="check-circle" size={24} color={set.completed ? 'green' : 'gray'}/>
                      </Pressable>
                    </ThemedView>
                  </ThemedView>
                </SwipeableSet>
              ))}

              <Pressable
                style={[styles.slimButton, {borderRadius: 8, backgroundColor: secondaryColor}]}
                onPress={()=>{addSet(exercise.id)}}
              >
                <ThemedText>+ Add Set</ThemedText>
              </Pressable>
            </ThemedView>
          ))}
        </ThemedView>
      </ThemedView>
      </ScrollView>
      </KeyboardAvoidingView>
      {/* Action buttons with safe area consideration */}
      <ThemedView style={styles.actions}>
        <Pressable
          style={[styles.button, { backgroundColor: '#ff4444' }]}
          onPress={handleClose}
        >
          <ThemedText style={styles.buttonText}>Close Workout</ThemedText>
        </Pressable>

        <Pressable
          style={[styles.button, { backgroundColor: '#7eb8c7'}]}
          onPress={() => {
            router.push('/exercises');
          }}
        >
          <ThemedText style={styles.buttonText}>Add Exercises</ThemedText>
        </Pressable>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    padding: 20,
    paddingTop: 10,
  },
  workoutContent: {
    flex: 1,
    gap: 15,
    padding: 10,
    marginBottom: 10,
  },
  exerciseContainer: {
    display: 'flex',
    gap: 50,
  },
  exerciseContent: {
    display: 'flex',
    gap: 20,
    borderRadius: 0,
  },
  exerciseText: {
    fontSize: 16,
    padding: 12,
    borderRadius: 8,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 'auto',
    paddingBottom: 10,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  slimButton: {
    flex: 1,
    padding: 2,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ccc',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    width: '80%',
    textAlign: 'center',
    borderRadius: 5,
    padding: 4,
  },
  nameInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    textAlign: 'center',
    borderRadius: 15,
    height: '8%',
    padding: 4,
    fontSize: 24,
    marginBottom: 20
  }
});