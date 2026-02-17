# @sprout/supabase

This package provides the Supabase client and related utilities for the Sprout application. It is also the designated place for managing Supabase database schema, migrations, and type generation.

## Supabase CLI Integration

The Supabase CLI is integrated into this package's `package.json` scripts to streamline local development and database management.

### Prerequisites

- **Supabase CLI:** Ensure you have the Supabase CLI installed. You can run `npx supabase --version` to check. If not installed globally, `npx` will use the latest version automatically for the commands below.
- **Docker:** Supabase CLI uses Docker for local development. Make sure Docker Desktop is running.

### Local Development Workflow

1.  **Start Local Supabase Services:**
    To start all local Supabase services (Postgres, Auth, Storage, etc.):

    ```bash
    pnpm --filter @sprout/supabase supabase:start
    ```

    This will output local credentials (API URL, anon key, Studio URL, etc.).

2.  **Stop Local Supabase Services:**

    ```bash
    pnpm --filter @sprout/supabase supabase:stop
    ```

3.  **Link to Supabase Project:**
    If you are developing against a remote Supabase project, you need to link your local setup to it. You'll be prompted to enter your project reference ID (found in your Supabase project settings URL) and your Supabase personal access token.

    ```bash
    pnpm --filter @sprout/supabase supabase:link
    ```

4.  **Manage Database Migrations:**
    The `supabase` CLI manages your database schema through migration files.
    - **Pull remote schema to local migrations:**

      ```bash
      pnpm --filter @sprout/supabase supabase:pull
      ```

      This command generates new migration files based on changes in your remote database schema.

    - **Apply local migrations to your local or remote database:**
      ```bash
      pnpm --filter @sprout/supabase supabase:push
      ```
      This command applies any new or pending migration files to your linked database. Use with caution when pushing to a remote database!

5.  **Generate TypeScript Types:**
    It's crucial to keep your TypeScript types in sync with your database schema. This command generates `database.types.ts` (in the package root) based on your _local_ Supabase database schema.

    ```bash
    pnpm --filter @sprout/supabase supabase:gen-types
    ```

    After running this, your `database.types.ts` will contain the accurate types for your Supabase client.

6.  **Seed Initial Data (Addressing "no data exists" issue):**
    To populate your local development database with initial data, create a `seed.sql` file within the `supabase/seed.sql` path (relative to the monorepo root) or where your `supabase` project is initialized (by `supabase init`).

    **Example `supabase/seed.sql` for the `children` table:**

    ```sql
    -- Insert some sample children data
    INSERT INTO public.children (id, name, birthdate, created_by)
    VALUES
      ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Alice Smith', '2022-01-15', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380b00'),
      ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Bob Johnson', '2021-06-20', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380b00');

    -- Note: Ensure the 'created_by' UUID exists in your 'users' table,
    -- or adjust this to match your actual data model and RLS policies.
    -- For testing, you might temporarily relax RLS or use a known user ID.
    ```

    Then, run the seed command:

    ```bash
    pnpm --filter @sprout/supabase supabase:seed
    ```

    This will execute the `seed.sql` file against your local Supabase database. You might need to run `supabase stop` and `supabase start` after adding the `seed.sql` for it to be picked up by the CLI.

## Point the mobile app at local Supabase

The app reads `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` from `apps/mobile/.env`. If those are missing or point at a remote project, you’ll see errors like “Could not find the table 'public.children'” even after running `supabase:push` locally.

**For local development**, set `apps/mobile/.env` to your local instance:

1. From repo root, start Supabase and apply migrations:
   ```bash
   pnpm --filter @sprout/supabase supabase:start
   pnpm --filter @sprout/supabase supabase:push
   ```
2. In the `supabase:start` output, copy:
   - **Project URL** → `EXPO_PUBLIC_SUPABASE_URL` (e.g. `http://127.0.0.1:54321`)
   - **Publishable** key (under Authentication Keys) → `EXPO_PUBLIC_SUPABASE_ANON_KEY`
3. Create or edit `apps/mobile/.env`:
   ```
   EXPO_PUBLIC_SUPABASE_URL="http://127.0.0.1:54321"
   EXPO_PUBLIC_SUPABASE_ANON_KEY="<Publishable key from supabase start output>"
   ```
4. Restart the Expo dev server so it picks up the new env (Expo embeds env at build/start time).

**Simulator vs device:** `127.0.0.1` works for iOS Simulator. On a physical device, use your machine’s LAN IP (e.g. `http://192.168.1.10:54321`) so the device can reach your Mac.

## Usage in Mobile App

The `apps/mobile/services/supabase.ts` file creates a typed Supabase client using the env vars above. Use the same vars for a remote project when not developing locally.
