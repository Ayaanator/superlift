import CurrentWorkout from '@/app/blocks/currentWorkout';
import { ThemedView } from '@/components/themed-view';
import { useSegments } from 'expo-router';
import React, { useRef } from 'react';
import { Animated, Dimensions, PanResponder, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTabBarHeight } from './tabBarContext';
import { useWorkoutPanel } from './workoutPanelContext';

const SCREEN_HEIGHT = Dimensions.get('window').height;

export default function WorkoutPanel() {
  const { expanded, setExpanded, active } = useWorkoutPanel();
  const { tabBarHeight } = useTabBarHeight();
  const insets = useSafeAreaInsets();
  const segments = useSegments();
  const isOnTabScreen = segments[0] === '(tabs)';
  const pan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dy) > 5,
      onPanResponderMove: (_, gesture) => {
        pan.setValue({ x: 0, y: gesture.dy });
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dy < -50) setExpanded(true);
        else if (gesture.dy > 50) setExpanded(false);
        Animated.spring(pan, { toValue: { x: 0, y: 0 }, tension: 80, friction: 50, useNativeDriver: false }).start();
      },
    })
  ).current;

  const REAL_HEIGHT = tabBarHeight;

  // Stack modals are separate routes on web (no native layer), so this
  // overlay would sit on top of them due to zIndex and block the UI.
  if (!active || !isOnTabScreen) return null;

  // const TAB_BAR_HEIGHT = tabBarHeight;
  // const TAB_BAR_HEIGHT = 50;
  const TAB_BAR_HEIGHT = REAL_HEIGHT;
  const COLLAPSED_HEIGHT = 140;
  const EXPANDED_HEIGHT = SCREEN_HEIGHT - insets.top;

  return (
    <Animated.View
      style={[
        styles.container,
        expanded
          ? { ...styles.expanded, height: EXPANDED_HEIGHT, top: insets.top }
          : { ...styles.collapsed, height: COLLAPSED_HEIGHT, bottom: TAB_BAR_HEIGHT },
        { transform: pan.getTranslateTransform() },
      ]}
    >
      <Animated.View style={styles.header} {...panResponder.panHandlers}>
        <ThemedView style={styles.dragHandle} />
      </Animated.View>

      <ThemedView style={styles.content}>
        <CurrentWorkout fullScreen={expanded} preview={!expanded} />
      </ThemedView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    backgroundColor: '#151718',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    elevation: 25,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
    zIndex: 1000,
  },
  header: {
    height: 44,
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
  collapsed: {},
  expanded: {},
});
