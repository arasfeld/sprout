import {
  focusManager,
  MutationCache,
  onlineManager,
  QueryCache,
  QueryClient,
} from '@tanstack/react-query';
import * as Network from 'expo-network';
import { Alert, type AppStateStatus, Platform } from 'react-native';

// Online status management
onlineManager.setEventListener((setOnline) => {
  const eventSubscription = Network.addNetworkStateListener((state) => {
    setOnline(!!state.isConnected);
  });
  return () => {
    eventSubscription.remove();
  };
});

export function onAppStateChange(status: AppStateStatus) {
  if (Platform.OS !== 'web') {
    focusManager.setFocused(status === 'active');
  }
}

// Create a client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
    },
  },
  queryCache: new QueryCache({
    onError: (error, query) => {
      // Only show error for background refetches of stale queries
      if (query.state.data !== undefined) {
        Alert.alert('Refresh Error', `Failed to update data: ${error.message}`);
      }
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      Alert.alert('Update Error', error.message);
    },
  }),
});
