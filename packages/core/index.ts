// Define UUID type for clarity
type UUID = string;

// Sync types
export type SyncStatus = 'local' | 'pending' | 'synced' | 'error';

export interface SyncableRecord {
  sync_status: SyncStatus;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export {
  type LocalChild,
  type RemoteChild,
  type ResolvedChild,
  resolveChild,
} from './sync';

// users table
export interface User {
  id: UUID;
  email: string;
}

// children table
export type Sex = 'male' | 'female';

export interface Child {
  id: UUID;
  name: string;
  birthdate: string; // ISO date string
  sex: Sex | null;
  avatar_url: string | null;
  created_by: UUID;
}

// child_memberships table
export type ChildMembershipRole = 'parent' | 'caregiver' | 'admin';

export interface ChildMembership {
  id: UUID;
  child_id: UUID;
  user_id: UUID;
  role: ChildMembershipRole;
  organization_id: UUID | null; // nullable
  permissions: Record<string, unknown> | null; // jsonb, nullable
}

// organizations table
export type OrganizationType = 'daycare'; // extensible

export interface Organization {
  id: UUID;
  name: string;
  type: OrganizationType;
}

// organization_members table
export type OrganizationMemberRole = 'owner' | 'staff';

export interface OrganizationMember {
  id: UUID;
  organization_id: UUID;
  user_id: UUID;
  role: OrganizationMemberRole;
}

// child_organizations table
export interface ChildOrganization {
  id: UUID;
  child_id: UUID;
  organization_id: UUID;
}

// events table
export type EventType =
  | 'nap'
  | 'meal'
  | 'diaper'
  | 'note'
  | 'message'
  | 'growth'
  | 'meds'
  | 'activity';
export type EventVisibility = 'all' | 'parents_only' | 'org_only';

export interface Event {
  id: UUID;
  child_id: UUID;
  created_by: UUID;
  organization_id: UUID | null; // nullable
  type: EventType;
  payload: Record<string, unknown>; // jsonb
  visibility: EventVisibility;
  created_at: string; // timestamptz ISO string
}
