-- CreateEnum
CREATE TYPE "public"."Sex" AS ENUM ('male', 'female');

-- CreateTable
CREATE TABLE "public"."children" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "birthdate" DATE NOT NULL,
    "sex" "public"."Sex",
    "avatar_url" TEXT,
    "created_by" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "children_pkey" PRIMARY KEY ("id")
);

CREATE TRIGGER children_updated_at
    BEFORE UPDATE ON "public"."children"
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- AddForeignKey
ALTER TABLE "public"."children" ADD CONSTRAINT "children_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddIndex
CREATE INDEX IF NOT EXISTS "children_created_by_idx" ON "public"."children" ("created_by");