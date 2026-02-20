export const queryKeys = {
  children: {
    all: ['children'] as const,
    list: () => [...queryKeys.children.all, 'list'] as const,
    details: (id: string) => [...queryKeys.children.all, 'detail', id] as const,
  },
  events: {
    all: ['events'] as const,
    list: (childId: string) =>
      [...queryKeys.events.all, 'list', childId] as const,
    details: (id: string) => [...queryKeys.events.all, 'detail', id] as const,
  },
} as const;
