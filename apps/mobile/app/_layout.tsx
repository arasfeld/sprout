import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useMemo } from 'react';
import 'react-native-reanimated';

import { ThemeProvider as AppThemeProvider } from '@/components/theme-context';
import { useTheme } from '@/hooks/use-theme';

export const unstable_settings = {
  anchor: '(tabs)',
};

function Inner() {
  const { mode } = useTheme();

  const navigationTheme = useMemo(
    () => (mode === 'dark' ? DarkTheme : DefaultTheme),
    [mode],
  );

  return (
    <NavigationThemeProvider value={navigationTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="modal"
          options={{ presentation: 'modal', title: 'Modal' }}
        />
      </Stack>
      <StatusBar style="auto" />
    </NavigationThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AppThemeProvider>
      <Inner />
    </AppThemeProvider>
  );
}
