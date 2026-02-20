import { Stack } from 'expo-router';
import React, { useEffect } from 'react';
import { AppState } from 'react-native';
import 'react-native-reanimated';

import { Providers } from '@/components/providers';
import { onAppStateChange } from '@/services/query-client';

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function RootLayout() {
  useEffect(() => {
    const subscription = AppState.addEventListener('change', onAppStateChange);
    return () => subscription.remove();
  }, []);

  return (
    <Providers>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen
          name="add-child"
          options={{
            title: 'Add child',
            headerBackTitle: 'Cancel',
          }}
        />
        <Stack.Screen
          name="events/feed"
          options={{
            title: 'Log Feed',
          }}
        />
        <Stack.Screen
          name="events/sleep"
          options={{
            title: 'Log Sleep',
          }}
        />
        <Stack.Screen
          name="events/diaper"
          options={{
            title: 'Log Diaper',
          }}
        />
        <Stack.Screen
          name="events/growth"
          options={{
            title: 'Log Growth',
          }}
        />
        <Stack.Screen
          name="events/meds"
          options={{
            title: 'Log Meds',
          }}
        />
        <Stack.Screen
          name="events/activity"
          options={{
            title: 'Log Activity',
          }}
        />
      </Stack>
    </Providers>
  );
}
