ALTER TABLE "two_factor_tokens" RENAME COLUMN "userId" TO "userID";--> statement-breakpoint
ALTER TABLE "two_factor_tokens" DROP CONSTRAINT "two_factor_tokens_userId_user_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "two_factor_tokens" ADD CONSTRAINT "two_factor_tokens_userID_user_id_fk" FOREIGN KEY ("userID") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;