import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from '@react-navigation/native';
import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useMemo } from 'react';
import { AppState } from 'react-native';
import 'react-native-reanimated';

import { AuthProvider } from '@/components/auth-context';
import { ThemeProvider as AppThemeProvider } from '@/components/theme-context';
import { useTheme } from '@/hooks/use-theme';
import { onAppStateChange, queryClient } from '@/services/query-client';

export const unstable_settings = {
  initialRouteName: 'index',
};

function Inner() {
  const { mode } = useTheme();

  useEffect(() => {
    const subscription = AppState.addEventListener('change', onAppStateChange);
    return () => subscription.remove();
  }, []);

  const navigationTheme = useMemo(
    () => (mode === 'dark' ? DarkTheme : DefaultTheme),
    [mode],
  );

  return (
    <NavigationThemeProvider value={navigationTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </NavigationThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppThemeProvider>
        <AuthProvider>
          <Inner />
        </AuthProvider>
      </AppThemeProvider>
    </QueryClientProvider>
  );
}
