import type { Event } from '@sprout/core';
import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/constants/query-keys';
import { supabase } from '@/services/supabase';

export function useEvents(childId: string | null) {
  return useQuery<Event[], Error>({
    enabled: !!childId,
    queryFn: async () => {
      if (!childId) return [];

      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('child_id', childId)
        .order('created_at', { ascending: false });

      if (error) throw new Error(error.message);
      return data as Event[];
    },
    queryKey: queryKeys.events.list(childId || ''),
  });
}
