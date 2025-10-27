// database.js
import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';

let db = null;
if (Platform.OS !== 'web') {
  db = SQLite.openDatabaseSync('simple.db');
}

// Initialize the table and insert number 3 if empty
export const initDB = async () => {
  // Create table
  await db.execAsync(
    'CREATE TABLE IF NOT EXISTS number_table (id INTEGER PRIMARY KEY NOT NULL, value INTEGER);'
  );

  // Check if empty and insert 3
  const result = await db.getAllAsync('SELECT COUNT(*) as count FROM number_table;');
  if (result[0].count === 0) {
    await db.runAsync('INSERT INTO number_table (value) VALUES (3);');
  }
};

// Function to get the number
export const getNumber = async () => {
  const result = await db.getAllAsync('SELECT value FROM number_table LIMIT 1;');
  return result.length > 0 ? result[0].value : null;
};