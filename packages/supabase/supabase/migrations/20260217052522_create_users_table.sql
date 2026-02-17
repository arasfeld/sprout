-- CreateTable: public.users (profile table for Supabase Auth)
CREATE TABLE "public"."users" (
    "id" UUID NOT NULL, -- This will be a foreign key to auth.users.id
    "email" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- Enable Row Level Security (RLS) on public.users
ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view and update their own profile."
ON "public"."users" FOR ALL
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);