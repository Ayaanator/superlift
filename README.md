# SuperLift

SuperLift is a cross-platform workout tracking app built with Expo and React Native. It is designed to run on iOS, Android, and web while persisting workout history locally for offline use.

Website link: https://superlift-ooweaukcz-ayaanators-projects.vercel.app/profile

## Project overview

This app provides a local-first training log for recording workouts, viewing past sessions, and editing saved routines. It uses `expo-router` for multi-screen navigation, `expo-sqlite` for device-level persistence, and React Native gesture APIs for interactive workout UI.

## Key features

- Log workouts with a name, duration, exercises, and sets
- View past workout sessions with history and session details
- Edit and delete saved workouts using full CRUD flows
- Use an offline-first SQLite data model for `workouts`, `exercises`, and `sets`
- Gesture-driven UI interactions with `react-native` `Animated` and `PanResponder`
- Cross-platform support for Expo web, Android, and iOS

## Resume-aligned highlights

- In development: built a cross-platform workout tracking app using Expo/React Native for logging workouts and viewing session history
- Designed a local-first SQLite data model for workouts, exercises, and sets to support full offline functionality
- Implemented core CRUD flows for workouts across multi-screen navigation, including create, edit, and delete operations
- Built gesture-based UI interactions (swipe-to-delete, expandable workout views) using React Native Animated/PanResponder

## Tech stack

- Expo / React Native
- Expo Router
- React Navigation
- Expo SQLite (`expo-sqlite`)
- React Native Animated / PanResponder
- TypeScript
- Web support via Expo Web

## Database model

The app stores workout data locally using SQLite tables for:

- `workouts`
- `exercises`
- `sets`
- `exercise_master`

This local-first architecture enables offline persistence and a smooth mobile experience without any remote backend.

## Getting started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

3. Open the app on your desired platform:
   - Android emulator
   - iOS simulator
   - web browser
   - Expo Go

## Notes

The current implementation focuses on client-side workout tracking and local persistence. The app is structured for further enhancements such as exercise search, analytics, and cloud sync.
