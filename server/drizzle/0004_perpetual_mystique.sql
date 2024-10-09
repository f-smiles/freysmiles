ALTER TABLE "email_tokens" DROP CONSTRAINT "email_tokens_userID_user_id_fk";
--> statement-breakpoint
ALTER TABLE "email_tokens" DROP COLUMN IF EXISTS "userID";