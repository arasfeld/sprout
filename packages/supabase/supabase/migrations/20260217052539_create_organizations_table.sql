-- CreateEnum
CREATE TYPE "public"."OrganizationType" AS ENUM ('daycare');

-- CreateTable
CREATE TABLE "public"."organizations" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "type" "public"."OrganizationType" NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
);

CREATE TRIGGER organizations_updated_at
    BEFORE UPDATE ON "public"."organizations"
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();