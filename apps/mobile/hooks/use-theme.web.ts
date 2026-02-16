import { Colors, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme.web';

export interface Theme {
  mode: 'light' | 'dark';
  colors: typeof Colors.light;
  typography: typeof Typography;
}

export function useTheme(): Theme {
  const mode = useColorScheme() ?? 'light';

  return {
    mode,
    colors: Colors[mode],
    typography: Typography,
  };
}
