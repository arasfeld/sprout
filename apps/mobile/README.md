# Sprout Mobile

The React Native mobile app for Sprout, built with Expo SDK 54, React 19, and React Native 0.81.

This is the primary client for the Sprout childcare tracking system. Parents, caregivers, and daycare staff use this app to view and log events on a child's shared timeline.

## Current Status

The app is **offline-first**: all data lives in a local SQLite database and syncs to Supabase in the background. The app loads without requiring sign-in; authentication is optional and activates sync when present. UI is under active development — new screens and flows are being added incrementally.

## Folder Structure

```
apps/mobile/
  app/                  → Expo Router file-based routing
    _layout.tsx         → Root layout (providers, stack)
    (auth)/             → Auth group (sign-in, sign-up)
      _layout.tsx
      sign-in.tsx
      sign-up.tsx
    (tabs)/             → Tab group
      _layout.tsx       → Tab navigator layout
      index.tsx         → Home tab (children list)
      child/[id].tsx    → Child detail (event timeline)
      settings.tsx      → Settings tab
  components/
    ui/                 → Reusable UI primitives (Button, Text, Icon, etc.)
    auth-context.tsx    → Auth state + sign-in/out; activates sync on sign-in
    sync-context.tsx    → Sync engine access via React context
    providers.tsx       → Root provider composition
    theme-context.tsx   → React Context theme provider
  constants/
    theme.ts            → Design tokens (colors, typography, spacing, radius)
  hooks/
    use-theme.ts        → Theme access hook
    use-theme.web.ts    → Web-specific theme hook
    use-color-scheme.ts → System color scheme detection
    mutations/          → useMutation hooks (use-create-child, use-create-event, etc.)
    queries/            → useLiveQuery hooks (use-children, use-child, use-events, etc.)
  services/
    db/
      schema.ts         → Drizzle table definitions (children, events, syncMeta)
      client.ts         → SQLite singleton, initialized at startup
    sync/
      engine.ts         → SyncEngine singleton — call nudge() after mutations
      push.ts           → Pushes pending local records to Supabase
      pull.ts           → Fetches Supabase records, resolves conflicts, writes to SQLite
      resolver.ts       → Re-exports resolveChild() from @sprout/core
    supabase.ts         → Configured Supabase client singleton
  types/                → Domain type definitions
  utils/                → Utility functions
```

## Offline-First Data Architecture

All reads and writes flow through a local SQLite database. Supabase is the sync target, not the read source.

### Data flow

```
UI → useLiveQuery (Drizzle) → SQLite ← Sync Engine ↔ Supabase
```

### Reading data

Use `useLiveQuery` from `drizzle-orm/expo-sqlite`. Queries are reactive — they re-run automatically when the underlying table changes.

```tsx
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { db } from '@/services/db/client';
import { children } from '@/services/db/schema';

function ChildrenList() {
  const { data } = useLiveQuery(db.select().from(children));
  // data is undefined on first render, then an array
}
```

Pre-built query hooks live in `hooks/queries/`:

```tsx
const { data: child } = useChild(id);
const { data: events } = useEvents(childId);
```

### Writing data

Use `useMutation` (TanStack Query) for loading/error state. Write to SQLite with `sync_status: 'pending'`, then call `syncEngine.nudge()`.

```tsx
const mutation = useMutation({
  mutationFn: async (input) => {
    await db.insert(children).values({
      id: crypto.randomUUID(),
      ...input,
      syncStatus: 'pending',
    });
    syncEngine.nudge(); // triggers background sync
  },
});
```

Pre-built mutation hooks live in `hooks/mutations/`.

### Sync

The `SyncEngine` (singleton in `services/sync/engine.ts`) coordinates push and pull. It activates on sign-in and can be nudged after any local write.

- **Push** — uploads records with `sync_status = 'pending'` to Supabase
- **Pull** — fetches remote records updated since `last_sync_at`, resolves conflicts (last-write-wins on `updated_at`), writes to SQLite
- **UUIDs** — generated locally with `crypto.randomUUID()`, same ID used in Supabase

### Local schema fields

Every SQLite table includes:

| Field         | Type                                          | Purpose                  |
| ------------- | --------------------------------------------- | ------------------------ |
| `syncStatus`  | `'local' \| 'pending' \| 'synced' \| 'error'` | Sync lifecycle state     |
| `createdAt`   | `string` (ISO)                                | Record creation time     |
| `updatedAt`   | `string` (ISO)                                | Last local modification  |
| `deletedAt`   | `string \| null` (ISO)                        | Soft delete timestamp    |

## Design System

This app uses a **shadcn-inspired design system** adapted for React Native. All UI is built with semantic design tokens — no hardcoded colors or typography values.

### Theme File

`constants/theme.ts` is the single source of truth for all design tokens:

- **Colors:** Semantic tokens (background, foreground, primary, secondary, muted, accent, destructive, border, input, ring, card, popover) defined for both light and dark modes
- **Typography:** Font families, sizes, weights, and line heights
- **Spacing:** Consistent spacing scale
- **Radius:** Border radius tokens

### Theme Provider

`components/theme-context.tsx` wraps the app in a React Context provider that supplies the current theme (light or dark) to all descendant components.

### `useTheme()` Hook

The `useTheme()` hook (from `hooks/use-theme.ts`) is the **only way** components should access design tokens. It returns the current theme object, which includes all color, typography, spacing, and radius tokens.

```tsx
import { useTheme } from '@/hooks/use-theme';

function MyComponent() {
  const { colors, typography, spacing } = useTheme();

  return (
    <View style={{ backgroundColor: colors.background, padding: spacing.md }}>
      <Text style={{ color: colors.foreground }}>Hello</Text>
    </View>
  );
}
```

Platform-specific variants (`use-theme.web.ts`, `use-color-scheme.web.ts`) handle web platform differences automatically.

### UI Components

All reusable UI primitives live in `components/ui/`:

| Component         | File                    | Description                                               |
| ----------------- | ----------------------- | --------------------------------------------------------- |
| Button            | `button.tsx`            | Pressable button with variant/size props                  |
| Text              | `text.tsx`              | Themed text with typography variants                      |
| Icon              | `icon-symbol.tsx`       | SF Symbols (iOS) and Material Icons                       |
| Input             | `input.tsx`             | Themed text input; supports invalid, focus ring, disabled |
| Label             | `label.tsx`             | Form label text                                           |
| Separator         | `separator.tsx`         | Horizontal or vertical divider                            |
| Checkbox          | `checkbox.tsx`          | Checkbox with controlled/uncontrolled, invalid, sizes     |
| Radio             | `radio.tsx`             | RadioGroup and RadioGroupItem for single choice           |
| Select            | `select.tsx`            | Modal-based dropdown (options, value, onChange)           |
| Field             | `field.tsx`             | Form field primitives (FieldSet, FieldLabel, FieldError…) |
| Item              | `item.tsx`              | List item primitives (ItemGroup, Item, ItemTitle…)        |
| Collapsible       | `collapsible.tsx`       | Expandable/collapsible content                            |
| Segmented Control | `segmented-control.tsx` | Tab-like segmented selector                               |

#### Building new UI components

1. Create the file in `components/ui/`
2. Import and use `useTheme()` for all styling
3. Use semantic tokens — never hardcode colors or font sizes
4. Follow shadcn-style prop patterns (`variant`, `size`, etc.)
5. Keep components composable and focused on a single responsibility

**Placement rule:** Reusable UI goes in `components/ui/`. Feature-specific UI stays local to the feature directory.

## Routing

This app uses [Expo Router](https://docs.expo.dev/router/introduction/) for file-based routing with typed routes.

- Routes are defined by the file structure inside `app/`
- Group routes use parentheses: `(tabs)/` groups tab screens without adding a URL segment
- Each route group has a `_layout.tsx` defining its navigator

## Development

```bash
# From the monorepo root:
pnpm --filter @sprout/mobile dev       # Start Expo dev server
pnpm --filter @sprout/mobile ios       # Run on iOS Simulator
pnpm --filter @sprout/mobile android   # Run on Android Emulator
pnpm --filter @sprout/mobile lint      # Lint
pnpm --filter @sprout/mobile check-types  # Type-check
```
