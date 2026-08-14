import React from 'react';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LanguageProvider } from '../contexts/LanguageContext';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <LanguageProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
            animationDuration: 450,
          }}
        >
          <Stack.Screen name="index" options={{ animation: 'fade' }} />
          <Stack.Screen name="language-select" options={{ animation: 'fade' }} />
          <Stack.Screen name="home" options={{ animation: 'fade' }} />
          <Stack.Screen name="all-emergencies" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="cpr-selection" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="emergency-guide" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="symptom-checker" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="sos" options={{ animation: 'slide_from_right' }} />
        </Stack>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}