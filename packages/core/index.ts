// Define UUID type for clarity
type UUID = string;

// users table
export interface User {
  id: UUID;
  email: string;
}

// children table
export interface Child {
  id: UUID;
  name: string;
  birthdate: string; // ISO date string
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
  permissions: Record<string, any> | null; // jsonb, nullable
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
export type EventType = 'nap' | 'meal' | 'diaper' | 'note' | 'message';
export type EventVisibility = 'all' | 'parents_only' | 'org_only';

export interface Event {
  id: UUID;
  child_id: UUID;
  created_by: UUID;
  organization_id: UUID | null; // nullable
  type: EventType;
  payload: Record<string, any>; // jsonb
  visibility: EventVisibility;
  created_at: string; // timestamptz ISO string
}
