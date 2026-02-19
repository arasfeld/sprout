import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme.web';
import { useMemo } from 'react';

export interface Theme {
  mode: 'light' | 'dark';
  colors: typeof Colors.light;
  typography: typeof Typography;
  spacing: typeof Spacing;
  radius: typeof Radius;
}

export function useTheme(): Theme {
  const mode = useColorScheme() ?? 'light';
  const colors = useMemo(() => Colors[mode], [mode]);

  return {
    mode,
    colors,
    typography: Typography,
    spacing: Spacing,
    radius: Radius,
  };
}
