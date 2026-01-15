import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { getWorkoutCount } from '@/database/database';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useEffect, useState } from 'react';
import { Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWorkoutPanel } from './workoutPanelContext';

export default function UserInfo() {
  const background = useThemeColor({}, 'background');
  const [workoutCount, setWorkoutCount] = useState(0);
  const { workoutAdded, deletedWorkout } = useWorkoutPanel();

  useEffect(() => {
    const fetchWorkoutCount = async () => {
      const count = await getWorkoutCount();
      setWorkoutCount(count);
    };
    fetchWorkoutCount();
  }, [workoutAdded, deletedWorkout])

  return (
    <SafeAreaView style={{ backgroundColor: background }}>
      <ThemedView
        style={{
          padding: 10,
          margin: 10,
          marginBottom: 0,
          borderRadius: 12,
        }}
      >
        <ThemedView
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            marginBottom: 20,
            paddingTop: 20,
            gap: 20,
          }}
        >
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
            }}
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
            }}
          />
          <ThemedView
            style={{
              flexDirection: 'column',
              gap: 15,
            }}
          >
            <ThemedText
              style={{
                fontWeight: '700',
                fontSize: 22,
              }}
            >
              Ayaan Adrito
            </ThemedText>

            <ThemedView
              style={{
                flexDirection: 'row',
                gap: 15,
              }}
            >
              <ThemedView>
                <ThemedText>Workouts</ThemedText>
                <ThemedText>{workoutCount}</ThemedText>
              </ThemedView>

              <ThemedView>
                <ThemedText>Followers</ThemedText>
                <ThemedText>0</ThemedText>
              </ThemedView>

              <ThemedView>
                <ThemedText>Following</ThemedText>
                <ThemedText>0</ThemedText>
              </ThemedView>
            </ThemedView>
          </ThemedView>
        </ThemedView>

        <ThemedText>
          Lorem ipsum si dolor amet
        </ThemedText>
      </ThemedView>
    </SafeAreaView>
  );
}
