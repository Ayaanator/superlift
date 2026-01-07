import React, { createContext, ReactNode, useContext, useState } from 'react';
import type { Exercise } from '../exercises';

type WorkoutPanelContextType = {
  expanded: boolean;
  setExpanded: (v: boolean) => void;
  active: boolean;
  setActive: (v: boolean) => void;
  closeWorkout: () => void;
  exercises: Exercise[];
  setExercises: React.Dispatch<React.SetStateAction<Exercise[]>>;
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
};

const WorkoutPanelContext = createContext<WorkoutPanelContextType | null>(null);

export function WorkoutPanelProvider({ children }: { children: ReactNode }) {
  const [expanded, setExpanded] = useState(false);
  const [active, setActive] = useState(false);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [workoutAdded, setWorkoutAdded] = useState(false);
  const [deletedWorkout, setDeletedWorkout] = useState(false);
  const [editWorkout, setEditWorkout] = useState(false);
  const [viewedWorkoutId, setViewedWorkoutId] = useState(-1);
  const [replacingExerciseId, setReplacingExerciseId] = useState<number | null>(null);

  const closeWorkout = () => {
    setActive(false);
    setExpanded(false);
  };

  return (
    <WorkoutPanelContext.Provider value={{ 
      expanded, 
      setExpanded, 
      active, 
      setActive,
      closeWorkout,
      exercises,
      setExercises,
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