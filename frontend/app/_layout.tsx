import React from 'react';
import { Stack } from 'expo-router';
import { LanguageProvider } from '../contexts/LanguageContext';

export default function RootLayout() {
  return (
    <LanguageProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="language-select" />
        <Stack.Screen name="home" />
        <Stack.Screen name="all-emergencies" />
        <Stack.Screen name="cpr-selection" />
        <Stack.Screen name="emergency-guide" />
        <Stack.Screen name="symptom-checker" />
      </Stack>
    </LanguageProvider>
  );
}