-- Create child + parent membership in one transaction.
-- Uses SECURITY DEFINER so RLS does not block the insert; we enforce auth.uid() inside.
-- Call from the app via supabase.rpc('create_child_for_current_user', { p_name, p_birthdate }).

CREATE OR REPLACE FUNCTION public.create_child_for_current_user(
  p_name text,
  p_birthdate date
)
RETURNS public.children
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_child_id uuid;
  v_child public.children;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Just-in-time sync of the user into public.users
  INSERT INTO public.users (id, email)
  VALUES (v_user_id, auth.jwt() ->> 'email')
  ON CONFLICT (id) DO NOTHING;

  v_child_id := gen_random_uuid();

  INSERT INTO public.children (id, name, birthdate, created_by)
  VALUES (v_child_id, p_name, p_birthdate, v_user_id);

  INSERT INTO public.child_memberships (child_id, user_id, role)
  VALUES (v_child_id, v_user_id, 'parent'::public."ChildMembershipRole");

  SELECT * INTO v_child FROM public.children WHERE id = v_child_id;
  RETURN v_child;
END;
$$;

GRANT EXECUTE ON FUNCTION public.create_child_for_current_user(text, date) TO anon;
GRANT EXECUTE ON FUNCTION public.create_child_for_current_user(text, date) TO authenticated;
