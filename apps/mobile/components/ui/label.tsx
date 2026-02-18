import { useMemo } from 'react';
import {
  StyleSheet,
  Text,
  type StyleProp,
  type TextProps,
  type TextStyle,
} from 'react-native';

import type { Theme } from '@/hooks/use-theme';
import { useTheme } from '@/hooks/use-theme';

export interface LabelProps extends Omit<TextProps, 'style'> {
  disabled?: boolean;
  style?: StyleProp<TextStyle>;
}

export function Label({
  children,
  disabled = false,
  style,
  ...props
}: LabelProps) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <Text
      accessibilityRole="none"
      style={[styles.label, disabled && styles.disabled, style]}
      {...props}
    >
      {children}
    </Text>
  );
}

function createStyles(theme: Theme) {
  const { colors, typography } = theme;
  return StyleSheet.create({
    disabled: {
      opacity: 0.5,
    },
    label: {
      color: colors.foreground,
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.medium,
      lineHeight: typography.fontSize.sm * typography.lineHeight.normal,
    },
  });
}
