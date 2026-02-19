import React, { useMemo } from 'react';
import {
  StyleSheet,
  View,
  type StyleProp,
  type TextProps,
  type TextStyle,
  type ViewStyle,
} from 'react-native';

import type { Theme } from '@/hooks/use-theme';
import { useTheme } from '@/hooks/use-theme';
import { Text } from './text';

/**
 * Card component props
 */
export interface CardProps {
  /** Card content */
  children?: React.ReactNode;
  /** Whether card has padding */
  padded?: boolean;
  /** Whether card is interactive (pressed effects) - Note: React Native Pressable should be used for actual interaction */
  interactive?: boolean;
  /** Custom style override */
  style?: StyleProp<ViewStyle>;
}

/**
 * Card header props
 */
export interface CardHeaderProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

/**
 * Card title props
 */
export interface CardTitleProps extends TextProps {
  children?: React.ReactNode;
  /** Heading level (affects font size) */
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  style?: StyleProp<TextStyle>;
}

/**
 * Card description props
 */
export interface CardDescriptionProps {
  children?: React.ReactNode;
  style?: StyleProp<TextStyle>;
}

/**
 * Card content props
 */
export interface CardContentProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

/**
 * Card footer props
 */
export interface CardFooterProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

/**
 * Card component
 * Container component with optional header, content, and footer sections
 *
 * ```tsx
 * <Card>
 *   <CardHeader>
 *     <CardTitle>Title</CardTitle>
 *     <CardDescription>Description</CardDescription>
 *   </CardHeader>
 *   <CardContent>Content</CardContent>
 *   <CardFooter>Footer</CardFooter>
 * </Card>
 * ```
 */
export function Card({
  children,
  padded = false,
  interactive = false,
  style,
  ...props
}: CardProps) {
  const theme = useTheme();
  const styles = useMemo(() => createCardStyles(theme), [theme]);

  return (
    <View
      style={[
        styles.base,
        padded && styles.padded,
        interactive && styles.interactive, // interactive styling for pressed state should be handled by Pressable parent if needed
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

/**
 * Card header component
 * Typically contains title and description
 */
export function CardHeader({ children, style, ...props }: CardHeaderProps) {
  const theme = useTheme();
  const styles = useMemo(() => createCardHeaderStyles(theme), [theme]);
  return (
    <View style={[styles.base, style]} {...props}>
      {children}
    </View>
  );
}

/**
 * Card title component
 * Heading element for card titles
 */
export function CardTitle({
  children,
  level = 3,
  style,
  ...props
}: CardTitleProps) {
  const theme = useTheme();
  const styles = useMemo(() => createCardTitleStyles(theme), [theme]);

  const levelStyle = useMemo(() => {
    switch (level) {
      case 1:
        return styles.level1;
      case 2:
        return styles.level2;
      case 3:
        return styles.level3;
      case 4:
        return styles.level4;
      case 5:
        return styles.level5;
      case 6:
        return styles.level6;
      default:
        return styles.level3;
    }
  }, [level, styles]);

  return (
    <Text
      variant="bodySemibold"
      style={[styles.base, levelStyle, style]}
      {...props}
    >
      {children}
    </Text>
  );
}

/**
 * Card description component
 * Muted text for card descriptions
 */
export function CardDescription({
  children,
  style,
  ...props
}: CardDescriptionProps) {
  const theme = useTheme();
  const styles = useMemo(() => createCardDescriptionStyles(theme), [theme]);
  return (
    <Text variant="muted" style={[styles.base, style]} {...props}>
      {children}
    </Text>
  );
}

/**
 * Card content component
 * Main content area of the card
 */
export function CardContent({ children, style, ...props }: CardContentProps) {
  const theme = useTheme();
  const styles = useMemo(() => createCardContentStyles(theme), [theme]);
  return (
    <View style={[styles.base, style]} {...props}>
      {children}
    </View>
  );
}

/**
 * Card footer component
 * Footer area of the card
 */
export function CardFooter({ children, style, ...props }: CardFooterProps) {
  const theme = useTheme();
  const styles = useMemo(() => createCardFooterStyles(theme), [theme]);
  return (
    <View style={[styles.base, style]} {...props}>
      {children}
    </View>
  );
}

function createCardStyles(theme: Theme) {
  return StyleSheet.create({
    base: {
      borderRadius: theme.radius.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.background,
      flexShrink: 1,
      minHeight: 0,
    },
    padded: {
      padding: theme.spacing.lg,
    },
    interactive: {
      // For interactive effects, consider using Pressable component or gesture handlers
      // with animated styles. For now, this is a placeholder.
    },
  });
}

function createCardHeaderStyles(theme: Theme) {
  return StyleSheet.create({
    base: {
      flexDirection: 'column',
      gap: theme.spacing.sm, // space-y-1.5
      padding: theme.spacing.lg,
    },
  });
}

function createCardTitleStyles(theme: Theme) {
  const { typography } = theme;
  return StyleSheet.create({
    base: {
      letterSpacing: typography.letterSpacing.tight,
      color: theme.colors.foreground,
    },
    level1: {
      fontSize: typography.fontSize.xxxl,
      fontWeight: typography.fontWeight.bold,
    }, // text-4xl font-bold
    level2: {
      fontSize: typography.fontSize.xxl,
      fontWeight: typography.fontWeight.bold,
    }, // text-3xl font-bold
    level3: {
      fontSize: typography.fontSize.xl,
      fontWeight: typography.fontWeight.semibold,
    }, // text-2xl font-semibold
    level4: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.semibold,
    }, // text-xl font-semibold
    level5: {
      fontSize: typography.fontSize.md,
      fontWeight: typography.fontWeight.semibold,
    }, // text-lg font-semibold
    level6: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.semibold,
    }, // text-base font-semibold
  });
}

function createCardDescriptionStyles(theme: Theme) {
  return StyleSheet.create({
    base: {
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.mutedForeground,
    },
  });
}

function createCardContentStyles(theme: Theme) {
  return StyleSheet.create({
    base: {
      paddingHorizontal: theme.spacing.lg,
      paddingTop: 0,
      paddingBottom: theme.spacing.lg,
      flexShrink: 1,
      minHeight: 0,
    },
  });
}

function createCardFooterStyles(theme: Theme) {
  return StyleSheet.create({
    base: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.lg,
      paddingTop: 0,
      paddingBottom: theme.spacing.lg,
    },
  });
}
