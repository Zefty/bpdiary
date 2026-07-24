CREATE TABLE "bpdiary_development"."bpdiary_calendar_connection" (
	"id" serial PRIMARY KEY,
	"user_id" text NOT NULL,
	"provider" text NOT NULL,
	"external_calendar_id" text,
	"time_zone" text NOT NULL,
	"status" text DEFAULT 'authorizing' NOT NULL,
	"last_error" text,
	"last_synced_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bpdiary_development"."bpdiary_reminder_calendar_event" (
	"id" serial PRIMARY KEY,
	"reminder_id" integer NOT NULL,
	"connection_id" integer NOT NULL,
	"external_event_id" text,
	"sync_status" text DEFAULT 'pending' NOT NULL,
	"last_error" text,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "calendar_connection_user_provider_idx" ON "bpdiary_development"."bpdiary_calendar_connection" ("user_id","provider");--> statement-breakpoint
CREATE UNIQUE INDEX "reminder_calendar_event_reminder_connection_idx" ON "bpdiary_development"."bpdiary_reminder_calendar_event" ("reminder_id","connection_id");--> statement-breakpoint
ALTER TABLE "bpdiary_development"."bpdiary_calendar_connection" ADD CONSTRAINT "bpdiary_calendar_connection_user_id_bpdiary_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "bpdiary_development"."bpdiary_user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "bpdiary_development"."bpdiary_reminder_calendar_event" ADD CONSTRAINT "bpdiary_reminder_calendar_event_NDNd3XUnqY6o_fkey" FOREIGN KEY ("reminder_id") REFERENCES "bpdiary_development"."bpdiary_reminder"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "bpdiary_development"."bpdiary_reminder_calendar_event" ADD CONSTRAINT "bpdiary_reminder_calendar_event_t1POBwnW10hz_fkey" FOREIGN KEY ("connection_id") REFERENCES "bpdiary_development"."bpdiary_calendar_connection"("id") ON DELETE CASCADE;