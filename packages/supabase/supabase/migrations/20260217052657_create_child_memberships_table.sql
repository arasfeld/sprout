-- CreateEnum
CREATE TYPE "public"."ChildMembershipRole" AS ENUM ('parent', 'caregiver', 'admin');

-- CreateTable
CREATE TABLE "public"."child_memberships" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "child_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "role" "public"."ChildMembershipRole" NOT NULL,
    "organization_id" UUID,
    "permissions" JSONB,

    CONSTRAINT "child_memberships_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."child_memberships" ADD CONSTRAINT "child_memberships_child_id_fkey" FOREIGN KEY ("child_id") REFERENCES "public"."children"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."child_memberships" ADD CONSTRAINT "child_memberships_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."child_memberships" ADD CONSTRAINT "child_memberships_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddIndexes
CREATE INDEX IF NOT EXISTS "child_memberships_child_id_idx" ON "public"."child_memberships" ("child_id");
CREATE INDEX IF NOT EXISTS "child_memberships_user_id_idx" ON "public"."child_memberships" ("user_id");
CREATE INDEX IF NOT EXISTS "child_memberships_organization_id_idx" ON "public"."child_memberships" ("organization_id");

-- Enable Row Level Security on public.child_memberships
ALTER TABLE "public"."child_memberships" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own child memberships."
ON "public"."child_memberships" FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own child memberships."
ON "public"."child_memberships" FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own child memberships."
ON "public"."child_memberships" FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own child memberships."
ON "public"."child_memberships" FOR DELETE
USING (auth.uid() = user_id);

-- Enable Row Level Security on public.children (policies reference child_memberships)
ALTER TABLE "public"."children" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users with child membership can view children data."
ON "public"."children" FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.child_memberships
    WHERE child_memberships.child_id = children.id
    AND child_memberships.user_id = auth.uid()
  )
);

CREATE POLICY "Users with child membership can insert children data."
ON "public"."children" FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.child_memberships
    WHERE child_memberships.child_id = children.id
    AND child_memberships.user_id = auth.uid()
  ) OR (auth.uid() = created_by)
);

CREATE POLICY "Users with child membership can update children data."
ON "public"."children" FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.child_memberships
    WHERE child_memberships.child_id = children.id
    AND child_memberships.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.child_memberships
    WHERE child_memberships.child_id = children.id
    AND child_memberships.user_id = auth.uid()
  )
);

CREATE POLICY "Users with child membership can delete children data."
ON "public"."children" FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.child_memberships
    WHERE child_memberships.child_id = children.id
    AND child_memberships.user_id = auth.uid()
  )
);