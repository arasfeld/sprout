import SegmentedControlNative from '@react-native-segmented-control/segmented-control';
import React, { useCallback, useMemo } from 'react';
import { StyleSheet, View, type NativeSyntheticEvent } from 'react-native';

import { Text } from '@/components/ui/text';
import { Theme, useTheme } from '@/hooks/use-theme';

interface SegmentedControlOption {
  label: string;
  value: string;
}

interface SegmentedControlProps {
  options: SegmentedControlOption[];
  selectedIndex: number;
  onValueChange: (index: number) => void;
  title?: string;
  subtitle?: string;
  disabled?: boolean;
}

export function SegmentedControl({
  options,
  selectedIndex,
  onValueChange,
  title,
  subtitle,
  disabled = false,
}: SegmentedControlProps) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const values = useMemo(
    () => options.map((option) => option.label),
    [options],
  );

  const handleChange = useCallback(
    (event: NativeSyntheticEvent<{ selectedSegmentIndex: number }>) => {
      if (!disabled) {
        onValueChange(event.nativeEvent.selectedSegmentIndex);
      }
    },
    [disabled, onValueChange],
  );

  return (
    <View style={styles.container}>
      {title && (
        <View style={styles.header}>
          <Text variant="bodySemibold">{title}</Text>
          {subtitle && <Text variant="muted">{subtitle}</Text>}
        </View>
      )}

      <SegmentedControlNative
        activeFontStyle={{
          color: theme.colors.primaryForeground,
          fontWeight: theme.typography.fontWeight.semibold,
        }}
        appearance={theme.mode}
        backgroundColor={theme.colors.muted}
        fontStyle={{
          color: theme.colors.mutedForeground,
          fontWeight: theme.typography.fontWeight.medium,
        }}
        onChange={handleChange}
        selectedIndex={selectedIndex}
        style={[disabled && { opacity: 0.5 }]}
        tintColor={
          disabled ? theme.colors.mutedForeground : theme.colors.primary
        }
        values={values}
      />
    </View>
  );
}

const createStyles = (_theme: Theme) =>
  StyleSheet.create({
    container: {
      marginVertical: 8,
    },
    header: {
      marginBottom: 12,
    },
    title: {
      marginBottom: 2,
    },
  });
