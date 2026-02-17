import { type Href, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { useAuth } from '@/components/auth-context';
import { useTheme } from '@/hooks/use-theme';

const AUTH_SIGN_IN_HREF = '/(auth)/sign-in' as Href;

export default function IndexScreen() {
  const { session, isLoading } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (session) {
      router.replace('/(tabs)');
    } else {
      router.replace(AUTH_SIGN_IN_HREF);
    }
  }, [isLoading, session, router]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
