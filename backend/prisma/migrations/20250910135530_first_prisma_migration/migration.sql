-- CreateTable
CREATE TABLE "public"."contacts" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "profile_picture" TEXT NOT NULL,
    "last_contact_at" TIMESTAMP(3) NOT NULL,
    "archived_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contacts_pkey" PRIMARY KEY ("id")
);
