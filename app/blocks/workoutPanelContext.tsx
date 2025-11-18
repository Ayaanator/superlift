import React, { createContext, ReactNode, useContext, useState } from 'react';

type WorkoutPanelContextType = {
  expanded: boolean;
  setExpanded: (v: boolean) => void;
  active: boolean;
  setActive: (v: boolean) => void;
  closeWorkout: () => void;
};

const WorkoutPanelContext = createContext<WorkoutPanelContextType | null>(null);

export function WorkoutPanelProvider({ children }: { children: ReactNode }) {
  const [expanded, setExpanded] = useState(false);
  const [active, setActive] = useState(false);

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
      closeWorkout 
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