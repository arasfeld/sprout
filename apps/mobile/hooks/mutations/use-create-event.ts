import type { Event, EventType, EventVisibility } from '@sprout/core';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/components/auth-context';
import { queryKeys } from '@/constants/query-keys';
import { supabase } from '@/services/supabase';

interface CreateEventParams {
  child_id: string;
  type: EventType;
  payload: Record<string, any>;
  visibility?: EventVisibility;
  organization_id?: string | null;
}

export function useCreateEvent() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation<Event, Error, CreateEventParams>({
    mutationFn: async ({
      child_id,
      type,
      payload,
      visibility = 'all',
      organization_id = null,
    }: CreateEventParams) => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('events')
        .insert({
          child_id,
          type: type as any,
          payload,
          visibility,
          organization_id,
          created_by: user.id,
        })
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data as Event;
    },
    onSettled: (data) => {
      if (data) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.events.list(data.child_id),
        });
      }
    },
  });
}
