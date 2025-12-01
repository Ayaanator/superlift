import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { getExercises } from '@/database/database';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';


type Exercise = {
  id: number;
  name: string;
  equipment: string;
  primaryMuscleGroup: string;
  secondaryMuscleGroups: string[];
};

export default function ModalScreen() {
  const [masterExercises, setMasterExercises] = useState<Exercise[]>([]);

  useEffect(() => {
    (async () => {
      const exercises = await getExercises();
      setMasterExercises(exercises);
    })();
    // console.log(masterExercises);
  }, [])

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle" style={{marginBottom: 30}}>Available Exercises</ThemedText>
      {/*<Link href="/" dismissTo style={styles.link}>
        <ThemedText type="link">Go to home screen</ThemedText>
      </Link>*/}
      <ThemedView style={styles.exerciseContainer}>
        {masterExercises.map((exercise, index) => (
          <ThemedView key={index} style={styles.exercise}>
            <Pressable onPress={() => {console.log("HESBGYESGB");}}>
              <ThemedText style={{fontWeight: '800'}}>{exercise.name}</ThemedText>
              <ThemedText style={{fontWeight: '400'}}>{exercise.primaryMuscleGroup}</ThemedText>
            </Pressable>
          </ThemedView>
        ))}
      </ThemedView>
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
    gap: 20,
  },
  exercise: {
    display: 'flex',
  },
});
