import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import { syncEngine, type SyncStatus } from '@/services/sync/engine';

interface SyncContextValue {
  status: SyncStatus;
  sync: () => void;
}

const SyncContext = createContext<SyncContextValue | null>(null);

export function SyncProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<SyncStatus>(syncEngine.status);

  useEffect(() => {
    return syncEngine.subscribe(setStatus);
  }, []);

  const sync = useCallback(() => {
    syncEngine.nudge();
  }, []);

  return (
    <SyncContext.Provider value={{ status, sync }}>
      {children}
    </SyncContext.Provider>
  );
}

export function useSync(): SyncContextValue {
  const ctx = useContext(SyncContext);
  if (!ctx) {
    throw new Error('useSync must be used within a SyncProvider');
  }
  return ctx;
}
