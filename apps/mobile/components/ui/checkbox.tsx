import { Ionicons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { Pressable, StyleSheet, type ViewStyle } from 'react-native';

import type { Theme } from '@/hooks/use-theme';
import { useTheme } from '@/hooks/use-theme';

export type CheckboxSize = 'sm' | 'md' | 'lg';

const CHECKBOX_SIZES: Record<CheckboxSize, { box: number; icon: number }> = {
  sm: { box: 16, icon: 14 },
  md: { box: 20, icon: 18 },
  lg: { box: 24, icon: 22 },
};

/** Minimum touch target size for accessibility (pt). */
const MIN_TOUCH_TARGET = 44;

export interface CheckboxProps {
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  size?: CheckboxSize;
  style?: ViewStyle;
  /** When true, shows invalid/destructive border and ring styling */
  invalid?: boolean;
}

export function Checkbox({
  checked: controlledChecked,
  defaultChecked = false,
  disabled = false,
  invalid = false,
  onCheckedChange,
  size = 'md',
  style,
}: CheckboxProps) {
  const [uncontrolledChecked, setUncontrolledChecked] =
    React.useState(defaultChecked);
  const isControlled = controlledChecked !== undefined;
  const checked = isControlled ? controlledChecked : uncontrolledChecked;

  const theme = useTheme();
  const dimensions = CHECKBOX_SIZES[size];
  const styles = useMemo(
    () => createStyles(theme, CHECKBOX_SIZES[size]),
    [theme, size],
  );

  const handlePress = () => {
    if (disabled) return;
    const next = !checked;
    if (!isControlled) setUncontrolledChecked(next);
    onCheckedChange?.(next);
  };

  return (
    <Pressable
      disabled={disabled}
      onPress={handlePress}
      style={({ pressed }) => [
        styles.root,
        checked && styles.checked,
        invalid && !checked && styles.invalid,
        disabled && styles.disabled,
        pressed && styles.pressed,
        style,
      ]}
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled }}
      accessibilityLabel="Checkbox"
    >
      {checked ? (
        <Ionicons
          color={theme.colors.primaryForeground}
          name="checkmark"
          size={dimensions.icon}
        />
      ) : null}
    </Pressable>
  );
}

function createStyles(theme: Theme, dimensions: { box: number; icon: number }) {
  const { colors, mode } = theme;
  const { box } = dimensions;
  return StyleSheet.create({
    root: {
      alignItems: 'center',
      backgroundColor: mode === 'dark' ? colors.input : 'transparent',
      borderColor: colors.input,
      borderRadius: theme.radius.sm,
      borderWidth: 1,
      height: box,
      justifyContent: 'center',
      width: box,
      minWidth: MIN_TOUCH_TARGET,
      minHeight: MIN_TOUCH_TARGET,
    },
    checked: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    disabled: {
      opacity: 0.5,
    },
    invalid: {
      borderColor: colors.destructive,
    },
    pressed: {
      opacity: 0.9,
    },
  });
}
