import { eq } from 'drizzle-orm';

import { db } from '@/services/db/client';
import { children, events, syncMeta } from '@/services/db/schema';
import { supabase } from '@/services/supabase';
import { resolve } from './resolver';

const LAST_SYNC_CHILDREN_KEY = 'last_sync_at_children';
const LAST_SYNC_EVENTS_KEY = 'last_sync_at_events';

async function getLastSync(key: string): Promise<string | null> {
  const rows = await db
    .select()
    .from(syncMeta)
    .where(eq(syncMeta.key, key));
  return rows[0]?.value ?? null;
}

async function setLastSync(key: string, value: string): Promise<void> {
  await db
    .insert(syncMeta)
    .values({ key, value })
    .onConflictDoUpdate({ target: syncMeta.key, set: { value } });
}

async function pullChildren(since: string | null): Promise<void> {
  let query = supabase
    .from('children')
    .select('id, name, birthdate, sex, avatar_url, created_by, created_at, updated_at');

  if (since) {
    query = query.gt('updated_at', since);
  }

  const { data, error } = await query;

  if (error) {
    console.error('[sync] pull children error:', error.message);
    return;
  }

  for (const remote of data ?? []) {
    const localRows = await db
      .select()
      .from(children)
      .where(eq(children.id, remote.id));

    const resolved = resolve(localRows[0] ?? null, remote);

    await db
      .insert(children)
      .values({
        id: resolved.id,
        name: resolved.name,
        birthdate: resolved.birthdate,
        sex: (resolved.sex as 'male' | 'female' | null) ?? null,
        avatarUrl: resolved.avatar_url ?? null,
        createdBy: resolved.created_by,
        syncStatus: 'synced',
        createdAt: resolved.created_at,
        updatedAt: resolved.updated_at,
      })
      .onConflictDoUpdate({
        target: children.id,
        set: {
          name: resolved.name,
          birthdate: resolved.birthdate,
          sex: (resolved.sex as 'male' | 'female' | null) ?? null,
          avatarUrl: resolved.avatar_url ?? null,
          syncStatus: 'synced',
          updatedAt: resolved.updated_at,
        },
      });
  }
}

async function pullEvents(since: string | null): Promise<void> {
  let query = supabase
    .from('events')
    .select('id, child_id, type, payload, visibility, organization_id, created_by, created_at');

  if (since) {
    query = query.gt('created_at', since);
  }

  const { data, error } = await query;

  if (error) {
    console.error('[sync] pull events error:', error.message);
    return;
  }

  for (const remote of data ?? []) {
    await db
      .insert(events)
      .values({
        id: remote.id,
        childId: remote.child_id,
        type: remote.type,
        payload: JSON.stringify(remote.payload),
        visibility: remote.visibility,
        organizationId: remote.organization_id ?? null,
        createdBy: remote.created_by,
        syncStatus: 'synced',
        createdAt: remote.created_at,
        updatedAt: remote.created_at, // events are immutable — updated_at = created_at
      })
      .onConflictDoNothing();
  }
}

export async function pull(): Promise<void> {
  const [sinceChildren, sinceEvents] = await Promise.all([
    getLastSync(LAST_SYNC_CHILDREN_KEY),
    getLastSync(LAST_SYNC_EVENTS_KEY),
  ]);

  const now = new Date().toISOString();

  await pullChildren(sinceChildren);
  await pullEvents(sinceEvents);

  await Promise.all([
    setLastSync(LAST_SYNC_CHILDREN_KEY, now),
    setLastSync(LAST_SYNC_EVENTS_KEY, now),
  ]);
}
