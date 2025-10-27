import UserInfo from "@/app/blocks/userInfo";
import { ThemedView } from '@/components/themed-view';
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { getNumber, initDB } from '@/database/database';

export default function TabTwoScreen() {
  const [number, setNumber] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      await initDB();
      const num = await getNumber();
      setNumber(num);
    };
    
    loadData();
  }, []);

  return (
    <ThemedView
      style={{ flex: 1 }}
    >
      <UserInfo></UserInfo>
      <ThemedText>Number from DB: {number}</ThemedText>
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
});
