CREATE TABLE IF NOT EXISTS "email_tokens" (
	"id" text NOT NULL,
	"userID" text,
	"email" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "email_tokens_id_token_pk" PRIMARY KEY("id","token")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "email_tokens" ADD CONSTRAINT "email_tokens_userID_user_id_fk" FOREIGN KEY ("userID") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
