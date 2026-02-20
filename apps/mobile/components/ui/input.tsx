import React, { useCallback, useMemo, useState } from 'react';
import {
  Platform,
  StyleSheet,
  TextInput,
  View,
  type TextInputProps,
  type TextStyle,
  type ViewStyle,
} from 'react-native';

import { useTheme } from '@/hooks/use-theme';

export interface InputProps extends Omit<TextInputProps, 'style'> {
  containerStyle?: ViewStyle;
  style?: TextStyle;
  /** When true, shows destructive border styling */
  invalid?: boolean;
}

/** Line height multiplier for input text so descenders aren't clipped (iOS). */
const INPUT_LINE_HEIGHT_MULTIPLIER = 1.35;

export function Input({
  containerStyle,
  style,
  invalid = false,
  secureTextEntry,
  editable = true,
  onFocus,
  onBlur,
  ...rest
}: InputProps) {
  const theme = useTheme();
  const { colors, typography, radius } = theme;
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = useCallback(
    (e: Parameters<NonNullable<TextInputProps['onFocus']>>[0]) => {
      setIsFocused(true);
      onFocus?.(e);
    },
    [onFocus],
  );

  const handleBlur = useCallback(
    (e: Parameters<NonNullable<TextInputProps['onBlur']>>[0]) => {
      setIsFocused(false);
      onBlur?.(e);
    },
    [onBlur],
  );

  const fontSize = typography.fontSize.md;
  const lineHeight = Math.ceil(fontSize * INPUT_LINE_HEIGHT_MULTIPLIER);
  const minHeight = Math.max(48, lineHeight + 2 * 12);
  const paddingVertical = Math.max(0, Math.floor((minHeight - lineHeight) / 2));

  const borderColor = invalid
    ? colors.destructive
    : isFocused
      ? colors.ring
      : colors.border;

  const inputStyle = useMemo((): TextStyle[] => {
    const base: TextStyle[] = [
      styles.input,
      {
        backgroundColor:
          theme.mode === 'dark' ? `${colors.input}4D` : colors.input,
        borderColor,
        borderRadius: radius.md,
        color: colors.foreground,
        fontSize,
        lineHeight,
        minHeight,
        paddingVertical,
      },
    ];
    if (!editable) {
      base.push({
        backgroundColor:
          theme.mode === 'dark' ? `${colors.input}CC` : `${colors.input}80`,
        opacity: 0.5,
      });
    }
    if (style) {
      base.push(style);
    }
    return base;
  }, [
    theme.mode,
    colors.input,
    colors.foreground,
    borderColor,
    radius.md,
    fontSize,
    lineHeight,
    minHeight,
    paddingVertical,
    editable,
    style,
  ]);

  return (
    <View style={[styles.wrapper, { minHeight }, containerStyle]}>
      <TextInput
        editable={editable}
        placeholderTextColor={colors.mutedForeground}
        style={inputStyle}
        secureTextEntry={secureTextEntry}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...(Platform.OS === 'android' && { includeFontPadding: false })}
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  input: {
    borderWidth: 2,
    paddingHorizontal: 12,
    minWidth: 0,
  },
});
