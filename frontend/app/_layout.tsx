import React from 'react';
import { Stack } from 'expo-router';
import { LanguageProvider } from '../contexts/LanguageContext';

export default function RootLayout() {
  return (
    <LanguageProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          animationDuration: 250,
        }}
      >
        <Stack.Screen name="index" options={{ animation: 'fade' }} />
        <Stack.Screen name="language-select" options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="home" options={{ animation: 'fade' }} />
        <Stack.Screen name="all-emergencies" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="cpr-selection" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="emergency-guide" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="symptom-checker" options={{ animation: 'slide_from_right' }} />
      </Stack>
    </LanguageProvider>
  );
}