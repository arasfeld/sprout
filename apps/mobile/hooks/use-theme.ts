import { useThemePreferences } from '@/components/theme-context';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useMemo } from 'react';

export interface Theme {
  mode: 'light' | 'dark';
  colors: typeof Colors.light;
  typography: typeof Typography;
  spacing: typeof Spacing;
  radius: typeof Radius;
}

export function useTheme(): Theme {
  const system = useColorScheme() ?? 'light';
  let preferredMode: 'light' | 'dark' | 'system' = 'system';

  try {
    const prefs = useThemePreferences();
    preferredMode = prefs.mode;
  } catch {
    // If provider is not mounted, fall back to system
    preferredMode = 'system';
  }

  const mode: 'light' | 'dark' =
    preferredMode === 'system' ? (system as 'light' | 'dark') : preferredMode;
  const colors = useMemo(() => Colors[mode], [mode]);

  return {
    mode,
    colors,
    typography: Typography,
    spacing: Spacing,
    radius: Radius,
  };
}
