# Sprout

A cross-platform childcare tracking system for parents, caregivers, and daycares.

## Core Concept: One Child, One Timeline

Sprout is built around a single principle: **a child has one continuous timeline**. Adults attach to that timeline with roles. Data is never split into "home mode" vs "daycare mode."

The same timeline works for:

- **Single parent** logging naps, meals, and diapers at home
- **Co-parents** sharing a child's activity throughout the day
- **Daycare staff** logging events during care hours
- **Parents viewing daycare data** in real time after drop-off
- **A parent logging at home** after pickup — same timeline, same child

Context changes. Data persists.

## How It Works

All activity for a child is stored as **events** — naps, meals, diapers, notes, messages. Every event belongs to the child's timeline. Who can see and create events is controlled by **memberships**: users are linked to children with roles (parent, caregiver, admin), and optionally through organizations (daycares).

Events have a `visibility` field (`all`, `parents_only`, `org_only`) so staff can keep internal notes and parents can keep private entries, but the default is shared.

## Architecture

### No Custom API Server

Clients talk directly to [Supabase](https://supabase.com). There is no Express/Fastify/Next.js API layer. Authorization is enforced at the database level via Postgres Row Level Security (RLS). This keeps the stack simple and reduces the surface area for bugs.

### Supabase Stack

| Service | Purpose |
|---|---|
| Supabase Auth | User registration, login, sessions |
| Postgres + RLS | Database with row-level access control |
| Supabase Storage | Photo uploads |
| Supabase Realtime | Live timeline updates |
| Edge Functions | Server-side logic when needed (future) |

### Data Model (Summary)

| Table | Purpose |
|---|---|
| `users` | Managed by Supabase Auth |
| `children` | Child profiles |
| `child_memberships` | Links users to children with roles + optional org context |
| `organizations` | Daycares and care organizations |
| `organization_members` | Links users to organizations with roles |
| `child_organizations` | Links children to organizations |
| `events` | All activity (nap, meal, diaper, note, message) |

See [docs/architecture.md](docs/architecture.md) for the full data model, entity relationships, and RLS philosophy.

## Monorepo Structure

This is a pnpm monorepo managed by [Turborepo](https://turbo.build/repo).

```
apps/
  mobile/              → Expo React Native app (actively developed)
  web/                 → Next.js admin dashboard (future)
  marketing/           → Marketing site (future)

packages/
  config-eslint/       → Shared ESLint configurations
  config-typescript/   → Shared TypeScript configurations
  supabase/            → Supabase client + typed helpers (future)
  types/               → Shared TypeScript types, generated from DB (future)
  ui/                  → Shared UI components (future)
```

Currently, only `apps/mobile` and the config packages are active.

## Tech Stack

| Layer | Technology |
|---|---|
| Mobile app | Expo SDK 54, React Native 0.81, React 19 |
| Routing | Expo Router (file-based) |
| Language | TypeScript (strict mode) |
| Monorepo | Turborepo + pnpm workspaces |
| Design system | shadcn-inspired tokens + `useTheme()` hook |
| Backend | Supabase (Postgres, Auth, Storage, Realtime) |
| Client caching | TanStack Query (optional, alongside Supabase) |
| Linting | ESLint with TypeScript, React, and Turbo plugins |
| Formatting | Prettier |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS)
- [pnpm](https://pnpm.io/)
- iOS Simulator (macOS) or Android Emulator

### Setup

```bash
# Install dependencies
pnpm install

# Start the Expo dev server
pnpm --filter @sprout/mobile dev

# Or start on a specific platform
pnpm --filter @sprout/mobile ios
pnpm --filter @sprout/mobile android
```

### All Commands

| Command | Description |
|---|---|
| `pnpm dev` | Start all apps in dev mode |
| `pnpm build` | Build all packages/apps |
| `pnpm lint` | Lint all packages/apps |
| `pnpm check-types` | Type-check all packages/apps |
| `pnpm format` | Format all files with Prettier |
| `pnpm clean` | Clean build artifacts and node_modules |

## Design System

The mobile app uses a **shadcn-inspired design system** adapted for React Native. All colors, typography, spacing, and radius values come from semantic tokens defined in `apps/mobile/constants/theme.ts`. Components access the theme via the `useTheme()` hook.

See [apps/mobile/README.md](apps/mobile/README.md) for detailed design system documentation.
