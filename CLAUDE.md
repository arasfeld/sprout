# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Product Philosophy

Sprout is a childcare tracking system built around one core principle: **a child has one continuous timeline**. Adults attach to that timeline with roles. Data is never split into "home mode" vs "daycare mode."

The same child timeline is shared between single parents, co-parents, daycare staff, nannies, caregivers, and organizations. Context changes. Data persists.

## Current Development Phase

The mobile app UI is under active development. We are designing screens, building feature flows, creating forms, and iterating on UX. The offline-first local database is in place; Supabase sync runs automatically on sign-in. New features read from SQLite (via `useLiveQuery`) and write locally first (via `useMutation`).

**Do:**

- Query data with `useLiveQuery(db.select().from(table).where(...))` — reactive, no manual invalidation
- Write with `useMutation` (TanStack Query) and call `syncEngine.nudge()` after successful mutations
- Generate UUIDs locally with `crypto.randomUUID()` — same ID flows through SQLite and Supabase
- Follow the shared timeline model — never separate "home" and "daycare" data
- Ask before making architectural changes
- Keep commits small and focused

**Do not:**

- Build a custom API server — clients talk directly to Supabase
- Introduce Redux, RTK Query, MobX, or similar state libraries
- Over-engineer messaging — messages are events with `type = 'message'`
- Add dependencies without explicit approval
- Duplicate data across contexts (home vs daycare)
- Query Supabase directly from UI components — always read from SQLite

## Data Model

**Key tables:**

- `users` — managed by Supabase Auth
- `children` — child profiles
- `child_memberships` — links users to children with roles (parent, caregiver, admin) and optional organization context
- `organizations` — daycares and other care organizations
- `organization_members` — links users to organizations with roles (owner, staff)
- `child_organizations` — links children to organizations
- `events` — **all activity** (nap, meal, diaper, note, message) stored in a single table per child

**Rules:**

1. All activity is stored in `events`. There are no separate tables for naps, meals, etc.
2. Events belong to a child, not to a user or organization.
3. Access is controlled by `child_memberships` and organization membership.
4. Events have a `visibility` field (`all`, `parents_only`, `org_only`) for access control.
5. Messaging is events with `type = 'message'`.

## Local-First Data Architecture

The mobile app uses an offline-first architecture. All reads and writes go through a local SQLite database; Supabase is the remote sync target.

**Data flow:** UI → `useLiveQuery` (drizzle) → SQLite → Sync Engine → Supabase

### Local database (`services/db/`)

- `schema.ts` — Drizzle table definitions mirroring the Supabase schema, plus sync metadata fields (`sync_status`, `created_at`, `updated_at`, `deleted_at`)
- `client.ts` — SQLite singleton, initialized via `execSync` at startup

All local tables carry:

```ts
sync_status: 'local' | 'pending' | 'synced' | 'error'
created_at, updated_at, deleted_at  // soft delete
```

### Sync engine (`services/sync/`)

- `engine.ts` — Singleton `SyncEngine`. Call `syncEngine.nudge()` after mutations to trigger a push/pull cycle.
- `push.ts` — Pushes records with `sync_status = 'pending'` to Supabase.
- `pull.ts` — Fetches Supabase records updated since `last_sync_at`, resolves conflicts, writes to SQLite.
- `resolver.ts` — Re-exports `resolveChild()` from `@sprout/core`. Last-write-wins on `updated_at`.

Sync is triggered automatically on sign-in via `syncEngine.setAuthenticated(true)` in `auth-context.tsx`.

### Query hook pattern

```ts
const { data } = useLiveQuery(db.select().from(children).where(eq(children.id, id)));
// data is undefined on first render, then the result array
```

### Mutation pattern

```ts
const mutation = useMutation({
  mutationFn: async (input) => {
    await db.insert(children).values({ ...input, syncStatus: 'pending' });
    syncEngine.nudge();
  },
});
```

## Supabase Architecture

Supabase is the backend. No custom API server.

- **Auth:** Supabase Auth for user registration, login, and session management
- **Database:** Postgres with Row Level Security (RLS) enforcing all access rules
- **Storage:** Supabase Storage for photo uploads
- **Realtime:** Supabase Realtime for live timeline updates (future)
- **Edge Functions:** For logic that cannot run client-side (future)

Clients (Expo mobile app, future Next.js web app) talk directly to Supabase. RLS policies are the authorization layer.

## Build & Development Commands

This is a pnpm monorepo using Turborepo. All top-level commands run through turbo:

- `pnpm dev` — start all apps in dev mode
- `pnpm build` — build all packages/apps
- `pnpm lint` — lint all packages/apps
- `pnpm check-types` — type-check all packages/apps
- `pnpm format` — format all files with Prettier
- `pnpm clean` — clean all build artifacts and node_modules

### Mobile app (apps/mobile)

- `pnpm --filter @sprout/mobile dev` — start Expo dev server
- `pnpm --filter @sprout/mobile ios` — start on iOS
- `pnpm --filter @sprout/mobile android` — start on Android
- `pnpm --filter @sprout/mobile lint` — lint mobile app only
- `pnpm --filter @sprout/mobile check-types` — type-check mobile app only

### Package build note

`pnpm check-types` does **not** auto-build workspace dependencies. After changing `packages/core` or `packages/supabase`, rebuild before type-checking:

```bash
pnpm --filter @sprout/core build
pnpm --filter @sprout/supabase build
pnpm check-types
```

## Repository Structure

```
apps/
  mobile/              → Expo React Native app (actively developed)
  web/                 → Next.js dashboard (future)
  marketing/           → Marketing site (future)

packages/
  config-eslint/       → Shared ESLint configurations
  config-typescript/   → Shared TypeScript configurations
  core/                → Shared domain types + sync resolver (resolveChild)
  supabase/            → Supabase client, migrations, pull helpers (pullChildren, pullEvents)
```

Currently active: `apps/mobile`, config packages, `packages/core`, and `packages/supabase`.

**Mobile app structure (`apps/mobile/`):**

- `app/` — Expo Router file-based routing with typed routes
- `components/ui/` — Reusable UI primitives styled with theme tokens
- `components/` — App-level components (theme context, auth context, sync context)
- `constants/theme.ts` — Design tokens (colors, typography, spacing, radius)
- `hooks/` — Custom hooks (useTheme, useColorScheme, query hooks, mutation hooks)
- `services/db/` — SQLite client and Drizzle schema
- `services/sync/` — Sync engine, push, pull, resolver
- `services/supabase.ts` — Configured Supabase client singleton
- `types/` — Domain type definitions
- `utils/` — Utility functions

**Platform-specific files:** Use `.ios.tsx`, `.android.tsx`, `.web.ts` suffixes.

**Platform checks:** Always use `Platform.OS` for runtime platform detection (never use `process.env.EXPO_OS`).

## Design System

We use a **shadcn-inspired design system** for React Native.

### Theme Architecture

- **Theme file:** `constants/theme.ts` defines all design tokens
- **Tokens:** Semantic colors (background, foreground, primary, muted, border, etc.), typography, spacing, radius
- **Modes:** Light and dark themes
- **Provider:** `components/theme-context.tsx` provides theme via React Context
- **Hook:** `useTheme()` from `hooks/use-theme.ts` for accessing the current theme

### Component Rules

All reusable UI primitives **must** live in `components/ui/`.

Components **must:**

- Access the theme via `useTheme()`
- Never hardcode colors or typography styles
- Always reference semantic tokens
- Follow shadcn-style prop patterns (variant, size, etc.)
- Be composable and reusable

**Placement rule:** Reusable UI → `components/ui/`. Feature-specific UI → local to the feature.

## State Management

- Keep UI state local where possible (useState, useReducer)
- Do not introduce Redux, RTK Query, or similar libraries
- **Reads:** Use `useLiveQuery` from `drizzle-orm/expo-sqlite` — reactive subscriptions to SQLite
- **Writes:** Use `useMutation` from TanStack Query for loading/error state; write to SQLite directly
- Supabase is the sync target, not the read source — never query Supabase from UI hooks

## Code Style

- TypeScript strict mode enabled
- Prettier: single quotes, trailing commas, 2-space indent, semicolons
- ESLint with TypeScript, React, React Hooks, and Turbo plugins
- React Compiler and New Architecture are enabled
- Workspace dependencies use `workspace:*` protocol
