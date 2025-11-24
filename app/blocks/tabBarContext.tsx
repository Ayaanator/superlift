import React, { createContext, ReactNode, useContext, useState } from 'react';

type TabBarHeightContextType = {
  tabBarHeight: number;
  setTabBarHeight: React.Dispatch<React.SetStateAction<number>>;
};

// Create context with default null
const TabBarHeightContext = createContext<TabBarHeightContextType | null>(null);

export function TabBarHeightProvider({ children }: { children: ReactNode }) {
  const [tabBarHeight, setTabBarHeight] = useState(0);

  return (
    <TabBarHeightContext.Provider value={{ tabBarHeight, setTabBarHeight }}>
      {children}
    </TabBarHeightContext.Provider>
  );
}

export function useTabBarHeight() {
  const ctx = useContext(TabBarHeightContext);
  if (!ctx) {
    throw new Error('useTabBarHeight must be used inside TabBarHeightProvider');
  }
  return ctx;
}
