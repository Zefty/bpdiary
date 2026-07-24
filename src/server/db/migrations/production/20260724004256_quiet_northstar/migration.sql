CREATE TABLE "bpdiary_production"."bpdiary_diary_share" (
	"id" serial PRIMARY KEY,
	"user_id" text NOT NULL,
	"token_hash" text NOT NULL,
	"include_notes" boolean DEFAULT false NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"revoked_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "diary_share_user_idx" ON "bpdiary_production"."bpdiary_diary_share" ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "diary_share_token_hash_idx" ON "bpdiary_production"."bpdiary_diary_share" ("token_hash");--> statement-breakpoint
ALTER TABLE "bpdiary_production"."bpdiary_diary_share" ADD CONSTRAINT "bpdiary_diary_share_user_id_bpdiary_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "bpdiary_production"."bpdiary_user"("id") ON DELETE CASCADE;