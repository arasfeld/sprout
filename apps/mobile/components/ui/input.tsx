import React, { useCallback, useMemo, useState } from 'react';
import {
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
  /** When true, shows destructive border styling */
  invalid?: boolean;
}

export function Input({
  containerStyle,
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

  const inputStyle = useMemo((): TextStyle[] => {
    const base: TextStyle[] = [
      styles.input,
      {
        backgroundColor:
          theme.mode === 'dark' ? `${colors.input}4D` : colors.input,
        borderColor: colors.border,
        borderRadius: radius.md,
        color: colors.foreground,
        fontSize: typography.fontSize.md,
      },
    ];
    if (invalid) {
      base.push({ borderColor: colors.destructive, borderWidth: 2 });
    } else if (isFocused) {
      base.push({ borderColor: colors.ring, borderWidth: 2 });
    }
    if (!editable) {
      base.push({
        backgroundColor:
          theme.mode === 'dark' ? `${colors.input}CC` : `${colors.input}80`,
        opacity: 0.5,
      });
    }
    return base;
  }, [
    theme.mode,
    colors.input,
    colors.border,
    colors.foreground,
    colors.destructive,
    colors.ring,
    radius.md,
    typography.fontSize.md,
    invalid,
    isFocused,
    editable,
  ]);

  return (
    <View style={[styles.wrapper, containerStyle]}>
      <TextInput
        editable={editable}
        placeholderTextColor={colors.mutedForeground}
        style={inputStyle}
        secureTextEntry={secureTextEntry}
        onFocus={handleFocus}
        onBlur={handleBlur}
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
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    minHeight: 44,
    minWidth: 0,
  },
});
