import { Stack, SplashScreen } from 'expo-router';
import React, { useEffect } from 'react';
import { AppState } from 'react-native';
import 'react-native-reanimated';

import { Providers } from '@/components/providers';
import { useAuth } from '@/components/auth-context';
import { useTheme } from '@/hooks/use-theme';
import { onAppStateChange } from '@/services/query-client';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

function RootLayoutNav() {
  const { colors } = useTheme();
  const { session, isLoading } = useAuth();

  useEffect(() => {
    const subscription = AppState.addEventListener('change', onAppStateChange);
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.card },
        headerTintColor: colors.primary,
        headerTitleStyle: { color: colors.foreground },
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Protected guard={!!session}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="add-child"
          options={{ title: 'Add child', headerBackTitle: 'Cancel' }}
        />
        <Stack.Screen
          name="events/feed"
          options={{ presentation: 'modal', title: 'Log Feed' }}
        />
        <Stack.Screen
          name="events/sleep"
          options={{ presentation: 'modal', title: 'Log Sleep' }}
        />
        <Stack.Screen
          name="events/diaper"
          options={{ presentation: 'modal', title: 'Log Diaper' }}
        />
        <Stack.Screen
          name="events/growth"
          options={{ presentation: 'modal', title: 'Log Growth' }}
        />
        <Stack.Screen
          name="events/meds"
          options={{ presentation: 'modal', title: 'Log Meds' }}
        />
        <Stack.Screen
          name="events/activity"
          options={{ presentation: 'modal', title: 'Log Activity' }}
        />
      </Stack.Protected>

      <Stack.Protected guard={!session}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <Providers>
      <RootLayoutNav />
    </Providers>
  );
}
