import type { Child, Sex } from '@sprout/core';
import { useMutation } from '@tanstack/react-query';
import * as Crypto from 'expo-crypto';

import { useAuth } from '@/components/auth-context';
import { db } from '@/services/db/client';
import { children as childrenTable } from '@/services/db/schema';
import { syncEngine } from '@/services/sync/engine';

interface CreateChildParams {
  name: string;
  birthdate: string;
  sex?: Sex | null;
  avatar_url?: string | null;
}

export function useCreateChild() {
  const { user } = useAuth();

  return useMutation<Child, Error, CreateChildParams>({
    mutationFn: async ({ name, birthdate, sex, avatar_url }) => {
      const id = Crypto.randomUUID();
      const now = new Date().toISOString();

      await db.insert(childrenTable).values({
        id,
        name: name.trim(),
        birthdate: birthdate.trim(),
        sex: sex ?? null,
        avatarUrl: avatar_url ?? null,
        createdBy: user?.id ?? null,
        syncStatus: 'pending',
        createdAt: now,
        updatedAt: now,
      });

      const child: Child = {
        id,
        name: name.trim(),
        birthdate: birthdate.trim(),
        sex: sex ?? null,
        avatar_url: avatar_url ?? null,
        created_by: user?.id ?? '',
      };

      syncEngine.nudge();
      return child;
    },
  });
}
