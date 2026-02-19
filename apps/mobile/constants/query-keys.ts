export const queryKeys = {
  children: {
    all: ['children'] as const,
    list: () => [...queryKeys.children.all, 'list'] as const,
    details: (id: string) => [...queryKeys.children.all, 'detail', id] as const,
  },
} as const;
