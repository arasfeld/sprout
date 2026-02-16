import { StorageService } from '@/services/storage';
import type { UserPreferences } from '@/types/preferences';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

type ThemeMode = UserPreferences['theme'];

interface ThemeContextValue {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => Promise<void>;
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>('system');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const prefs = await StorageService.getPreferences();
        if (mounted) {
          setModeState(prefs.theme);
        }
      } catch {
        // ignore and keep default
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const setMode = useCallback(async (mode: ThemeMode) => {
    setIsLoading(true);
    try {
      await StorageService.savePreferences({ theme: mode });
      setModeState(mode);
    } catch (error) {
      console.error('Failed to save theme preference', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({ mode, setMode, isLoading }),
    [mode, setMode, isLoading],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useThemePreferences() {
  const ctx = useContext(ThemeContext);
  if (!ctx)
    throw new Error('useThemePreferences must be used within ThemeProvider');
  return ctx;
}
