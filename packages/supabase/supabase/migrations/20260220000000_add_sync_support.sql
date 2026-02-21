-- RPC called by the sync engine to upsert a locally-created child.
-- Uses SECURITY DEFINER so it can bypass RLS during the transaction;
-- auth.uid() is enforced inside.
CREATE OR REPLACE FUNCTION public.sync_child(
  p_id uuid,
  p_name text,
  p_birthdate date,
  p_sex public."Sex" DEFAULT NULL,
  p_avatar_url text DEFAULT NULL,
  p_created_at timestamptz DEFAULT NULL,
  p_updated_at timestamptz DEFAULT NULL
)
RETURNS public.children
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_child public.children;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Ensure user exists in public.users.
  INSERT INTO public.users (id, email)
  VALUES (v_user_id, auth.jwt() ->> 'email')
  ON CONFLICT (id) DO NOTHING;

  -- Upsert child with the client-generated UUID.
  INSERT INTO public.children (id, name, birthdate, sex, avatar_url, created_by, created_at, updated_at)
  VALUES (
    p_id,
    p_name,
    p_birthdate,
    p_sex,
    p_avatar_url,
    v_user_id,
    COALESCE(p_created_at, CURRENT_TIMESTAMP),
    COALESCE(p_updated_at, CURRENT_TIMESTAMP)
  )
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    birthdate = EXCLUDED.birthdate,
    sex = EXCLUDED.sex,
    avatar_url = EXCLUDED.avatar_url,
    updated_at = CURRENT_TIMESTAMP;

  -- Ensure the parent membership exists.
  INSERT INTO public.child_memberships (child_id, user_id, role)
  VALUES (p_id, v_user_id, 'parent')
  ON CONFLICT (child_id, user_id) DO NOTHING;

  SELECT * INTO v_child FROM public.children WHERE id = p_id;
  RETURN v_child;
END;
$$;

GRANT EXECUTE ON FUNCTION public.sync_child(uuid, text, date, public."Sex", text, timestamptz, timestamptz) TO authenticated;
