CREATE INDEX IF NOT EXISTS "favorites_user_id_idx" ON "favorites" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "favorites_prompt_id_idx" ON "favorites" ("prompt_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "favorites_user_prompt_idx" ON "favorites" ("user_id","prompt_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "prompts_author_id_idx" ON "prompts" ("author_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "prompts_model_idx" ON "prompts" ("model");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "prompts_category_idx" ON "prompts" ("category");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "prompts_is_published_idx" ON "prompts" ("is_published");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "prompts_views_count_idx" ON "prompts" ("views_count");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "prompts_favorites_count_idx" ON "prompts" ("favorites_count");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "prompts_created_at_idx" ON "prompts" ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "subscriptions_user_id_idx" ON "subscriptions" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "subscriptions_status_idx" ON "subscriptions" ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "subscriptions_stripe_sub_id_idx" ON "subscriptions" ("stripe_subscription_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "users_email_idx" ON "users" ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "users_username_idx" ON "users" ("username");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "users_role_idx" ON "users" ("role");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "users_subscription_tier_idx" ON "users" ("subscription_tier");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "users_created_at_idx" ON "users" ("created_at");