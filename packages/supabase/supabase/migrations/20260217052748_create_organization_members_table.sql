-- CreateEnum
CREATE TYPE "public"."OrganizationMemberRole" AS ENUM ('owner', 'staff');

-- CreateTable
CREATE TABLE "public"."organization_members" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "organization_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "role" "public"."OrganizationMemberRole" NOT NULL,

    CONSTRAINT "organization_members_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."organization_members" ADD CONSTRAINT "organization_members_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."organization_members" ADD CONSTRAINT "organization_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddIndexes
CREATE INDEX IF NOT EXISTS "organization_members_organization_id_idx" ON "public"."organization_members" ("organization_id");
CREATE INDEX IF NOT EXISTS "organization_members_user_id_idx" ON "public"."organization_members" ("user_id");

-- Enable Row Level Security on public.organization_members
ALTER TABLE "public"."organization_members" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Organization members can view their own memberships."
ON "public"."organization_members" FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Organization owners can manage members."
ON "public"."organization_members" FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.organization_members as om
    WHERE om.organization_id = organization_members.organization_id
    AND om.user_id = auth.uid()
    AND om.role = 'owner'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.organization_members as om
    WHERE om.organization_id = organization_members.organization_id
    AND om.user_id = auth.uid()
    AND om.role = 'owner'
  )
);

-- Enable Row Level Security on public.organizations (policies reference organization_members)
ALTER TABLE "public"."organizations" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view organizations."
ON "public"."organizations" FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Organization members can update their organization."
ON "public"."organizations" FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.organization_members
    WHERE organization_members.organization_id = organizations.id
    AND organization_members.user_id = auth.uid()
    AND organization_members.role IN ('owner', 'staff')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.organization_members
    WHERE organization_members.organization_id = organizations.id
    AND organization_members.user_id = auth.uid()
    AND organization_members.role IN ('owner', 'staff')
  )
);

CREATE POLICY "Authenticated users can insert organizations."
ON "public"."organizations" FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Organization owner can delete organization."
ON "public"."organizations" FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.organization_members
    WHERE organization_members.organization_id = organizations.id
    AND organization_members.user_id = auth.uid()
    AND organization_members.role = 'owner'
  )
);