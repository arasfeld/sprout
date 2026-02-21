import type { Event } from '@sprout/core';
import { and, desc, eq, isNull } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';

import { db } from '@/services/db/client';
import { events as eventsTable } from '@/services/db/schema';

function rowToEvent(row: typeof eventsTable.$inferSelect): Event {
  return {
    id: row.id,
    child_id: row.childId,
    created_by: row.createdBy ?? '',
    organization_id: row.organizationId ?? null,
    type: row.type,
    payload: JSON.parse(row.payload),
    visibility: row.visibility,
    created_at: row.createdAt,
  };
}

export function useEvents(childId: string | null) {
  const { data, error } = useLiveQuery(
    db
      .select()
      .from(eventsTable)
      .where(
        childId
          ? and(eq(eventsTable.childId, childId), isNull(eventsTable.deletedAt))
          : isNull(eventsTable.deletedAt),
      )
      .orderBy(desc(eventsTable.createdAt)),
    [childId],
  );

  return {
    data: childId ? (data ?? []).map(rowToEvent) : [],
    isLoading: data === undefined && !!childId,
    error,
  };
}
