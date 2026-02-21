import { pull } from './pull';
import { push } from './push';

export type SyncStatus = 'idle' | 'syncing' | 'error';

type StatusListener = (status: SyncStatus) => void;

class SyncEngine {
  private _status: SyncStatus = 'idle';
  private _listeners: Set<StatusListener> = new Set();
  private _nudgeTimer: ReturnType<typeof setTimeout> | null = null;
  private _isAuthenticated = false;

  get status(): SyncStatus {
    return this._status;
  }

  setAuthenticated(authenticated: boolean): void {
    this._isAuthenticated = authenticated;
    if (authenticated) {
      // Run immediately on sign-in.
      this.run();
    }
  }

  /**
   * Queue a sync run, debounced so rapid mutations only trigger one sync.
   */
  nudge(): void {
    if (!this._isAuthenticated) return;
    if (this._nudgeTimer) clearTimeout(this._nudgeTimer);
    this._nudgeTimer = setTimeout(() => {
      this._nudgeTimer = null;
      this.run();
    }, 500);
  }

  async run(): Promise<void> {
    if (!this._isAuthenticated) return;
    if (this._status === 'syncing') return;

    this._setStatus('syncing');
    try {
      await push();
      await pull();
      this._setStatus('idle');
    } catch (err) {
      console.error('[sync] run failed:', err);
      this._setStatus('error');
    }
  }

  subscribe(listener: StatusListener): () => void {
    this._listeners.add(listener);
    return () => this._listeners.delete(listener);
  }

  private _setStatus(status: SyncStatus): void {
    this._status = status;
    this._listeners.forEach((l) => l(status));
  }
}

export const syncEngine = new SyncEngine();
