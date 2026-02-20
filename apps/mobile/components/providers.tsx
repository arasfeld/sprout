import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useMemo } from 'react';
import { ActivityIndicator, AppState, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { AuthProvider, useAuth } from '@/components/auth-context';
import { ChildProvider } from '@/components/child-context';
import { ThemeProvider as AppThemeProvider } from '@/components/theme-context';
import { useTheme } from '@/hooks/use-theme';
import { onAppStateChange, queryClient } from '@/services/query-client';

function NavigationThemeWrapper({ children }: { children: React.ReactNode }) {
  const { mode, colors, typography } = useTheme();

  useEffect(() => {
    const subscription = AppState.addEventListener('change', onAppStateChange);
    return () => subscription.remove();
  }, []);

  const navigationTheme = useMemo(
    () => ({
      dark: mode === 'dark',
      fonts: {
        regular: {
          fontFamily: typography.fonts.sans,
          fontWeight: typography.fontWeight.normal,
        },
        medium: {
          fontFamily: typography.fonts.sans,
          fontWeight: typography.fontWeight.medium,
        },
        bold: {
          fontFamily: typography.fonts.sans,
          fontWeight: typography.fontWeight.bold,
        },
        heavy: {
          fontFamily: typography.fonts.sans,
          fontWeight: '900' as const,
        },
      },
      colors: {
        primary: colors.primary,
        background: colors.background,
        card: colors.card,
        text: colors.foreground,
        border: colors.border,
        notification: colors.destructive,
      },
    }),
    [mode, colors, typography],
  );

  return (
    <NavigationThemeProvider value={navigationTheme}>
      {children}
      <StatusBar animated style={mode === 'dark' ? 'light' : 'dark'} />
    </NavigationThemeProvider>
  );
}

function AuthLoadingGate({ children }: { children: React.ReactNode }) {
  const { isLoading } = useAuth();
  const { colors } = useTheme();

  if (isLoading) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AppThemeProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <BottomSheetModalProvider>
            <AuthProvider>
              <AuthLoadingGate>
                <ChildProvider>
                  <NavigationThemeWrapper>{children}</NavigationThemeWrapper>
                </ChildProvider>
              </AuthLoadingGate>
            </AuthProvider>
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </AppThemeProvider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
