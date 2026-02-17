-- CreateTable
CREATE TABLE "public"."child_organizations" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "child_id" UUID NOT NULL,
    "organization_id" UUID NOT NULL,

    CONSTRAINT "child_organizations_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."child_organizations" ADD CONSTRAINT "child_organizations_child_id_fkey" FOREIGN KEY ("child_id") REFERENCES "public"."children"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."child_organizations" ADD CONSTRAINT "child_organizations_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Enable Row Level Security on public.child_organizations
ALTER TABLE "public"."child_organizations" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Organization members can view enrolled children."
ON "public"."child_organizations" FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.organization_members
    WHERE organization_members.organization_id = child_organizations.organization_id
    AND organization_members.user_id = auth.uid()
  )
);

CREATE POLICY "Organization owners/staff can manage enrolled children."
ON "public"."child_organizations" FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.organization_members
    WHERE organization_members.organization_id = child_organizations.organization_id
    AND organization_members.user_id = auth.uid()
    AND organization_members.role IN ('owner', 'staff')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.organization_members
    WHERE organization_members.organization_id = child_organizations.organization_id
    AND organization_members.user_id = auth.uid()
    AND organization_members.role IN ('owner', 'staff')
  )
);