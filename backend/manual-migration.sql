-- Phase 5 数据库迁移 - 管理员系统和性能优化

-- 创建管理员操作日志表
CREATE TABLE IF NOT EXISTS "admin_action_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"admin_id" uuid NOT NULL,
	"action" varchar(100) NOT NULL,
	"target_type" varchar(50),
	"target_id" uuid,
	"details" jsonb,
	"ip_address" varchar(45),
	"user_agent" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);

-- 为 users 表添加新字段
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "role" varchar(20) DEFAULT 'user' NOT NULL;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "is_active" boolean DEFAULT true NOT NULL;

-- 创建索引 - favorites 表
CREATE INDEX IF NOT EXISTS "favorites_user_id_idx" ON "favorites" ("user_id");
CREATE INDEX IF NOT EXISTS "favorites_prompt_id_idx" ON "favorites" ("prompt_id");
CREATE INDEX IF NOT EXISTS "favorites_user_prompt_idx" ON "favorites" ("user_id","prompt_id");

-- 创建索引 - prompts 表
CREATE INDEX IF NOT EXISTS "prompts_author_id_idx" ON "prompts" ("author_id");
CREATE INDEX IF NOT EXISTS "prompts_model_idx" ON "prompts" ("model");
CREATE INDEX IF NOT EXISTS "prompts_category_idx" ON "prompts" ("category");
CREATE INDEX IF NOT EXISTS "prompts_is_published_idx" ON "prompts" ("is_published");
CREATE INDEX IF NOT EXISTS "prompts_views_count_idx" ON "prompts" ("views_count");
CREATE INDEX IF NOT EXISTS "prompts_favorites_count_idx" ON "prompts" ("favorites_count");
CREATE INDEX IF NOT EXISTS "prompts_created_at_idx" ON "prompts" ("created_at");

-- 创建索引 - subscriptions 表
CREATE INDEX IF NOT EXISTS "subscriptions_user_id_idx" ON "subscriptions" ("user_id");
CREATE INDEX IF NOT EXISTS "subscriptions_status_idx" ON "subscriptions" ("status");
CREATE INDEX IF NOT EXISTS "subscriptions_stripe_sub_id_idx" ON "subscriptions" ("stripe_subscription_id");

-- 创建索引 - users 表
CREATE INDEX IF NOT EXISTS "users_email_idx" ON "users" ("email");
CREATE INDEX IF NOT EXISTS "users_username_idx" ON "users" ("username");
CREATE INDEX IF NOT EXISTS "users_role_idx" ON "users" ("role");
CREATE INDEX IF NOT EXISTS "users_subscription_tier_idx" ON "users" ("subscription_tier");
CREATE INDEX IF NOT EXISTS "users_created_at_idx" ON "users" ("created_at");

-- 添加外键约束
DO $$ BEGIN
 ALTER TABLE "admin_action_logs" ADD CONSTRAINT "admin_action_logs_admin_id_users_id_fk" FOREIGN KEY ("admin_id") REFERENCES "users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

