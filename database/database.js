// database.js
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
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      duration TEXT NOT NULL,
      date TEXT NOT NULL
    );
  `);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS exercises (
      id INTEGER PRIMARY KEY NOT NULL,
      workout_id TEXT NOT NULL,
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

  const workoutsResult = await db.getAllAsync('SELECT COUNT(*) as count FROM workouts;');
  if (workoutsResult[0].count === 0) {
    await insertMockWorkouts();
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
      const exerciseResult = await db.runAsync(
        'INSERT INTO exercises (workout_id, name) VALUES (?, ?)',
        [workout.id, exercise.name]
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

export const clearTable = async () => {
  await db.runAsync('DELETE FROM number_table;');
};

export const clearWorkouts = async () => {
  await db.runAsync('DELETE FROM sets;');
  await db.runAsync('DELETE FROM exercises;');
  await db.runAsync('DELETE FROM workouts;');
};