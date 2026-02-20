import RNDateTimePicker from '@react-native-community/datetimepicker';
import type { ComponentPropsWithoutRef } from 'react';

import { useTheme } from '@/hooks/use-theme';

export function DateTimePicker(
  props: ComponentPropsWithoutRef<typeof RNDateTimePicker>,
) {
  const { colors, mode } = useTheme();

  return (
    <RNDateTimePicker
      accentColor={colors.primary}
      textColor={colors.foreground}
      themeVariant={mode}
      {...props}
    />
  );
}
