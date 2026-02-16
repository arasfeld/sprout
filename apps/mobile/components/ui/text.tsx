import { useMemo } from 'react';
import {
  Text as RNText,
  StyleSheet,
  type TextProps as RNTextProps,
} from 'react-native';

import type { Theme } from '@/hooks/use-theme';
import { useTheme } from '@/hooks/use-theme';

type TextVariant =
  | 'title'
  | 'subtitle'
  | 'body'
  | 'bodySemibold'
  | 'muted'
  | 'label';

interface TextProps extends RNTextProps {
  variant?: TextVariant;
  center?: boolean;
}

export function Text({
  variant = 'body',
  center = false,
  style,
  children,
  ...props
}: TextProps) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <RNText
      style={[styles.base, styles[variant], center && styles.center, style]}
      {...props}
    >
      {children}
    </RNText>
  );
}

function createStyles(theme: Theme) {
  const { colors, typography } = theme;
  return StyleSheet.create({
    base: {
      fontFamily: undefined,
    },
    center: {
      textAlign: 'center',
    },
    title: {
      color: colors.foreground,
      fontSize: typography.fontSize.xxxl,
      fontWeight: typography.fontWeight.bold,
      marginBottom: 8,
    },
    subtitle: {
      color: colors.foreground,
      fontSize: typography.fontSize.xl,
      fontWeight: typography.fontWeight.bold,
      marginBottom: 12,
    },
    body: {
      color: colors.foreground,
      fontSize: typography.fontSize.md,
      fontWeight: typography.fontWeight.normal,
      lineHeight: typography.fontSize.md * typography.lineHeight.normal,
    },
    bodySemibold: {
      color: colors.foreground,
      fontSize: typography.fontSize.md,
      fontWeight: typography.fontWeight.semibold,
      lineHeight: typography.fontSize.md * typography.lineHeight.normal,
    },
    muted: {
      color: colors.mutedForeground,
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.normal,
      lineHeight: typography.fontSize.sm * typography.lineHeight.normal,
    },
    label: {
      color: colors.mutedForeground,
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.semibold,
      letterSpacing: 0.5,
      textTransform: 'uppercase',
    },
  });
}
