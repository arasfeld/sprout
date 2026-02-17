-- CreateTable
CREATE TABLE "public"."children" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "birthdate" DATE NOT NULL,
    "created_by" UUID NOT NULL,

    CONSTRAINT "children_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."children" ADD CONSTRAINT "children_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;