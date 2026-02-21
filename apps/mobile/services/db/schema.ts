import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

import type { EventType } from '@sprout/core';

const syncFields = {
  id: text('id').primaryKey(),
  syncStatus: text('sync_status')
    .notNull()
    .$type<'local' | 'pending' | 'synced' | 'error'>(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
  deletedAt: text('deleted_at'),
};

export const children = sqliteTable('children', {
  ...syncFields,
  name: text('name').notNull(),
  birthdate: text('birthdate').notNull(),
  sex: text('sex').$type<'male' | 'female'>(),
  avatarUrl: text('avatar_url'),
  createdBy: text('created_by'),
});

export const events = sqliteTable('events', {
  ...syncFields,
  childId: text('child_id')
    .notNull()
    .references(() => children.id),
  type: text('type').notNull().$type<EventType>(),
  payload: text('payload').notNull(), // JSON serialized
  visibility: text('visibility')
    .notNull()
    .$type<'all' | 'parents_only' | 'org_only'>(),
  organizationId: text('organization_id'),
  createdBy: text('created_by'),
});

export const syncMeta = sqliteTable('sync_meta', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
});

export type ChildRow = typeof children.$inferSelect;
export type EventRow = typeof events.$inferSelect;
