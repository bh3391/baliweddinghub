ALTER TABLE "vendor_profile" ADD COLUMN "slug" text NOT NULL;--> statement-breakpoint
ALTER TABLE "vendor_profile" ADD CONSTRAINT "vendor_profile_slug_unique" UNIQUE("slug");