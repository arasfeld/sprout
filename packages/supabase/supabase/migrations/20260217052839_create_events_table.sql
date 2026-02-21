-- CreateEnum
CREATE TYPE "public"."EventType" AS ENUM ('activity', 'diaper', 'growth', 'meal', 'meds', 'message', 'nap', 'note');

-- CreateEnum
CREATE TYPE "public"."EventVisibility" AS ENUM ('all', 'parents_only', 'org_only');

-- CreateTable
CREATE TABLE "public"."events" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "child_id" UUID NOT NULL,
    "created_by" UUID NOT NULL,
    "organization_id" UUID,
    "type" "public"."EventType" NOT NULL,
    "payload" JSONB NOT NULL,
    "visibility" "public"."EventVisibility" NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

CREATE TRIGGER events_updated_at
    BEFORE UPDATE ON "public"."events"
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- AddForeignKey
ALTER TABLE "public"."events" ADD CONSTRAINT "events_child_id_fkey" FOREIGN KEY ("child_id") REFERENCES "public"."children"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."events" ADD CONSTRAINT "events_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."events" ADD CONSTRAINT "events_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddIndexes
CREATE INDEX IF NOT EXISTS "events_child_id_idx" ON "public"."events" ("child_id");
CREATE INDEX IF NOT EXISTS "events_created_by_idx" ON "public"."events" ("created_by");
CREATE INDEX IF NOT EXISTS "events_organization_id_idx" ON "public"."events" ("organization_id");

-- Enable Row Level Security on public.events
ALTER TABLE "public"."events" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users with child access can view events."
ON "public"."events" FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.child_memberships
    WHERE child_memberships.child_id = events.child_id
    AND child_memberships.user_id = auth.uid()
  )
  AND
  CASE
    WHEN visibility = 'all' THEN true
    WHEN visibility = 'parents_only' THEN
      EXISTS (
        SELECT 1 FROM public.child_memberships
        WHERE child_memberships.child_id = events.child_id
        AND child_memberships.user_id = auth.uid()
        AND child_memberships.role = 'parent'
      )
    WHEN visibility = 'org_only' THEN
      EXISTS (
        SELECT 1 FROM public.child_memberships
        WHERE child_memberships.child_id = events.child_id
        AND child_memberships.user_id = auth.uid()
        AND child_memberships.organization_id = events.organization_id
      )
    ELSE false
  END
);

CREATE POLICY "Users with child access can insert events."
ON "public"."events" FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.child_memberships
    WHERE child_memberships.child_id = events.child_id
    AND child_memberships.user_id = auth.uid()
  )
);

CREATE POLICY "Creator or authorized members can update events."
ON "public"."events" FOR UPDATE
USING (auth.uid() = created_by OR
  EXISTS (
    SELECT 1 FROM public.child_memberships
    WHERE child_memberships.child_id = events.child_id
    AND child_memberships.user_id = auth.uid()
    AND child_memberships.role IN ('admin')
  )
)
WITH CHECK (auth.uid() = created_by OR
  EXISTS (
    SELECT 1 FROM public.child_memberships
    WHERE child_memberships.child_id = events.child_id
    AND child_memberships.user_id = auth.uid()
    AND child_memberships.role IN ('admin')
  )
);

CREATE POLICY "Creator or authorized members can delete events."
ON "public"."events" FOR DELETE
USING (auth.uid() = created_by OR
  EXISTS (
    SELECT 1 FROM public.child_memberships
    WHERE child_memberships.child_id = events.child_id
    AND child_memberships.user_id = auth.uid()
    AND child_memberships.role IN ('admin')
  )
);