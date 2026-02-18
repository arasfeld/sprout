import { type Href, useRouter } from 'expo-router';
import React, { useCallback, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@/components/auth-context';
import { useThemePreferences } from '@/components/theme-context';
import { Button } from '@/components/ui/button';
import { FieldGroup, FieldLegend, FieldSet } from '@/components/ui/field';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { Separator } from '@/components/ui/separator';
import { SupabaseTest } from '@/components/supabase-test';

export default function SettingsScreen() {
  const { mode, setMode, isLoading } = useThemePreferences();
  const { signOut } = useAuth();
  const router = useRouter();

  const themeOptions = useMemo(() => ['light', 'dark', 'system'] as const, []);

  const options = useMemo(
    () =>
      themeOptions.map((t) => ({
        label: t.charAt(0).toUpperCase() + t.slice(1),
        value: t,
      })),
    [themeOptions],
  );

  const handleChange = useCallback(
    async (index: number) => {
      const selectedMode = themeOptions[index];
      if (selectedMode) {
        await setMode(selectedMode);
      } else {
        await setMode('system');
      }
    },
    [setMode, themeOptions],
  );

  const handleSignOut = useCallback(async () => {
    await signOut();
    router.replace('/(auth)/sign-in' as Href);
  }, [signOut, router]);

  return (
    <SafeAreaView style={styles.container}>
      <FieldSet>
        <FieldGroup>
          <FieldLegend>Appearance</FieldLegend>
          <SegmentedControl
            title="Theme"
            subtitle="Choose your preferred appearance"
            options={options}
            selectedIndex={themeOptions.indexOf(mode)}
            onValueChange={handleChange}
            disabled={isLoading}
          />
        </FieldGroup>
        <Separator style={styles.separator} />
        <FieldGroup>
          <FieldLegend>Account</FieldLegend>
          <Button onPress={handleSignOut}>Sign out</Button>
        </FieldGroup>
        <Separator style={styles.separator} />
        <SupabaseTest />
      </FieldSet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  separator: {
    marginVertical: 16,
  },
});
