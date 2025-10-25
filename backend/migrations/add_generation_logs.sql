-- ================================================
-- 提示词生成日志表迁移脚本
-- 版本: MVP v1.0
-- 日期: 2025-10-25
-- 目的: 添加生成日志表用于数据收集和优化
-- ================================================

-- 创建提示词生成日志表
CREATE TABLE IF NOT EXISTS prompt_generation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  
  -- 输入数据
  input_idea TEXT NOT NULL,
  input_model VARCHAR(50) NOT NULL,
  input_style VARCHAR(50),
  
  -- 输出数据
  output_prompt TEXT NOT NULL,
  output_structured JSONB,
  
  -- 性能指标
  generation_time INTEGER,                    -- 生成耗时（毫秒）
  tokens_used INTEGER,                        -- 使用的token数
  ai_model_used VARCHAR(100),                 -- 实际使用的AI模型
  
  -- 用户反馈
  user_rating INTEGER CHECK (user_rating >= 1 AND user_rating <= 5), -- 1-5星评分
  is_successful BOOLEAN,                      -- 是否成功（评分≥3为成功）
  user_feedback TEXT,                         -- 用户文字反馈
  was_copied BOOLEAN DEFAULT false NOT NULL,  -- 是否被复制
  was_saved BOOLEAN DEFAULT false NOT NULL,   -- 是否被保存
  
  -- 时间戳
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  rated_at TIMESTAMP                          -- 评分时间
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_generation_logs_user_id 
  ON prompt_generation_logs(user_id);

CREATE INDEX IF NOT EXISTS idx_generation_logs_created_at 
  ON prompt_generation_logs(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_generation_logs_rating 
  ON prompt_generation_logs(user_rating) 
  WHERE user_rating IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_generation_logs_model 
  ON prompt_generation_logs(input_model);

CREATE INDEX IF NOT EXISTS idx_generation_logs_successful 
  ON prompt_generation_logs(is_successful) 
  WHERE is_successful IS NOT NULL;

-- 添加表注释
COMMENT ON TABLE prompt_generation_logs IS '提示词生成日志表 - 记录每次生成的详细信息用于质量分析和优化';

COMMENT ON COLUMN prompt_generation_logs.user_rating IS '用户评分 (1-5星)，用于衡量提示词质量';
COMMENT ON COLUMN prompt_generation_logs.is_successful IS '是否成功 (评分≥3为成功)';
COMMENT ON COLUMN prompt_generation_logs.generation_time IS '生成耗时（毫秒）';
COMMENT ON COLUMN prompt_generation_logs.was_copied IS '用户是否复制了这个提示词';
COMMENT ON COLUMN prompt_generation_logs.was_saved IS '用户是否保存了这个提示词';

-- 验证表创建
DO $$
BEGIN
  IF EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'prompt_generation_logs'
  ) THEN
    RAISE NOTICE '✅ 表 prompt_generation_logs 创建成功！';
  ELSE
    RAISE EXCEPTION '❌ 表 prompt_generation_logs 创建失败！';
  END IF;
END $$;

