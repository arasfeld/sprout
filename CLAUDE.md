# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Product Philosophy

Sprout is a childcare tracking system built around one core principle: **a child has one continuous timeline**. Adults attach to that timeline with roles. Data is never split into "home mode" vs "daycare mode."

The same child timeline is shared between single parents, co-parents, daycare staff, nannies, caregivers, and organizations. Context changes. Data persists.

## Current Development Phase

The mobile app UI is under active development. We are designing screens, building feature flows, creating forms, and iterating on UX. The data model is defined (see [docs/architecture.md](docs/architecture.md)) but backend integration is being introduced incrementally.

**Do:**

- Use mock/local data for features that are not yet connected
- Keep UI state local where possible (useState, useReducer)
- Model domain types in the `types/` directory or in `packages/types`
- Follow the shared timeline model — never separate "home" and "daycare" data
- Ask before making architectural changes
- Keep commits small and focused

**Do not:**

- Build a custom API server — clients talk directly to Supabase
- Introduce Redux, RTK Query, MobX, or similar state libraries
- Over-engineer messaging — messages are events with `type = 'message'`
- Add dependencies without explicit approval
- Duplicate data across contexts (home vs daycare)

## Data Model

The core data model follows the shared timeline principle. See [docs/architecture.md](docs/architecture.md) for full details.

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

## Supabase Architecture

Supabase is the backend. No custom API server.

- **Auth:** Supabase Auth for user registration, login, and session management
- **Database:** Postgres with Row Level Security (RLS) enforcing all access rules
- **Storage:** Supabase Storage for photo uploads
- **Realtime:** Supabase Realtime for live timeline updates
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

## Repository Structure

```
apps/
  mobile/              → Expo React Native app (actively developed)
  web/                 → Next.js dashboard (future)
  marketing/           → Marketing site (future)

packages/
  config-eslint/       → Shared ESLint configurations
  config-typescript/   → Shared TypeScript configurations
  supabase/            → Supabase client + typed helpers (future)
  types/               → Shared TypeScript types (future, generated from DB)
  ui/                  → Shared UI components (future)
```

Currently, only `apps/mobile` and the config packages are active.

**Mobile app structure (`apps/mobile/`):**

- `app/` — Expo Router file-based routing with typed routes
- `components/ui/` — Reusable UI primitives styled with theme tokens
- `components/` — App-level components (theme context, navigation helpers)
- `constants/theme.ts` — Design tokens (colors, typography, spacing, radius)
- `hooks/` — Custom hooks (useTheme, useColorScheme) with platform-specific variants
- `services/` — Business logic (e.g., storage service)
- `types/` — Domain type definitions
- `utils/` — Utility functions

**Platform-specific files:** Use `.ios.tsx`, `.android.tsx`, `.web.ts` suffixes.

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
- TanStack Query may be used for client-side caching alongside Supabase
- Supabase handles data fetching and realtime — TanStack Query is optional caching, not the primary data layer

## Code Style

- TypeScript strict mode enabled
- Prettier: single quotes, trailing commas, 2-space indent, semicolons
- ESLint with TypeScript, React, React Hooks, and Turbo plugins
- React Compiler and New Architecture are enabled
- Workspace dependencies use `workspace:*` protocol
