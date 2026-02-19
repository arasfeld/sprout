import type { Child } from '@sprout/core';
import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/constants/query-keys';
import { supabase } from '@/services/supabase';

export function useChild(id: string) {
  return useQuery({
    queryKey: queryKeys.children.details(id),
    queryFn: async () => {
      const { data, error: fetchError } = await (
        supabase as unknown as {
          from: (table: string) => {
            select: (cols: string) => {
              eq: (
                col: string,
                val: string,
              ) => {
                single: () => Promise<{
                  data: Child | null;
                  error: { message: string } | null;
                }>;
              };
            };
          };
        }
      )
        .from('children')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      if (!data) {
        throw new Error('Child not found');
      }

      return data;
    },
    enabled: !!id,
  });
}
