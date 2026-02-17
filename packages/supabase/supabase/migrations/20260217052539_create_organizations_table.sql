-- CreateEnum
CREATE TYPE "public"."OrganizationType" AS ENUM ('daycare');

-- CreateTable
CREATE TABLE "public"."organizations" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "type" "public"."OrganizationType" NOT NULL,

    CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
);