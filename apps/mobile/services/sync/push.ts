import { eq } from 'drizzle-orm';

import { db } from '@/services/db/client';
import { children, events } from '@/services/db/schema';
import { supabase } from '@/services/supabase';

/**
 * Push all locally-pending children to Supabase using the sync_child RPC,
 * which handles upsert + membership creation atomically.
 */
async function pushChildren(): Promise<void> {
  const pending = await db
    .select()
    .from(children)
    .where(eq(children.syncStatus, 'pending'));

  for (const child of pending) {
    const { error } = await supabase.rpc('sync_child', {
      p_id: child.id,
      p_name: child.name,
      p_birthdate: child.birthdate,
      p_sex: child.sex ?? undefined,
      p_avatar_url: child.avatarUrl ?? undefined,
      p_created_at: child.createdAt,
      p_updated_at: child.updatedAt,
    });

    if (error) {
      await db
        .update(children)
        .set({ syncStatus: 'error' })
        .where(eq(children.id, child.id));
      console.error(`[sync] failed to push child ${child.id}:`, error.message);
      continue;
    }

    await db
      .update(children)
      .set({ syncStatus: 'synced' })
      .where(eq(children.id, child.id));
  }
}

/**
 * Push all locally-pending events to Supabase.
 * Events are append-only — ON CONFLICT DO NOTHING handles duplicates.
 */
async function pushEvents(): Promise<void> {
  const pending = await db
    .select()
    .from(events)
    .where(eq(events.syncStatus, 'pending'));

  for (const event of pending) {
    const { error } = await supabase.from('events').upsert(
      {
        id: event.id,
        child_id: event.childId,
        type: event.type as any,
        payload: JSON.parse(event.payload),
        visibility: event.visibility as any,
        organization_id: event.organizationId ?? null,
        created_by: event.createdBy ?? '',
        created_at: event.createdAt,
      },
      { onConflict: 'id', ignoreDuplicates: true },
    );

    if (error) {
      await db
        .update(events)
        .set({ syncStatus: 'error' })
        .where(eq(events.id, event.id));
      console.error(`[sync] failed to push event ${event.id}:`, error.message);
      continue;
    }

    await db
      .update(events)
      .set({ syncStatus: 'synced' })
      .where(eq(events.id, event.id));
  }
}

export async function push(): Promise<void> {
  // Children must be pushed before events (events reference children).
  await pushChildren();
  await pushEvents();
}
