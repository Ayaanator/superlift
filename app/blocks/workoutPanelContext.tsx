import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import type { Exercise } from '../exercises';

type WorkoutPanelContextType = {
  expanded: boolean;
  setExpanded: (v: boolean) => void;
  active: boolean;
  setActive: (v: boolean) => void;
  closeWorkout: () => void;
  exercises: Exercise[];
  setExercises: React.Dispatch<React.SetStateAction<Exercise[]>>;
  secondsElapsed: number;
  setSecondsElapsed: React.Dispatch<React.SetStateAction<number>>;
  workoutAdded: boolean;
  setWorkoutAdded: React.Dispatch<React.SetStateAction<boolean>>;
  deletedWorkout: boolean;
  setDeletedWorkout: React.Dispatch<React.SetStateAction<boolean>>;
  viewedWorkoutId: number;
  setViewedWorkoutId: React.Dispatch<React.SetStateAction<number>>;
  editWorkout: boolean;
  setEditWorkout: React.Dispatch<React.SetStateAction<boolean>>;
  replacingExerciseId: number | null;
  setReplacingExerciseId: (id: number | null) => void;
  workoutName: string;
  setWorkoutName: (n: string) => void;
};

const WorkoutPanelContext = createContext<WorkoutPanelContextType | null>(null);

export function WorkoutPanelProvider({ children }: { children: ReactNode }) {
  const [expanded, setExpanded] = useState(false);
  const [active, setActive] = useState(false);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [workoutAdded, setWorkoutAdded] = useState(false);
  const [deletedWorkout, setDeletedWorkout] = useState(false);
  const [editWorkout, setEditWorkout] = useState(false);
  const [viewedWorkoutId, setViewedWorkoutId] = useState(-1);
  const [replacingExerciseId, setReplacingExerciseId] = useState<number | null>(null);
  const [workoutName, setWorkoutName] = useState("");

  const closeWorkout = () => {
    setActive(false);
    setExpanded(false);
    setSecondsElapsed(0);
  };

  useEffect(() => {
    if (!active) {
      return;
    }

    const interval = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [active]);

  return (
    <WorkoutPanelContext.Provider value={{ 
      expanded, 
      setExpanded, 
      active, 
      setActive,
      closeWorkout,
      exercises,
      setExercises,
      secondsElapsed,
      setSecondsElapsed,
      workoutAdded,
      setWorkoutAdded,
      deletedWorkout,
      setDeletedWorkout,
      setViewedWorkoutId,
      viewedWorkoutId,
      editWorkout,
      setEditWorkout,
      replacingExerciseId,
      setReplacingExerciseId,
      workoutName,
      setWorkoutName
    }}>
      {children}
    </WorkoutPanelContext.Provider>
  );
}

export function useWorkoutPanel() {
  const ctx = useContext(WorkoutPanelContext);
  if (!ctx) {
    throw new Error('useWorkoutPanel must be used inside WorkoutPanelProvider');
  }
  return ctx;
}