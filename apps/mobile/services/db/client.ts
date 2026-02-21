import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';

import * as schema from './schema';

const expo = openDatabaseSync('sprout.db', { enableChangeListener: true });

// Initialize schema synchronously — runs once on module load before any component uses the db.
expo.execSync(`
  PRAGMA journal_mode = WAL;
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS children (
    id TEXT PRIMARY KEY NOT NULL,
    sync_status TEXT NOT NULL DEFAULT 'local',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    deleted_at TEXT,
    name TEXT NOT NULL,
    birthdate TEXT NOT NULL,
    sex TEXT,
    avatar_url TEXT,
    created_by TEXT
  );

  CREATE TABLE IF NOT EXISTS events (
    id TEXT PRIMARY KEY NOT NULL,
    sync_status TEXT NOT NULL DEFAULT 'local',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    deleted_at TEXT,
    child_id TEXT NOT NULL REFERENCES children(id),
    type TEXT NOT NULL,
    payload TEXT NOT NULL,
    visibility TEXT NOT NULL DEFAULT 'all',
    organization_id TEXT,
    created_by TEXT
  );

  CREATE TABLE IF NOT EXISTS sync_meta (
    key TEXT PRIMARY KEY NOT NULL,
    value TEXT NOT NULL
  );
`);

export const db = drizzle(expo, { schema });
