# @sprout/supabase

This package provides the Supabase client, database types, sync pull helpers, and all migration management for the Sprout application.

## Exports

### Client

```ts
import { createSupabaseClient } from '@sprout/supabase';
```

Creates a typed `SupabaseClient<Database>` from a URL and anon key.

### Database types

```ts
import type { Database } from '@sprout/supabase';
```

Auto-generated TypeScript types for all Supabase tables and enums. Regenerate with `pnpm --filter @sprout/supabase supabase:gen-types` after schema changes.

### Sync pull helpers

```ts
import { pullChildren, pullEvents } from '@sprout/supabase';
import type { RemoteEvent } from '@sprout/supabase';
```

Platform-agnostic incremental fetch functions. Both take a `since` timestamp and a Supabase client; both return typed arrays.

```ts
// Fetch children updated after a timestamp (or all if since is null)
const children = await pullChildren(lastSyncAt, supabaseClient);

// Fetch events created after a timestamp (or all if since is null)
const events = await pullEvents(lastSyncAt, supabaseClient);
```

These functions have no SQLite or mobile dependencies — they work in any JavaScript environment (mobile, server, CLI).

## Supabase CLI Integration

The Supabase CLI is integrated into this package's `package.json` scripts to streamline local development and database management.

### Prerequisites

- **Docker:** Supabase CLI uses Docker for local development. Make sure Docker Desktop is running.

### Local Development Workflow

1. **Start Local Supabase Services:**

   ```bash
   pnpm --filter @sprout/supabase supabase:start
   ```

   This will output local credentials (API URL, anon key, Studio URL, etc.).

2. **Stop Local Supabase Services:**

   ```bash
   pnpm --filter @sprout/supabase supabase:stop
   ```

3. **Link to Supabase Project:**

   ```bash
   pnpm --filter @sprout/supabase supabase:link
   ```

4. **Manage Database Migrations:**

   ```bash
   # Pull remote schema changes into local migration files
   pnpm --filter @sprout/supabase supabase:pull

   # Apply local migrations to local or remote database
   pnpm --filter @sprout/supabase supabase:push
   ```

5. **Generate TypeScript Types:**

   After any schema change, regenerate types:

   ```bash
   pnpm --filter @sprout/supabase supabase:gen-types
   ```

   Then rebuild the package so consumers pick up the new types:

   ```bash
   pnpm --filter @sprout/supabase build
   ```

## Migrations

Migrations live in `supabase/migrations/`. Key migrations:

| File | Purpose |
| ---- | ------- |
| `20260217052556_create_children_table.sql` | Children table |
| `20260217052839_create_events_table.sql` | Events table (all activity) |
| `20260220000000_add_sync_support.sql` | Adds `created_at`, `updated_at` to children; `sync_child` RPC for client-side upsert |

## Point the mobile app at local Supabase

The app reads `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` from `apps/mobile/.env`.

**For local development:**

1. Start Supabase and apply migrations:
   ```bash
   pnpm --filter @sprout/supabase supabase:start
   pnpm --filter @sprout/supabase supabase:push
   ```
2. Copy the **Project URL** and **Publishable** key from the `supabase:start` output.
3. Create or edit `apps/mobile/.env`:
   ```
   EXPO_PUBLIC_SUPABASE_URL="http://127.0.0.1:54321"
   EXPO_PUBLIC_SUPABASE_ANON_KEY="<publishable key>"
   ```
4. Restart the Expo dev server so it picks up the new env.

**Simulator vs device:** `127.0.0.1` works for iOS Simulator. On a physical device, use your machine's LAN IP (e.g. `http://192.168.1.10:54321`).
