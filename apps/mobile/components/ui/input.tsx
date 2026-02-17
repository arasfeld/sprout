import React from 'react';
import {
  StyleSheet,
  TextInput,
  type TextInputProps,
  type ViewStyle,
  View,
} from 'react-native';

import { useTheme } from '@/hooks/use-theme';

export interface InputProps extends Omit<TextInputProps, 'style'> {
  containerStyle?: ViewStyle;
}

export function Input({
  containerStyle,
  secureTextEntry,
  ...rest
}: InputProps) {
  const { colors, typography } = useTheme();

  return (
    <View style={[styles.wrapper, containerStyle]}>
      <TextInput
        placeholderTextColor={colors.mutedForeground}
        style={[
          styles.input,
          {
            backgroundColor: colors.input,
            borderColor: colors.border,
            color: colors.foreground,
            fontSize: typography.fontSize.md,
          },
        ]}
        secureTextEntry={secureTextEntry}
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
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 12,
    minHeight: 44,
  },
});
