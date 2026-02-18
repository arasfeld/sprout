/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

export const Colors = {
  light: {
    accent: '#f5f5f5',
    accentForeground: '#171717',
    background: '#ffffff',
    black: '#000000',
    border: '#e5e5e5',
    card: '#ffffff',
    cardForeground: '#0a0a0a',
    destructive: '#e7000b',
    destructiveForeground: '#ffffff',
    foreground: '#0a0e1a',
    info: '#3b82f6',
    infoForeground: '#ffffff',
    input: '#e5e5e5',
    muted: '#f5f5f5',
    mutedForeground: '#737373',
    primary: '#171717',
    primaryForeground: '#fafafa',
    ring: '#a1a1a1',
    secondary: '#f5f5f5',
    secondaryForeground: '#171717',
    success: '#1ed31d',
    successForeground: '#ffffff',
    warning: '#d39f23',
    warningForeground: '#ffffff',
    white: '#ffffff',
  },
  dark: {
    accent: '#262626',
    accentForeground: '#fafafa',
    background: '#0a0a0a',
    black: '#000000',
    border: '#ffffff1a',
    card: '#171717',
    cardForeground: '#fafafa',
    destructive: '#ff6467',
    destructiveForeground: '#ffffff',
    foreground: '#fafafa',
    info: '#8ea7ec',
    infoForeground: '#ffffff',
    input: '#ffffff26',
    muted: '#262626',
    mutedForeground: '#a1a1a1',
    primary: '#e5e5e5',
    primaryForeground: '#171717',
    ring: '#737373',
    secondary: '#262626',
    secondaryForeground: '#fafafa',
    success: '#79ec7d',
    successForeground: '#ffffff',
    warning: '#e9cc8a',
    warningForeground: '#ffffff',
    white: '#ffffff',
  },
};

export const Fonts = Platform.select({
  default: {
    mono: 'monospace',
    rounded: 'normal',
    sans: 'normal',
    serif: 'serif',
  },
  ios: {
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
  },
  web: {
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
  },
});

export const FontSizes = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 20,
  xxxl: 28,
};

export const FontWeights = {
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: 'bold' as const,
};

export const LetterSpacings = {
  tight: -0.5,
  normal: 0,
};

export const LineHeights = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
  none: 1,
};

export const Radius = {
  sm: 4,
  md: 6,
  lg: 8,
  xl: 12,
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
};

export const Typography = {
  fonts: Fonts,
  fontSize: FontSizes,
  fontWeight: FontWeights,
  letterSpacing: LetterSpacings,
  lineHeight: LineHeights,
};
