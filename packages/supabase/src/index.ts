export { createSupabaseClient } from './client';
export type { Database } from './client';

// Re-export commonly used Supabase types and utilities
export type {
  AuthError,
  AuthResponse,
  RealtimeChannel,
  RealtimePostgresChangesPayload,
  Session,
  SupabaseClient,
  User,
} from '@supabase/supabase-js';
