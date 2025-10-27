import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function UserInfo() {
  const background = useThemeColor({}, 'background');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: background }}>
      <ThemedView
        style={{
          padding: 10,
          margin: 10,
          borderRadius: 12,
        }}
      >
        {/* Image container */}
        <ThemedView
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            marginBottom: 20,
            paddingTop: 20, // extra top spacing for phones
            gap: 30
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
          <ThemedView>
            <ThemedText
              style={{
                fontWeight: '700',
                fontSize: 22,
              }}
            >
              Ayaan Adrito
            </ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedText>
          Lorem ipsum si dolor amet
        </ThemedText>
      </ThemedView>
    </SafeAreaView>
  );
}
