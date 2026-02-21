import type { Child } from '@sprout/core';
import { isNull } from 'drizzle-orm';
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

export function useChildren() {
  const { data, error } = useLiveQuery(
    db.select().from(childrenTable).where(isNull(childrenTable.deletedAt)),
  );

  return {
    data: (data ?? []).map(rowToChild),
    isLoading: data === undefined,
    error,
  };
}
