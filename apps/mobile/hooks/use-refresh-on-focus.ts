import { useFocusEffect } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';

/**
 * Custom hook to refetch all active stale queries when the screen is focused again.
 *
 * Skip the first time because useFocusEffect calls our callback on mount
 * in addition to screen focus.
 */
export function useRefreshOnFocus() {
  const queryClient = useQueryClient();
  const firstTimeRef = React.useRef(true);

  useFocusEffect(
    React.useCallback(() => {
      if (firstTimeRef.current) {
        firstTimeRef.current = false;
        return;
      }

      // refetch all stale active queries
      queryClient.refetchQueries({
        stale: true,
        type: 'active',
      });
    }, [queryClient]),
  );
}
