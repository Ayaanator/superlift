// database.js
import { exercises } from "@/constants/exercises";
import { pastWorkouts } from "@/constants/mockWorkouts";
import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';

let db = null;
if (Platform.OS !== 'web') {
  db = SQLite.openDatabaseSync('simple.db');
}

export const initDB = async () => {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS workouts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      duration REAL NOT NULL,
      date TEXT NOT NULL
    );
  `);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS exercises (
      id INTEGER PRIMARY KEY NOT NULL,
      workout_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      FOREIGN KEY (workout_id) REFERENCES workouts (id)
    );
  `);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS sets (
      id INTEGER PRIMARY KEY NOT NULL,
      exercise_id INTEGER NOT NULL,
      setOrder INTEGER NOT NULL,
      weight REAL NOT NULL,
      reps INTEGER NOT NULL,
      FOREIGN KEY (exercise_id) REFERENCES exercises (id)
    );
  `);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS exercise_master (
      id INTEGER PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      equipment TEXT NOT NULL,
      primaryMuscleGroup TEXT NOT NULL,
      secondaryMuscleGroups TEXT
    );
  `);

  const workoutsResult = await db.getAllAsync('SELECT COUNT(*) as count FROM workouts;');
  await insertMasterExercises();
  if (workoutsResult[0].count === 0) {
    //await insertMockWorkouts();
  }
};

const insertMockWorkouts = async () => {
  for (const workout of pastWorkouts) {
    // Insert workout
    await db.runAsync(
      'INSERT INTO workouts (id, name, duration, date) VALUES (?, ?, ?, ?)',
      [workout.id, workout.name, workout.duration, workout.date]
    );

    for (const exercise of workout.exercises) {
      // Insert exercise and get the inserted ID
      const exerciseName = await db.getAllAsync(
        `SELECT name from exercise_master WHERE id = ?`,
        [exercise.id]
      )

      const exerciseResult = await db.runAsync(
        'INSERT INTO exercises (workout_id, name) VALUES (?, ?)',
        [workout.id, exerciseName[0].name]
      );

      const exerciseId = exerciseResult.lastInsertRowId;

      for (const set of exercise.sets) {
        // Insert sets
        await db.runAsync(
          'INSERT INTO sets (exercise_id, setOrder, weight, reps) VALUES (?, ?, ?, ?)',
          [exerciseId, set.setOrder, set.weight, set.reps]
        );
      }
    }
  }
};

export const getWorkouts = async () => {
  const workouts = await db.getAllAsync('SELECT * FROM workouts ORDER BY date DESC;');
  
  for (const workout of workouts) {
    // Get exercises for each workout
    const exercises = await db.getAllAsync(
      'SELECT * FROM exercises WHERE workout_id = ?',
      [workout.id]
    );

    workout.exercises = [];
    workout.totalVolume = 0;
    
    for (const exercise of exercises) {
      // Get sets for each exercise
      const sets = await db.getAllAsync(
        'SELECT * FROM sets WHERE exercise_id = ? ORDER BY setOrder',
        [exercise.id]
      );

      let exerciseVolume = sets.reduce((sum, set) => sum + set.weight * set.reps, 0);
      workout.totalVolume += exerciseVolume;

      workout.exercises.push({
        name: exercise.name,
        sets: sets,
        volume: exerciseVolume
      });
    }
  }
  
  return workouts;
};

export const getWorkout = async (id) => {
  const workoutResult = await db.getAllAsync(
    'SELECT * FROM workouts WHERE id = ?', 
    [id]
  );
  
  if (workoutResult.length === 0) {
    return null;
  }

  const workout = workoutResult[0];

  workout.exercises = [];
  workout.totalVolume = 0;

  const exercises = await db.getAllAsync(
    'SELECT * FROM exercises WHERE workout_id = ?',
    [id]
  );

  for (const exercise of exercises) {
    // Get sets for each exercise
    const sets = await db.getAllAsync(
      'SELECT * FROM sets WHERE exercise_id = ? ORDER BY setOrder',
      [exercise.id]
    );

    let exerciseVolume = sets.reduce((sum, set) => sum + set.weight * set.reps, 0);
    workout.totalVolume += exerciseVolume;

    workout.exercises.push({
      name: exercise.name,
      sets: sets,
      volume: exerciseVolume
    });
  }

  return workout;
}

export const clearWorkouts = async () => {
  /*await db.execAsync(`DROP TABLE IF EXISTS sets;`);
  await db.execAsync(`DROP TABLE IF EXISTS exercises;`);
  await db.execAsync(`DROP TABLE IF EXISTS workouts;`);*/

  await db.runAsync('DELETE FROM sets;');
  await db.runAsync('DELETE FROM exercises;');
  await db.runAsync('DELETE FROM workouts;');
};

export const insertMasterExercises = async () => {
  for (const exercise of exercises) {
    await db.runAsync(
      `INSERT OR REPLACE INTO exercise_master (id, name, equipment, primaryMuscleGroup, secondaryMuscleGroups)
       VALUES (?, ?, ?, ?, ?)`,
      [
        exercise.id,
        exercise.name,
        exercise.equipment,
        exercise.primaryMuscleGroup,
        JSON.stringify(exercise.secondaryMuscleGroups) // store array as string
      ]
    );
  }
};

export const getExercises = async () => {
  const workouts = await db.getAllAsync('SELECT * FROM exercise_master');
  return workouts;
}

export const addWorkout = async ({ name, duration, exercises }) => {

  if (!db) return;
  const date = new Date().toISOString();

  const workoutResult = await db.runAsync(
    'INSERT INTO workouts (name, duration, date) VALUES (?, ?, ?)',
    [name || 'Untitled Workout', duration, date]
  );

  const workoutId = workoutResult.lastInsertRowId;

  for (const exercise of exercises) {
    const exerciseResult = await db.runAsync(
      'INSERT INTO exercises (workout_id, name) VALUES (?, ?)',
      [workoutId, exercise.name]
    );

    const exerciseId = exerciseResult.lastInsertRowId;

    for (let i = 0; i < (exercise.sets || []).length; i++) {
      const set = exercise.sets[i];

      await db.runAsync(
        'INSERT INTO sets (exercise_id, setOrder, weight, reps) VALUES (?, ?, ?, ?)',
        [
          exerciseId,
          i + 1,
          set.weight,
          set.reps,
        ]
      );
    }
  }

  return workoutId;
};

export const updateWorkout = async (id, { name, duration, exercises }) => {
  if (!db) return;

  // Update the workout record
  await db.runAsync(
    'UPDATE workouts SET name = ?, duration = ? WHERE id = ?',
    [name || 'Untitled Workout', duration, id]
  );

  // Delete existing exercises and sets for this workout
  const existingExercises = await db.getAllAsync(
    'SELECT id FROM exercises WHERE workout_id = ?',
    [id]
  );

  for (const exercise of existingExercises) {
    await db.runAsync('DELETE FROM sets WHERE exercise_id = ?', [exercise.id]);
  }

  await db.runAsync('DELETE FROM exercises WHERE workout_id = ?', [id]);

  // Re-insert exercises and sets
  for (const exercise of exercises) {
    const exerciseResult = await db.runAsync(
      'INSERT INTO exercises (workout_id, name) VALUES (?, ?)',
      [id, exercise.name]
    );

    const exerciseId = exerciseResult.lastInsertRowId;

    for (let i = 0; i < (exercise.sets || []).length; i++) {
      const set = exercise.sets[i];

      await db.runAsync(
        'INSERT INTO sets (exercise_id, setOrder, weight, reps) VALUES (?, ?, ?, ?)',
        [
          exerciseId,
          i + 1,
          set.weight,
          set.reps,
        ]
      );
    }
  }
};

export const deleteWorkout = async (id) => {
  if (!db) return;

  const exercises = await db.getAllAsync(
    'SELECT id FROM exercises WHERE workout_id = ?',
    [id]
  );

  for (const exercise of exercises) {
    await db.runAsync('DELETE FROM sets WHERE exercise_id = ?', [exercise.id]);
  }

  await db.runAsync('DELETE FROM exercises WHERE workout_id = ?', [id]);

  await db.runAsync('DELETE FROM workouts WHERE id = ?', [id]);
};

export const getWorkoutCount = async () => {
  if (!db) return 0;

  const result = await db.getAllAsync('SELECT COUNT(*) as count FROM workouts;');
  return result[0].count;
};