CREATE SCHEMA "bpdiary_development";
--> statement-breakpoint
CREATE TABLE "bpdiary_development"."bpdiary_account" (
	"id" text PRIMARY KEY,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bpdiary_development"."bpdiary_session" (
	"id" text PRIMARY KEY,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL UNIQUE,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bpdiary_development"."bpdiary_user" (
	"id" text PRIMARY KEY,
	"name" text NOT NULL,
	"email" text NOT NULL UNIQUE,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bpdiary_development"."bpdiary_verification" (
	"id" text PRIMARY KEY,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bpdiary_development"."bpdiary_measurement" (
	"id" serial PRIMARY KEY,
	"user_id" text NOT NULL,
	"measured_at" timestamp with time zone NOT NULL,
	"systolic" integer NOT NULL,
	"diastolic" integer NOT NULL,
	"pulse" integer,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bpdiary_development"."bpdiary_profile" (
	"user_id" text PRIMARY KEY,
	"date_of_birth" text,
	"timezone" text DEFAULT 'UTC' NOT NULL,
	"theme" text DEFAULT 'system' NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bpdiary_development"."bpdiary_reminder" (
	"id" serial PRIMARY KEY,
	"user_id" text NOT NULL,
	"type" text NOT NULL,
	"time" text NOT NULL,
	"days" text[] NOT NULL,
	"active" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "bpdiary_development"."bpdiary_account" ("user_id");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "bpdiary_development"."bpdiary_session" ("user_id");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "bpdiary_development"."bpdiary_verification" ("identifier");--> statement-breakpoint
CREATE INDEX "measurement_user_measured_idx" ON "bpdiary_development"."bpdiary_measurement" ("user_id","measured_at");--> statement-breakpoint
CREATE INDEX "reminder_user_idx" ON "bpdiary_development"."bpdiary_reminder" ("user_id");--> statement-breakpoint
ALTER TABLE "bpdiary_development"."bpdiary_account" ADD CONSTRAINT "bpdiary_account_user_id_bpdiary_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "bpdiary_development"."bpdiary_user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "bpdiary_development"."bpdiary_session" ADD CONSTRAINT "bpdiary_session_user_id_bpdiary_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "bpdiary_development"."bpdiary_user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "bpdiary_development"."bpdiary_measurement" ADD CONSTRAINT "bpdiary_measurement_user_id_bpdiary_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "bpdiary_development"."bpdiary_user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "bpdiary_development"."bpdiary_profile" ADD CONSTRAINT "bpdiary_profile_user_id_bpdiary_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "bpdiary_development"."bpdiary_user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "bpdiary_development"."bpdiary_reminder" ADD CONSTRAINT "bpdiary_reminder_user_id_bpdiary_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "bpdiary_development"."bpdiary_user"("id") ON DELETE CASCADE;