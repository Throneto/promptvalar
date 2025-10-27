-- 8要素框架迁移 - 扩展 structured_prompts 表
-- Migration: Add fields for 8-element framework optimization
-- Date: 2025-10-27
-- Purpose: Support director-style video generation with comprehensive structured data

-- 添加新字段到 structured_prompts 表
ALTER TABLE "structured_prompts" ADD COLUMN IF NOT EXISTS "camera_movement" varchar(100);--> statement-breakpoint
ALTER TABLE "structured_prompts" ADD COLUMN IF NOT EXISTS "style" text;--> statement-breakpoint
ALTER TABLE "structured_prompts" ADD COLUMN IF NOT EXISTS "audio" text;--> statement-breakpoint
ALTER TABLE "structured_prompts" ADD COLUMN IF NOT EXISTS "timeline" jsonb;--> statement-breakpoint
ALTER TABLE "structured_prompts" ADD COLUMN IF NOT EXISTS "constraints" text;--> statement-breakpoint

-- 添加注释以说明各字段用途
COMMENT ON COLUMN "structured_prompts"."subject" IS '要素1: Subject - 主题，主角及其特征';--> statement-breakpoint
COMMENT ON COLUMN "structured_prompts"."setting" IS '要素2: Setting - 环境，场景、时间、天气、氛围';--> statement-breakpoint
COMMENT ON COLUMN "structured_prompts"."action" IS '要素3: Action - 动作，具体连续的动作描述';--> statement-breakpoint
COMMENT ON COLUMN "structured_prompts"."shot_type" IS '要素4a: Camera/Shot Type - 镜头类型';--> statement-breakpoint
COMMENT ON COLUMN "structured_prompts"."camera_movement" IS '要素4b: Camera Movement - 镜头运动（tracking, dolly, crane等）';--> statement-breakpoint
COMMENT ON COLUMN "structured_prompts"."style" IS '要素5: Style - 视觉风格，美学风格、色调';--> statement-breakpoint
COMMENT ON COLUMN "structured_prompts"."lighting" IS '要素5 (子元素): Lighting - 光线条件';--> statement-breakpoint
COMMENT ON COLUMN "structured_prompts"."audio" IS '要素6: Audio - 音效，对话、音效、配乐（Veo特别重要）';--> statement-breakpoint
COMMENT ON COLUMN "structured_prompts"."timeline" IS '要素7: Timeline - 时间轴，多场景视频的时间规划，格式: [{"start": 0, "end": 3, "description": "..."}]';--> statement-breakpoint
COMMENT ON COLUMN "structured_prompts"."constraints" IS '要素8: Constraints - 约束条件，物理约束、负面提示词';--> statement-breakpoint

-- 更新表注释
COMMENT ON TABLE "structured_prompts" IS '结构化提示词表 (8要素框架) - 基于导演式视频生成优化理论';

