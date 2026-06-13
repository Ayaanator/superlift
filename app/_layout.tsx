import WorkoutPanel from '@/app/blocks/workoutPanel';
import { ThemedText } from '@/components/themed-text';
import { initDB } from '@/database/database';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';

import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import 'react-native-reanimated';
import { useDeleteWorkoutTest, useEnableEditing } from './blocks/pastWorkouts';
import { TabBarHeightProvider } from './blocks/tabBarContext';
import { WorkoutPanelProvider } from './blocks/workoutPanelContext';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  const outerBackgroundColor = colorScheme === 'dark' ? '#35393b' : '#f3ebe1';
  const innerBackgroundColor = colorScheme === 'dark' ? '#151718' : '#ffffff';

  useEffect(() => {
    initDB();
  }, []);

  const WorkoutDetailsHeader = () => {
    const deleteWorkout = useDeleteWorkoutTest();
    const enableEdit = useEnableEditing();
    const router = useRouter();
    const [showMenu, setShowMenu] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const secondaryColor = useThemeColor({}, 'secondary');

    const handleDelete = () => {
      deleteWorkout();
      setShowDeleteConfirm(false);
      setShowMenu(false);
      router.back();
    };

    const handleEdit = () => {
      setShowMenu(false);
      enableEdit();
    };

    const handleMenuPress = () => {
      if (Platform.OS === 'web') {
        setShowMenu(true);
      } else {
        Alert.alert('Options', '', [
          { text: 'Edit', onPress: handleEdit },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => {
              Alert.alert(
                'Delete Workout',
                'Are you sure you want to delete this workout? This action cannot be undone.',
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: handleDelete,
                  },
                ],
              );
            },
          },
          { text: 'Cancel', style: 'cancel' },
        ]);
      }
    };

    return (
      <>
        <Pressable
          onPress={handleMenuPress}
          style={({ pressed }) => [
            {
              paddingHorizontal: 10,
              paddingVertical: 10,
              justifyContent: 'center',
              alignItems: 'center',
              opacity: pressed ? 0.6 : 1,
            },
          ]}
        >
          <Ionicons name="ellipsis-vertical" size={22} color="#007AFF" />
        </Pressable>

        {Platform.OS === 'web' && (
          <>
            <Modal
              visible={showMenu}
              transparent={true}
              animationType="fade"
              onRequestClose={() => setShowMenu(false)}
            >
              <Pressable
                style={styles.webMenuBackdrop}
                onPress={() => setShowMenu(false)}
              >
                <View style={styles.webMenuInnerWrapper}>
                  <Pressable
                    style={[
                      styles.webMenuContainer,
                      { backgroundColor: secondaryColor },
                    ]}
                    onPress={(e) => e.stopPropagation?.()}
                  >
                    <Pressable
                      style={styles.webMenuItem}
                      onPress={() => {
                        setShowMenu(false);
                        handleEdit();
                      }}
                    >
                      <ThemedText style={styles.webMenuText}>Edit</ThemedText>
                    </Pressable>
                    <Pressable
                      style={[styles.webMenuItem, styles.webMenuItemDanger]}
                      onPress={() => {
                        setShowMenu(false);
                        setShowDeleteConfirm(true);
                      }}
                    >
                      <ThemedText
                        style={[styles.webMenuText, { color: '#FF3B30' }]}
                      >
                        Delete
                      </ThemedText>
                    </Pressable>
                  </Pressable>
                </View>
              </Pressable>
            </Modal>

            <Modal
              visible={showDeleteConfirm}
              transparent={true}
              animationType="fade"
              onRequestClose={() => setShowDeleteConfirm(false)}
            >
              <Pressable
                style={styles.deleteConfirmOverlay}
                onPress={() => {
                  setShowDeleteConfirm(false);
                  setShowMenu(false);
                }}
              >
                <Pressable
                  style={[
                    styles.deleteConfirmModal,
                    { backgroundColor: secondaryColor },
                  ]}
                  onPress={(e) => e.stopPropagation?.()}
                >
                  <ThemedText style={styles.deleteConfirmTitle}>
                    Delete Workout
                  </ThemedText>
                  <ThemedText style={styles.deleteConfirmMessage}>
                    Are you sure you want to delete this workout? This action
                    cannot be undone.
                  </ThemedText>
                  <View style={styles.deleteConfirmButtons}>
                    <Pressable
                      style={[
                        styles.deleteConfirmButton,
                        { backgroundColor: secondaryColor },
                      ]}
                      onPress={() => {
                        setShowDeleteConfirm(false);
                        setShowMenu(false);
                      }}
                    >
                      <ThemedText style={[styles.deleteConfirmButtonText]}>
                        Cancel
                      </ThemedText>
                    </Pressable>
                    <Pressable
                      style={[
                        styles.deleteConfirmButton,
                        styles.deleteConfirmButtonDanger,
                      ]}
                      onPress={handleDelete}
                    >
                      <ThemedText
                        style={[
                          styles.deleteConfirmButtonText,
                          { color: '#fff' },
                        ]}
                      >
                        Delete
                      </ThemedText>
                    </Pressable>
                  </View>
                </Pressable>
              </Pressable>
            </Modal>
          </>
        )}
      </>
    );
  };

  return (
    <WorkoutPanelProvider>
      <TabBarHeightProvider>
        <ThemeProvider
          value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
        >
          <View
            style={[
              styles.appWrapper,
              styles.noSelect,
              { backgroundColor: outerBackgroundColor },
            ]}
          >
            <View
              style={[
                styles.webWidthWrapper,
                styles.noSelect,
                { backgroundColor: innerBackgroundColor },
              ]}
            >
              <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen
                  name="modal"
                  options={{ presentation: 'modal', title: 'Modal' }}
                />
                <Stack.Screen
                  name="exercises"
                  options={{
                    presentation: 'modal',
                    title: 'Add Exercise',
                    headerRight: () => (
                      <Pressable
                        onPress={() => console.log('Create pressed')}
                        style={({ pressed }) => [
                          styles.headerButton,
                          styles.headerButtonPrimary,
                          { opacity: pressed ? 0.7 : 1 },
                          { marginRight: 20 },
                        ]}
                      >
                        <ThemedText style={styles.headerButtonText}>
                          Create
                        </ThemedText>
                      </Pressable>
                    ),
                    headerLeft: () => (
                      <Pressable
                        onPress={() => router.back()}
                        style={({ pressed }) => [
                          styles.headerButton,
                          styles.headerButtonSecondary,
                          styles.buttonBackground,
                          { opacity: pressed ? 0.7 : 1 },
                          { marginLeft: 20 },
                        ]}
                      >
                        <ThemedText
                          style={[
                            styles.headerButtonText,
                            styles.headerButtonTextSecondary,
                          ]}
                        >
                          Cancel
                        </ThemedText>
                      </Pressable>
                    ),
                  }}
                />
                <Stack.Screen
                  name="workouts/details"
                  options={{
                    presentation: 'modal',
                    title: 'Workout Details',
                    headerRight: () => <WorkoutDetailsHeader />,
                    headerLeft: () => (
                      <Pressable
                        onPress={() => router.back()}
                        style={({ pressed }) => [
                          styles.headerButton,
                          styles.headerButtonSecondary,
                          { opacity: pressed ? 0.7 : 1 },
                        ]}
                      >
                        <ThemedText
                          style={[
                            styles.headerButtonText,
                            styles.headerButtonTextSecondary,
                            styles.buttonBackground,
                          ]}
                        >
                          Back
                        </ThemedText>
                      </Pressable>
                    ),
                  }}
                />
                <Stack.Screen
                  name="workouts/editMode"
                  options={{
                    presentation: 'modal',
                    title: 'Editing Workout...',
                    /*headerRight: () => (
                <Pressable onPress={() => console.log('Save pressed')}>
                  <ThemedText style={[{ color: '#007AFF', fontSize: 17 }, styles.text]}>
                    Save
                  </ThemedText>
                </Pressable>
              ),
              headerLeft: () => (
                <Pressable onPress={() => router.back()}>
                  <ThemedText style={[{ color: '#FF3B30', fontSize: 17 }, styles.text]}>
                    Back
                  </ThemedText>
                </Pressable>
              ),*/
                  }}
                />
              </Stack>
              <WorkoutPanel />
            </View>
          </View>
          <StatusBar style="auto" />
        </ThemeProvider>
      </TabBarHeightProvider>
    </WorkoutPanelProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  text: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  headerButtonPrimary: {
    backgroundColor: '#007AFF',
  },
  headerButtonSecondary: {
    backgroundColor: 'transparent',
  },
  headerButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  headerButtonTextSecondary: {
    color: '#FF3B30',
  },
  webMenuContainer: {
    width: 220,
    maxWidth: 240,
    alignSelf: 'flex-end',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
    borderWidth: 1,
    borderColor: '#575757',
  },
  webMenuBackdrop: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
  },
  webMenuInnerWrapper: {
    width: '100%',
    maxWidth: 480,
    alignItems: 'flex-end',
    paddingTop: 64,
    paddingRight: 12,
  },
  webMenuItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#575757',
  },
  webMenuItemDanger: {
    borderBottomWidth: 0,
  },
  webMenuText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#007AFF',
  },
  appWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  webWidthWrapper: {
    width: '100%',
    maxWidth: Platform.OS === 'web' ? 480 : '100%',
    minHeight: '100%',
  },
  noSelect: {
    userSelect: 'none',
    //WebkitUserSelect: 'none',
    //MozUserSelect: 'none',
    //WebkitTouchCallout: 'none',
  },
  deleteConfirmOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  deleteConfirmModal: {
    borderRadius: 12,
    padding: 20,
    minWidth: 300,
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  deleteConfirmTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  deleteConfirmMessage: {
    fontSize: 14,
    marginBottom: 20,
    lineHeight: 20,
  },
  deleteConfirmButtons: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'flex-end',
  },
  deleteConfirmButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#575757',
    minWidth: 100,
    alignItems: 'center',
  },
  deleteConfirmButtonDanger: {
    backgroundColor: '#FF3B30',
    borderColor: '#FF3B30',
  },
  deleteConfirmButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  buttonPadding: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
    backgroundColor: '#1f2122',
  },
  buttonBackground: {
    backgroundColor: '#1f2122',
    padding: 6,
    borderRadius: 5,
  },
});
