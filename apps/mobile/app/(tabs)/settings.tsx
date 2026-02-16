import React, { useCallback, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useThemePreferences } from '@/components/theme-context';
import { SegmentedControl } from '@/components/ui/segmented-control';

export default function SettingsScreen() {
  const { mode, setMode, isLoading } = useThemePreferences();

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

  return (
    <SafeAreaView style={styles.container}>
      <SegmentedControl
        title="Theme"
        subtitle="Choose your preferred appearance"
        options={options}
        selectedIndex={themeOptions.indexOf(mode)}
        onValueChange={handleChange}
        disabled={isLoading}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
