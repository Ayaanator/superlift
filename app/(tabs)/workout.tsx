import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { StyleSheet } from 'react-native';

export default function TabTwoScreen() {
  return (
    <ThemedView style={[styles.container, { overflow: 'visible' }]}>
      <ThemedText>
        Test!
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',  
    alignItems: 'center',      
  }
});
