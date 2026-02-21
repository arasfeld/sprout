import type { SupabaseClient } from '@supabase/supabase-js';

import type { RemoteChild } from '@sprout/core';
import type { Database } from './database.types';

/** Remote Supabase event record (snake_case fields). */
export interface RemoteEvent {
  id: string;
  child_id: string;
  type: string;
  payload: Record<string, unknown>;
  visibility: string;
  organization_id: string | null;
  created_by: string;
  created_at: string;
}

/**
 * Fetches children updated since the given timestamp.
 * Returns all children if `since` is null.
 */
export async function pullChildren(
  since: string | null,
  client: SupabaseClient<Database>,
): Promise<RemoteChild[]> {
  let query = client
    .from('children')
    .select(
      'id, name, birthdate, sex, avatar_url, created_by, created_at, updated_at',
    );

  if (since) {
    query = query.gt('updated_at', since);
  }

  const { data, error } = await query;

  if (error) {
    console.error('[sync] pull children error:', error.message);
    return [];
  }

  return (data ?? []) as RemoteChild[];
}

/**
 * Fetches events created since the given timestamp.
 * Returns all events if `since` is null.
 */
export async function pullEvents(
  since: string | null,
  client: SupabaseClient<Database>,
): Promise<RemoteEvent[]> {
  let query = client
    .from('events')
    .select(
      'id, child_id, type, payload, visibility, organization_id, created_by, created_at',
    );

  if (since) {
    query = query.gt('created_at', since);
  }

  const { data, error } = await query;

  if (error) {
    console.error('[sync] pull events error:', error.message);
    return [];
  }

  return (data ?? []) as unknown as RemoteEvent[];
}
