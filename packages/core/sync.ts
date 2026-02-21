/** Local SQLite child record (camelCase fields, from drizzle). */
export interface LocalChild {
  id: string;
  name: string;
  birthdate: string;
  sex: 'male' | 'female' | null | undefined;
  avatarUrl: string | null | undefined;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Remote Supabase child record (snake_case fields). */
export interface RemoteChild {
  id: string;
  name: string;
  birthdate: string;
  sex: string | null;
  avatar_url: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

/** Resolved child record ready to be persisted. */
export interface ResolvedChild {
  id: string;
  name: string;
  birthdate: string;
  sex: string | null;
  avatar_url: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

/**
 * Last-write-wins conflict resolution for children.
 * If the local record has been modified more recently, keep it.
 * Otherwise, accept the remote record.
 */
export function resolveChild(
  local: LocalChild | null,
  remote: RemoteChild,
): ResolvedChild {
  if (!local) {
    return {
      id: remote.id,
      name: remote.name,
      birthdate: remote.birthdate,
      sex: remote.sex,
      avatar_url: remote.avatar_url,
      created_by: remote.created_by,
      created_at: remote.created_at,
      updated_at: remote.updated_at,
    };
  }

  const localUpdatedAt = new Date(local.updatedAt).getTime();
  const remoteUpdatedAt = new Date(remote.updated_at).getTime();

  if (localUpdatedAt > remoteUpdatedAt) {
    return {
      id: local.id,
      name: local.name,
      birthdate: local.birthdate,
      sex: local.sex ?? null,
      avatar_url: local.avatarUrl ?? null,
      created_by: local.createdBy ?? '',
      created_at: local.createdAt,
      updated_at: local.updatedAt,
    };
  }

  return {
    id: remote.id,
    name: remote.name,
    birthdate: remote.birthdate,
    sex: remote.sex,
    avatar_url: remote.avatar_url,
    created_by: remote.created_by,
    created_at: remote.created_at,
    updated_at: remote.updated_at,
  };
}
