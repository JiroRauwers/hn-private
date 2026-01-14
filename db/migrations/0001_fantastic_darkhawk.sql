ALTER TABLE "sponsorships" ALTER COLUMN "type" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."sponsorship_type";--> statement-breakpoint
CREATE TYPE "public"."sponsorship_type" AS ENUM('featured', 'premium', 'bump');--> statement-breakpoint
ALTER TABLE "sponsorships" ALTER COLUMN "type" SET DATA TYPE "public"."sponsorship_type" USING "type"::"public"."sponsorship_type";--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "role" text DEFAULT 'player' NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "avatar" text;