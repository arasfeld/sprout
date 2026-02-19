import type { Child } from '@sprout/core';
import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/constants/query-keys';
import { supabase } from '@/services/supabase';

export function useChildren() {
  return useQuery({
    queryKey: queryKeys.children.list(),
    queryFn: async () => {
      // RLS on `child_memberships` table automatically filters to the current user.
      const { data: memberships, error: fetchError } = await supabase
        .from('child_memberships')
        .select('children(*)');

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      return (memberships ?? [])
        .map((membership) => membership.children)
        .filter((child): child is Child => child !== null);
    },
  });
}
