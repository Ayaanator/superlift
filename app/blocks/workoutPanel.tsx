import CurrentWorkout from '@/app/blocks/currentWorkout';
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { useWorkoutPanel } from './workoutPanelContext';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const TAB_BAR_HEIGHT = 50; // Approximate tab bar height

export default function WorkoutPanel() {
  const { expanded, setExpanded, active } = useWorkoutPanel();

  // If no workout is active, hide the panel entirely.
  if (!active) return null;

  return (
    <View style={[styles.container, expanded ? styles.expanded : styles.collapsed]}>
      {/* Only make the header area pressable for expand/collapse */}
      <View style={styles.header}>
        <View 
          style={styles.dragHandle}
          onTouchEnd={() => setExpanded(!expanded)}
        />
      </View>
      
      <View style={styles.content}>
        <CurrentWorkout 
          fullScreen={expanded} 
          preview={!expanded} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    left: 0,
    backgroundColor: '#222',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
    elevation: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 1000, // Ensure it's above tab bar
  },
  header: {
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingTop: 8,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#666',
    borderRadius: 2,
  },
  content: {
    flex: 1,
  },
  // collapsed mini-player height - sits above tab bar
  collapsed: {
    height: 80,
    bottom: TAB_BAR_HEIGHT, // Position above tab bar
  },
  // expanded takes most of screen but leaves space for status bar
  expanded: {
    height: SCREEN_HEIGHT - 40, // Leave some space at top
    top: 40, // Start below status bar
  },
});