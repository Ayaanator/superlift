import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { addWorkout } from '@/database/database';
import { useThemeColor } from '@/hooks/use-theme-color';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useWorkoutPanel } from './workoutPanelContext';

type Props = {
  preview?: boolean;
  fullScreen?: boolean;
};

export default function CurrentWorkout({
  preview = false,
  fullScreen = false,
  }: Props) {
  const { closeWorkout, setExpanded, setExercises, exercises } = useWorkoutPanel();
  const [workoutName, setWorkoutName] = useState("");
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  const insets = useSafeAreaInsets();
  const router = useRouter();
  const backgroundColor = useThemeColor({}, 'background');
  const secondaryColor = useThemeColor({}, 'secondary');
  const textColor = useThemeColor({}, 'text');

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsElapsed(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval); // cleanup on unmount
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const addSet = (exerciseId: number) => {
    setExercises(prev =>
      prev.map(e =>
        e.id === exerciseId
          ? { ...e, sets: [...(e.sets || []), { weight: 0, reps: 0, completed: false }] }
          : e
      )
    );
  };

  const toggleSetCompleted = (exerciseId: number, setIndex: number) => {
    setExercises(prev =>
      prev.map(e =>
        e.id === exerciseId
          ? {
              ...e,
              sets: e.sets?.map((s, i) =>
                i === setIndex ? { ...s, completed: !s.completed } : s
              ),
            }
          : e
      )
    );
  };

  const updateSetField = (
    exerciseId: number,
    setIndex: number,
    field: 'weight' | 'reps',
    input: string
  ) => {
    const value = input === '' ? 0 : Number(input);
    setExercises(prev =>
      prev.map(ex =>
        ex.id === exerciseId
          ? {
              ...ex,
              sets: ex.sets?.map((s, i) =>
                i === setIndex
                  ? { ...s, [field]: value }
                  : s
              ),
            }
          : ex
      )
    );

    // console.log('Updated exercises:', JSON.stringify(exercises, null, 2));
  };

  const handleClose = () => {
    closeWorkout();
  };

  if (preview) {
    return (
      <ThemedView style={styles.previewContainer}>
        <ThemedText style={styles.previewText}>
          Workout in progress...
        </ThemedText>
        <ThemedText style={styles.previewSubtext}>Tap to expand</ThemedText>
      </ThemedView>
    );
  }

  // console.log(exercises);

  return (
    <ThemedView
      style={[
        styles.fullScreenContainer,
        { paddingBottom: insets.bottom + 20 }, // Add space for home indicator
      ]}
    >
      <Pressable
        style={[styles.button, { backgroundColor: '#7ec782ff', height: '5%', width: '100%', flex: 0,
          marginBottom: 20
         }]}
         onPress={async () => {
          try {
            await addWorkout({
              name: workoutName,
              duration: secondsElapsed,
              exercises,
            });

            closeWorkout();
          } catch (error) {
            console.error('Failed to save workout:', error);
          }
        }}
      >
        <ThemedText style={styles.buttonText}>Finish</ThemedText>
      </Pressable>

      <TextInput
        style={[styles.nameInput, {color: textColor}]}
        value={String(workoutName)}
        /*selectTextOnFocus={true}
        contextMenuHidden={true}
        caretHidden={true}
        showSoftInputOnFocus={true}*/
        onChangeText={(text) =>
          setWorkoutName(text)
        }
      ></TextInput>

      <ThemedText style={styles.subTitle}>{formatTime(secondsElapsed)}</ThemedText>
      
      <ThemedView style={styles.workoutContent}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        >
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

                  <MaterialIcons name="more-horiz" size={24} color="gray" />
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
                  <ThemedView
                    key={i}
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
                        onChangeText={(text) =>
                          updateSetField(exercise.id, i, 'weight', text)
                        }
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
                        onChangeText={(text) =>
                          updateSetField(exercise.id, i, 'reps', text)
                        }
                      ></TextInput>
                    </ThemedView>

                    {/* CHECKMARK */}
                    <ThemedView style={{ width: '10%', alignItems: 'center' }}>
                      <Pressable
                        onPress={()=>{toggleSetCompleted(exercise.id, i); }}
                      >
                        <MaterialIcons name="check-circle" size={24} color={set.completed ? 'green' : 'gray'}/>
                      </Pressable>
                    </ThemedView>
                  </ThemedView>
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
        </ScrollView>
      </ThemedView>

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
            //router.push('/blocks/pastWorkouts');
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
  previewContainer: {
    flex: 1,
    padding: 15,
    justifyContent: 'center',
    backgroundColor: '#151718',
  },
  previewText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  previewSubtext: {
    fontSize: 14,
    opacity: 0.7,
  },
  fullScreenContainer: {
    flex: 1,
    padding: 20,
    paddingTop: 10,
  },
  fullTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  subTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
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
    // backgroundColor: 'rgba(0,0,0,0.1)',
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
  addSetButton: {
    backgroundColor: '#737f81ff',
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
