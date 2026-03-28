ALTER TABLE "inquiries" ADD COLUMN "assigned_to" text;--> statement-breakpoint
ALTER TABLE "inquiries" ADD COLUMN "wedding_location" text DEFAULT 'Buleleng';--> statement-breakpoint
ALTER TABLE "inquiries" ADD COLUMN "internal_notes" text;--> statement-breakpoint
ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_assigned_to_user_id_fk" FOREIGN KEY ("assigned_to") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;