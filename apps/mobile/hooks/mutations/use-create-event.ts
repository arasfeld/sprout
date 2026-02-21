import type { Event, EventType, EventVisibility } from '@sprout/core';
import { useMutation } from '@tanstack/react-query';
import * as Crypto from 'expo-crypto';

import { useAuth } from '@/components/auth-context';
import { db } from '@/services/db/client';
import { events as eventsTable } from '@/services/db/schema';
import { syncEngine } from '@/services/sync/engine';

interface CreateEventParams {
  child_id: string;
  type: EventType;
  payload: Record<string, unknown>;
  visibility?: EventVisibility;
  organization_id?: string | null;
}

export function useCreateEvent() {
  const { user } = useAuth();

  return useMutation<Event, Error, CreateEventParams>({
    mutationFn: async ({
      child_id,
      type,
      payload,
      visibility = 'all',
      organization_id = null,
    }) => {
      const id = Crypto.randomUUID();
      const now = new Date().toISOString();

      await db.insert(eventsTable).values({
        id,
        childId: child_id,
        type,
        payload: JSON.stringify(payload),
        visibility,
        organizationId: organization_id,
        createdBy: user?.id ?? null,
        syncStatus: 'pending',
        createdAt: now,
        updatedAt: now,
      });

      const event: Event = {
        id,
        child_id,
        created_by: user?.id ?? '',
        organization_id,
        type,
        payload,
        visibility,
        created_at: now,
      };

      syncEngine.nudge();
      return event;
    },
  });
}
