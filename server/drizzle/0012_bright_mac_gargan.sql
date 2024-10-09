ALTER TABLE "two_factor_tokens" DROP CONSTRAINT "two_factor_tokens_userID_user_id_fk";
--> statement-breakpoint
ALTER TABLE "two_factor_tokens" DROP COLUMN IF EXISTS "userID";