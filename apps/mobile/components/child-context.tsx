import type { Child } from '@sprout/core';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { useChildren } from '@/hooks/queries/use-children';
import { StorageService } from '@/services/storage';

interface ChildContextValue {
  selectedChildId: string | null;
  selectedChild: Child | null;
  setChildId: (id: string | null) => Promise<void>;
  isLoading: boolean;
}

const ChildContext = createContext<ChildContextValue | undefined>(undefined);

export function ChildProvider({ children }: { children: React.ReactNode }) {
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const { data: childrenList = [], isLoading: isChildrenLoading } =
    useChildren();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const prefs = await StorageService.getPreferences();
        if (mounted) {
          setSelectedChildId(prefs.selectedChildId ?? null);
        }
      } catch {
        // ignore and keep default
      } finally {
        if (mounted) setIsInitializing(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // Auto-select first child if none selected
  useEffect(() => {
    if (!isInitializing && !selectedChildId && childrenList.length > 0) {
      const firstChild = childrenList[0];
      if (firstChild) {
        setSelectedChildId(firstChild.id);
        StorageService.savePreferences({ selectedChildId: firstChild.id });
      }
    }
  }, [isInitializing, selectedChildId, childrenList]);

  const setChildId = useCallback(async (id: string | null) => {
    try {
      await StorageService.savePreferences({ selectedChildId: id });
      setSelectedChildId(id);
    } catch (error) {
      console.error('Failed to save child preference', error);
    }
  }, []);

  const selectedChild = useMemo(() => {
    if (!selectedChildId) return null;
    return childrenList.find((c) => c.id === selectedChildId) ?? null;
  }, [selectedChildId, childrenList]);

  const value = useMemo(
    () => ({
      selectedChildId,
      selectedChild,
      setChildId,
      isLoading: isInitializing || isChildrenLoading,
    }),
    [
      selectedChildId,
      selectedChild,
      setChildId,
      isInitializing,
      isChildrenLoading,
    ],
  );

  return (
    <ChildContext.Provider value={value}>{children}</ChildContext.Provider>
  );
}

export function useChildSelection() {
  const ctx = useContext(ChildContext);
  if (!ctx) {
    throw new Error('useChildSelection must be used within ChildProvider');
  }
  return ctx;
}
