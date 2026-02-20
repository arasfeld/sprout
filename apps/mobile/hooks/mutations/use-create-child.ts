import type { Child, Sex } from '@sprout/core';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/components/auth-context';
import { queryKeys } from '@/constants/query-keys';
import { supabase } from '@/services/supabase';

interface CreateChildParams {
  name: string;
  birthdate: string;
  sex?: Sex | null;
  avatar_url?: string | null;
}

interface MutationContext {
  previousChildren?: Child[];
}

export function useCreateChild() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation<Child, Error, CreateChildParams, MutationContext>({
    mutationFn: async ({
      name,
      birthdate,
      sex,
      avatar_url,
    }: CreateChildParams) => {
      const { data: inserted, error: rpcError } = await supabase.rpc(
        'create_child_for_current_user',
        {
          p_name: name.trim(),
          p_birthdate: birthdate.trim(),
          p_sex: sex ?? undefined,
          p_avatar_url: avatar_url ?? undefined,
        },
      );

      if (rpcError) {
        throw new Error(rpcError.message);
      }

      if (!inserted) {
        throw new Error('Failed to create child.');
      }

      // The RPC returns a Child-like object, ensure it matches our Core Child type
      return inserted as Child;
    },
    onMutate: async (newChild) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: queryKeys.children.list() });

      // Snapshot the previous value
      const previousChildren = queryClient.getQueryData<Child[]>(
        queryKeys.children.list(),
      );

      // Optimistically update to the new value
      if (previousChildren && user?.id) {
        queryClient.setQueryData<Child[]>(queryKeys.children.list(), [
          ...previousChildren,
          {
            id: 'temp-id-' + Date.now(),
            name: newChild.name.trim(),
            birthdate: newChild.birthdate.trim(),
            sex: newChild.sex ?? null,
            avatar_url: newChild.avatar_url ?? null,
            created_by: user.id,
          },
        ]);
      }

      // Return a context object with the snapshotted value
      return { previousChildren };
    },
    onError: (err, newChild, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousChildren) {
        queryClient.setQueryData(
          queryKeys.children.list(),
          context.previousChildren,
        );
      }
    },
    onSettled: () => {
      // Always refetch after error or success to ensure we are in sync with the server
      queryClient.invalidateQueries({ queryKey: queryKeys.children.all });
    },
  });
}
