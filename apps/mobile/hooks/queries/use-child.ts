import type { Child } from '@sprout/core';
import { eq } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';

import { db } from '@/services/db/client';
import { children as childrenTable } from '@/services/db/schema';

function rowToChild(row: typeof childrenTable.$inferSelect): Child {
  return {
    id: row.id,
    name: row.name,
    birthdate: row.birthdate,
    sex: row.sex ?? null,
    avatar_url: row.avatarUrl ?? null,
    created_by: row.createdBy ?? '',
  };
}

export function useChild(id: string) {
  const { data, error } = useLiveQuery(
    db.select().from(childrenTable).where(eq(childrenTable.id, id)),
    [id],
  );

  const row = data?.[0];

  return {
    data: row ? rowToChild(row) : null,
    isLoading: data === undefined,
    error,
  };
}
