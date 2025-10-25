# 🚀 PromptValar - 提示词策略优化完整方案

> **文档版本**: v1.0  
> **创建日期**: 2025-10-25  
> **目标**: 通过数据驱动的方式持续优化提示词生成质量

---

## 📋 目录

1. [方案概述](#方案概述)
2. [核心价值](#核心价值)
3. [技术架构](#技术架构)
4. [数据库设计](#数据库设计)
5. [实施步骤](#实施步骤)
6. [代码实现](#代码实现)
7. [监控指标](#监控指标)
8. [最佳实践](#最佳实践)
9. [进阶优化](#进阶优化)

---

## 🎯 方案概述

### 问题背景

当前的提示词生成系统使用固定的策略，存在以下问题：
- ❌ 无法根据用户反馈改进
- ❌ 不同AI模型使用相同策略
- ❌ 缺乏质量监控机制
- ❌ 无法进行A/B测试
- ❌ 难以追踪生成效果

### 解决方案

构建一个**数据驱动的提示词优化系统**，实现：
- ✅ 版本化的策略管理
- ✅ 用户反馈收集和分析
- ✅ A/B测试框架
- ✅ 自动化性能监控
- ✅ AI驱动的策略优化

---

## 💎 核心价值

### 1. 持续改进
通过收集用户反馈和使用数据，持续优化提示词生成质量

### 2. 个性化
根据不同模型、风格、用户群体提供定制化策略

### 3. 数据驱动
所有优化决策基于真实数据，而非主观判断

### 4. 快速迭代
新策略可以快速部署和测试，降低试错成本

---

## 🏗️ 技术架构

```
┌─────────────────────────────────────────────────────────────┐
│                        用户层                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ 生成提示词   │  │   评分反馈   │  │   使用跟踪   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      应用服务层                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ 策略路由器   │  │  A/B测试     │  │ 反馈收集器   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      策略引擎层                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ 策略库       │  │  优化器      │  │  模板管理    │      │
│  │ (多版本)     │  │  (AI驱动)    │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      数据分析层                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ 日志记录     │  │  性能分析    │  │  模式识别    │      │
│  │              │  │              │  │  (机器学习)  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                       存储层                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ PostgreSQL   │  │   Redis      │  │  时序数据库  │      │
│  │ (主数据)     │  │  (缓存)      │  │  (监控)      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

---

## 🗄️ 数据库设计

### 1. 提示词模板表 (prompt_templates)

用于存储不同版本的提示词生成策略

```sql
CREATE TABLE prompt_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,                    -- 模板名称 (e.g., "Sora优化版v2.0")
  model VARCHAR(50) NOT NULL,                    -- 目标AI模型 (sora, midjourney, etc.)
  version VARCHAR(20) NOT NULL,                  -- 版本号 (v1.0, v1.1, v2.0)
  system_prompt TEXT NOT NULL,                   -- System提示词
  user_prompt_template TEXT NOT NULL,            -- User提示词模板（带变量）
  is_active BOOLEAN DEFAULT true,                -- 是否启用
  success_rate INTEGER DEFAULT 0,                -- 成功率 (0-100)
  avg_rating DECIMAL(3,2) DEFAULT 0.00,         -- 平均评分 (0.00-5.00)
  usage_count INTEGER DEFAULT 0,                 -- 使用次数
  metadata JSONB,                                -- 额外配置 (温度、max_tokens等)
  created_by UUID REFERENCES users(id),          -- 创建者
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- 索引
  INDEX idx_model (model),
  INDEX idx_active (is_active),
  INDEX idx_success_rate (success_rate DESC),
  
  -- 唯一约束：同一模型的同一版本只能有一个
  UNIQUE(model, version)
);
```

**字段说明**:
- `system_prompt`: AI的角色定义，例如"你是一个专业的Sora提示词工程师"
- `user_prompt_template`: 用户输入的模板，使用 `{{idea}}`, `{{style}}` 等占位符
- `metadata`: 存储如 `{"temperature": 0.7, "max_tokens": 2000}` 等配置

### 2. 提示词生成日志表 (prompt_generation_logs)

记录每次提示词生成的详细信息，用于分析和优化

```sql
CREATE TABLE prompt_generation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),             -- 用户ID
  template_id UUID REFERENCES prompt_templates(id), -- 使用的模板ID
  
  -- 输入数据
  input_idea TEXT NOT NULL,                      -- 用户输入的想法
  input_model VARCHAR(50) NOT NULL,              -- 选择的AI模型
  input_style VARCHAR(50),                       -- 选择的风格
  
  -- 输出数据
  output_prompt TEXT NOT NULL,                   -- 生成的提示词
  output_structured JSONB,                       -- 结构化数据
  
  -- 性能指标
  generation_time INTEGER,                       -- 生成耗时（毫秒）
  tokens_used INTEGER,                           -- 使用的token数
  ai_model_used VARCHAR(100),                    -- 实际使用的AI模型
  
  -- 反馈数据
  user_rating INTEGER CHECK (user_rating >= 1 AND user_rating <= 5), -- 用户评分 1-5
  is_successful BOOLEAN,                         -- 是否成功
  user_feedback TEXT,                            -- 用户文字反馈
  was_copied BOOLEAN DEFAULT false,              -- 是否被复制使用
  was_saved BOOLEAN DEFAULT false,               -- 是否被保存
  
  -- 元数据
  user_agent TEXT,                               -- 用户设备信息
  ip_address INET,                               -- IP地址（用于地域分析）
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  rated_at TIMESTAMP,                            -- 评分时间
  
  -- 索引
  INDEX idx_user_logs (user_id, created_at DESC),
  INDEX idx_template_logs (template_id, created_at DESC),
  INDEX idx_rating (user_rating),
  INDEX idx_successful (is_successful),
  INDEX idx_created_at (created_at DESC)
);
```

### 3. 提示词评分表 (prompt_ratings)

用户对已发布提示词的评分

```sql
CREATE TABLE prompt_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt_id UUID REFERENCES prompts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,                                 -- 文字反馈
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- 一个用户只能对一个提示词评分一次
  UNIQUE(prompt_id, user_id),
  
  INDEX idx_prompt_ratings (prompt_id)
);
```

### 4. A/B测试配置表 (ab_test_experiments)

管理A/B测试实验

```sql
CREATE TABLE ab_test_experiments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,                    -- 实验名称
  description TEXT,                              -- 实验描述
  model VARCHAR(50),                             -- 针对的模型
  
  -- 测试组配置
  control_template_id UUID REFERENCES prompt_templates(id), -- 对照组模板
  variant_template_id UUID REFERENCES prompt_templates(id), -- 实验组模板
  
  traffic_split INTEGER DEFAULT 50,              -- 流量分配比例 (0-100)
  
  -- 实验状态
  status VARCHAR(20) DEFAULT 'draft',            -- draft, running, paused, completed
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  
  -- 结果统计
  control_conversions INTEGER DEFAULT 0,
  variant_conversions INTEGER DEFAULT 0,
  control_samples INTEGER DEFAULT 0,
  variant_samples INTEGER DEFAULT 0,
  
  winner VARCHAR(20),                            -- control, variant, or null
  
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_status (status),
  INDEX idx_model (model)
);
```

### 5. A/B测试分配表 (ab_test_assignments)

记录用户被分配到哪个测试组

```sql
CREATE TABLE ab_test_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  experiment_id UUID REFERENCES ab_test_experiments(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  variant VARCHAR(20) NOT NULL,                  -- control 或 variant
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(experiment_id, user_id),
  INDEX idx_experiment_assignments (experiment_id, variant)
);
```

---

## 📝 实施步骤

### 阶段 1: 基础设施搭建 (第1-2周)

#### 1.1 创建数据库表

```bash
# 运行迁移脚本
cd backend
npm run db:migrate
```

#### 1.2 实现日志记录服务

创建 `backend/src/services/loggingService.ts`：

```typescript
import { db } from '../db/index.js';
import { promptGenerationLogs } from '../db/schema.js';

interface GenerationLogData {
  userId?: string;
  templateId: string;
  inputIdea: string;
  inputModel: string;
  inputStyle?: string;
  outputPrompt: string;
  outputStructured?: any;
  generationTime: number;
  tokensUsed: number;
  aiModelUsed: string;
}

export class LoggingService {
  /**
   * 记录提示词生成日志
   */
  async logGeneration(data: GenerationLogData): Promise<string> {
    const [log] = await db
      .insert(promptGenerationLogs)
      .values({
        userId: data.userId,
        templateId: data.templateId,
        inputIdea: data.inputIdea,
        inputModel: data.inputModel,
        inputStyle: data.inputStyle,
        outputPrompt: data.outputPrompt,
        outputStructured: data.outputStructured,
        generationTime: data.generationTime,
        tokensUsed: data.tokensUsed,
        aiModelUsed: data.aiModelUsed,
      })
      .returning({ id: promptGenerationLogs.id });
    
    return log.id;
  }
  
  /**
   * 记录用户反馈
   */
  async logFeedback(
    logId: string,
    rating: number,
    isSuccessful: boolean,
    feedback?: string
  ) {
    await db
      .update(promptGenerationLogs)
      .set({
        userRating: rating,
        isSuccessful,
        userFeedback: feedback,
        ratedAt: new Date(),
      })
      .where(eq(promptGenerationLogs.id, logId));
    
    // 更新模板的统计数据
    await this.updateTemplateStats(logId);
  }
  
  /**
   * 记录用户行为（复制、保存）
   */
  async logUserAction(logId: string, action: 'copy' | 'save') {
    const updates: any = {};
    
    if (action === 'copy') {
      updates.wasCopied = true;
    } else if (action === 'save') {
      updates.wasSaved = true;
    }
    
    await db
      .update(promptGenerationLogs)
      .set(updates)
      .where(eq(promptGenerationLogs.id, logId));
  }
  
  /**
   * 更新模板统计数据
   */
  private async updateTemplateStats(logId: string) {
    // 获取日志信息
    const [log] = await db
      .select()
      .from(promptGenerationLogs)
      .where(eq(promptGenerationLogs.id, logId))
      .limit(1);
    
    if (!log || !log.templateId) return;
    
    // 计算该模板的统计数据
    const stats = await db
      .select({
        avgRating: sql<number>`AVG(${promptGenerationLogs.userRating})`,
        successRate: sql<number>`
          (COUNT(CASE WHEN ${promptGenerationLogs.isSuccessful} = true THEN 1 END)::float / 
           COUNT(CASE WHEN ${promptGenerationLogs.userRating} IS NOT NULL THEN 1 END)::float * 100)`,
        usageCount: sql<number>`COUNT(*)`,
      })
      .from(promptGenerationLogs)
      .where(eq(promptGenerationLogs.templateId, log.templateId));
    
    // 更新模板表
    await db
      .update(promptTemplates)
      .set({
        avgRating: stats[0].avgRating || 0,
        successRate: Math.round(stats[0].successRate || 0),
        usageCount: stats[0].usageCount || 0,
        updatedAt: new Date(),
      })
      .where(eq(promptTemplates.id, log.templateId));
  }
}

export const loggingService = new LoggingService();
```

#### 1.3 修改AI服务集成日志

更新 `backend/src/services/aiService.ts`：

```typescript
import { loggingService } from './loggingService.js';

export async function generatePrompt(
  userIdea: string,
  targetModel: string,
  style: string,
  userId?: string
) {
  const startTime = Date.now();
  
  try {
    // 获取当前使用的模板
    const template = await getActiveTemplate(targetModel);
    
    // 构建提示词
    const systemPrompt = template.systemPrompt;
    const userPrompt = template.userPromptTemplate
      .replace('{{idea}}', userIdea)
      .replace('{{model}}', targetModel)
      .replace('{{style}}', style);
    
    // 调用AI
    const completion = await openrouter.chat.completions.create({
      model: 'anthropic/claude-3.5-sonnet',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: template.metadata?.temperature || 0.7,
    });
    
    const generatedPrompt = completion.choices[0].message.content || '';
    const generationTime = Date.now() - startTime;
    
    // 记录日志
    const logId = await loggingService.logGeneration({
      userId,
      templateId: template.id,
      inputIdea: userIdea,
      inputModel: targetModel,
      inputStyle: style,
      outputPrompt: generatedPrompt,
      generationTime,
      tokensUsed: completion.usage?.total_tokens || 0,
      aiModelUsed: 'anthropic/claude-3.5-sonnet',
    });
    
    return {
      prompt: generatedPrompt,
      logId, // 返回日志ID供前端使用
    };
  } catch (error) {
    console.error('生成失败:', error);
    throw error;
  }
}
```

---

### 阶段 2: 策略管理系统 (第3-4周)

#### 2.1 创建策略管理服务

`backend/src/services/strategyService.ts`：

```typescript
import { db } from '../db/index.js';
import { promptTemplates } from '../db/schema.js';
import { eq, and, desc } from 'drizzle-orm';

export class StrategyService {
  /**
   * 获取指定模型的活跃策略
   */
  async getActiveTemplate(model: string) {
    const [template] = await db
      .select()
      .from(promptTemplates)
      .where(
        and(
          eq(promptTemplates.model, model),
          eq(promptTemplates.isActive, true)
        )
      )
      .orderBy(desc(promptTemplates.avgRating))
      .limit(1);
    
    if (!template) {
      // 返回默认模板
      return this.getDefaultTemplate(model);
    }
    
    return template;
  }
  
  /**
   * 创建新策略版本
   */
  async createTemplate(data: {
    name: string;
    model: string;
    version: string;
    systemPrompt: string;
    userPromptTemplate: string;
    metadata?: any;
    createdBy: string;
  }) {
    const [template] = await db
      .insert(promptTemplates)
      .values({
        name: data.name,
        model: data.model,
        version: data.version,
        systemPrompt: data.systemPrompt,
        userPromptTemplate: data.userPromptTemplate,
        metadata: data.metadata,
        createdBy: data.createdBy,
        isActive: false, // 新模板默认不激活
      })
      .returning();
    
    return template;
  }
  
  /**
   * 激活指定模板（同时停用其他模板）
   */
  async activateTemplate(templateId: string, model: string) {
    // 停用该模型的所有模板
    await db
      .update(promptTemplates)
      .set({ isActive: false })
      .where(eq(promptTemplates.model, model));
    
    // 激活指定模板
    await db
      .update(promptTemplates)
      .set({ isActive: true, updatedAt: new Date() })
      .where(eq(promptTemplates.id, templateId));
  }
  
  /**
   * 获取默认模板
   */
  private getDefaultTemplate(model: string) {
    return {
      id: 'default',
      name: `${model} 默认模板`,
      model,
      version: 'v1.0',
      systemPrompt: `You are an expert prompt engineer specialized in ${model}. 
Generate professional, detailed prompts that maximize the model's capabilities.`,
      userPromptTemplate: `Generate a professional ${model} prompt for the following idea:

Idea: {{idea}}
Style: {{style}}

Create a detailed, optimized prompt that includes:
- Clear subject and action
- Specific visual details
- Appropriate technical parameters
- Style-specific elements`,
      isActive: true,
      metadata: { temperature: 0.7, max_tokens: 2000 },
    };
  }
  
  /**
   * 列出所有模板
   */
  async listTemplates(filters?: {
    model?: string;
    isActive?: boolean;
  }) {
    let query = db.select().from(promptTemplates);
    
    const conditions = [];
    if (filters?.model) {
      conditions.push(eq(promptTemplates.model, filters.model));
    }
    if (filters?.isActive !== undefined) {
      conditions.push(eq(promptTemplates.isActive, filters.isActive));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    return query.orderBy(desc(promptTemplates.createdAt));
  }
}

export const strategyService = new StrategyService();
```

#### 2.2 创建策略管理API

`backend/src/routes/strategy.routes.ts`：

```typescript
import { Router } from 'express';
import { authenticate, isAdmin } from '../middleware/auth.middleware.js';
import { strategyService } from '../services/strategyService.js';

const router = Router();

/**
 * 获取所有策略模板（管理员）
 * GET /api/v1/strategies
 */
router.get('/', authenticate, isAdmin, async (req, res, next) => {
  try {
    const { model, isActive } = req.query;
    
    const templates = await strategyService.listTemplates({
      model: model as string,
      isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
    });
    
    res.json({
      success: true,
      data: templates,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * 创建新策略模板（管理员）
 * POST /api/v1/strategies
 */
router.post('/', authenticate, isAdmin, async (req, res, next) => {
  try {
    const template = await strategyService.createTemplate({
      ...req.body,
      createdBy: req.user!.id,
    });
    
    res.status(201).json({
      success: true,
      data: template,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * 激活策略模板（管理员）
 * POST /api/v1/strategies/:id/activate
 */
router.post('/:id/activate', authenticate, isAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { model } = req.body;
    
    await strategyService.activateTemplate(id, model);
    
    res.json({
      success: true,
      message: '策略已激活',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
```

---

### 阶段 3: 用户反馈系统 (第5-6周)

#### 3.1 创建反馈API

`backend/src/routes/feedback.routes.ts`：

```typescript
import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { loggingService } from '../services/loggingService.js';
import { z } from 'zod';

const router = Router();

// 评分验证schema
const ratingSchema = z.object({
  rating: z.number().int().min(1).max(5),
  isSuccessful: z.boolean(),
  feedback: z.string().optional(),
});

/**
 * 对生成的提示词进行评分
 * POST /api/v1/feedback/generations/:logId/rate
 */
router.post('/generations/:logId/rate', authenticate, async (req, res, next) => {
  try {
    const { logId } = req.params;
    const validated = ratingSchema.parse(req.body);
    
    await loggingService.logFeedback(
      logId,
      validated.rating,
      validated.isSuccessful,
      validated.feedback
    );
    
    res.json({
      success: true,
      message: '感谢您的反馈！',
    });
  } catch (error) {
    next(error);
  }
});

/**
 * 记录用户复制提示词
 * POST /api/v1/feedback/generations/:logId/copy
 */
router.post('/generations/:logId/copy', async (req, res, next) => {
  try {
    const { logId } = req.params;
    
    await loggingService.logUserAction(logId, 'copy');
    
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

export default router;
```

#### 3.2 前端反馈组件

`frontend/src/components/PromptRating.tsx`：

```tsx
import { useState } from 'react';
import { Star, ThumbsUp, ThumbsDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PromptRatingProps {
  logId: string;
  onRated?: () => void;
}

export const PromptRating: React.FC<PromptRatingProps> = ({ logId, onRated }) => {
  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState<number>(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);
  
  const handleRate = async (value: number) => {
    setRating(value);
    setShowFeedback(true);
  };
  
  const submitFeedback = async () => {
    const token = localStorage.getItem('authToken');
    
    try {
      await fetch(`http://localhost:5000/api/v1/feedback/generations/${logId}/rate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating,
          isSuccessful: rating >= 3,
          feedback: feedback || undefined,
        }),
      });
      
      setSubmitted(true);
      onRated?.();
      
      // 3秒后隐藏
      setTimeout(() => setShowFeedback(false), 3000);
    } catch (error) {
      console.error('提交反馈失败:', error);
    }
  };
  
  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-2 text-green-400"
      >
        <ThumbsUp size={20} />
        <span>感谢您的反馈！</span>
      </motion.div>
    );
  }
  
  return (
    <div className="space-y-4">
      {/* 星级评分 */}
      <div className="flex items-center gap-3">
        <span className="text-gray-400 text-sm">这个提示词质量如何？</span>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              onClick={() => handleRate(value)}
              onMouseEnter={() => setHover(value)}
              onMouseLeave={() => setHover(0)}
              className="transition-transform hover:scale-110 focus:outline-none"
            >
              <Star
                size={24}
                fill={(hover || rating) >= value ? '#fbbf24' : 'none'}
                className={`transition-colors ${
                  (hover || rating) >= value ? 'text-yellow-400' : 'text-gray-500'
                }`}
              />
            </button>
          ))}
        </div>
        {rating > 0 && (
          <span className="text-yellow-400 font-semibold">
            {rating === 5 ? '完美!' : rating === 4 ? '很好!' : rating === 3 ? '还行' : rating === 2 ? '一般' : '需要改进'}
          </span>
        )}
      </div>
      
      {/* 反馈输入框 */}
      <AnimatePresence>
        {showFeedback && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="告诉我们更多细节（可选）..."
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 resize-none"
              rows={3}
            />
            <div className="flex gap-3">
              <button
                onClick={submitFeedback}
                className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition-all"
              >
                提交反馈
              </button>
              <button
                onClick={() => setShowFeedback(false)}
                className="px-6 py-2 bg-gray-700/50 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors"
              >
                跳过
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
```

#### 3.3 集成到Prompt Studio页面

更新 `frontend/src/pages/PromptStudioPage.tsx`：

```typescript
// 在生成结果后添加评分组件
const [generationLogId, setGenerationLogId] = useState<string | null>(null);

// 生成提示词时保存logId
const handleGenerate = async () => {
  // ... 现有代码 ...
  const data = await response.json();
  setGeneratedPrompt(data.data.prompt);
  setStructured(data.data.structured);
  setGenerationLogId(data.data.logId); // 保存日志ID
};

// 在Step 2中添加评分组件
{generationLogId && (
  <div className="mt-6 pt-6 border-t border-gray-700">
    <PromptRating logId={generationLogId} />
  </div>
)}
```

---

### 阶段 4: A/B测试系统 (第7-8周)

#### 4.1 A/B测试服务

`backend/src/services/abTestService.ts`：

```typescript
import { db } from '../db/index.js';
import { abTestExperiments, abTestAssignments, promptTemplates } from '../db/schema.js';
import { eq, and } from 'drizzle-orm';

export class ABTestService {
  /**
   * 创建新的A/B测试实验
   */
  async createExperiment(data: {
    name: string;
    description: string;
    model: string;
    controlTemplateId: string;
    variantTemplateId: string;
    trafficSplit: number;
    createdBy: string;
  }) {
    const [experiment] = await db
      .insert(abTestExperiments)
      .values({
        name: data.name,
        description: data.description,
        model: data.model,
        controlTemplateId: data.controlTemplateId,
        variantTemplateId: data.variantTemplateId,
        trafficSplit: data.trafficSplit,
        status: 'draft',
        createdBy: data.createdBy,
      })
      .returning();
    
    return experiment;
  }
  
  /**
   * 启动实验
   */
  async startExperiment(experimentId: string) {
    await db
      .update(abTestExperiments)
      .set({
        status: 'running',
        startDate: new Date(),
      })
      .where(eq(abTestExperiments.id, experimentId));
  }
  
  /**
   * 为用户分配测试组
   */
  async assignUser(
    experimentId: string,
    userId: string
  ): Promise<'control' | 'variant'> {
    // 检查是否已分配
    const [existing] = await db
      .select()
      .from(abTestAssignments)
      .where(
        and(
          eq(abTestAssignments.experimentId, experimentId),
          eq(abTestAssignments.userId, userId)
        )
      )
      .limit(1);
    
    if (existing) {
      return existing.variant as 'control' | 'variant';
    }
    
    // 获取实验配置
    const [experiment] = await db
      .select()
      .from(abTestExperiments)
      .where(eq(abTestExperiments.id, experimentId))
      .limit(1);
    
    if (!experiment || experiment.status !== 'running') {
      return 'control';
    }
    
    // 基于用户ID哈希值分配
    const hash = this.hashUserId(userId);
    const variant = hash % 100 < experiment.trafficSplit ? 'variant' : 'control';
    
    // 保存分配
    await db.insert(abTestAssignments).values({
      experimentId,
      userId,
      variant,
    });
    
    // 更新样本数
    if (variant === 'variant') {
      await db
        .update(abTestExperiments)
        .set({ variantSamples: sql`${abTestExperiments.variantSamples} + 1` })
        .where(eq(abTestExperiments.id, experimentId));
    } else {
      await db
        .update(abTestExperiments)
        .set({ controlSamples: sql`${abTestExperiments.controlSamples} + 1` })
        .where(eq(abTestExperiments.id, experimentId));
    }
    
    return variant;
  }
  
  /**
   * 获取用户应该使用的模板
   */
  async getTemplateForUser(
    model: string,
    userId?: string
  ): Promise<any> {
    // 查找正在运行的实验
    const [experiment] = await db
      .select()
      .from(abTestExperiments)
      .where(
        and(
          eq(abTestExperiments.model, model),
          eq(abTestExperiments.status, 'running')
        )
      )
      .limit(1);
    
    // 没有实验，返回默认模板
    if (!experiment || !userId) {
      return this.getActiveTemplate(model);
    }
    
    // 分配用户到测试组
    const variant = await this.assignUser(experiment.id, userId);
    
    // 返回对应的模板
    const templateId = variant === 'variant' 
      ? experiment.variantTemplateId 
      : experiment.controlTemplateId;
    
    const [template] = await db
      .select()
      .from(promptTemplates)
      .where(eq(promptTemplates.id, templateId))
      .limit(1);
    
    return template;
  }
  
  /**
   * 记录转化（用户给出好评）
   */
  async recordConversion(experimentId: string, userId: string, converted: boolean) {
    // 获取用户分组
    const [assignment] = await db
      .select()
      .from(abTestAssignments)
      .where(
        and(
          eq(abTestAssignments.experimentId, experimentId),
          eq(abTestAssignments.userId, userId)
        )
      )
      .limit(1);
    
    if (!assignment || !converted) return;
    
    // 更新转化数
    if (assignment.variant === 'variant') {
      await db
        .update(abTestExperiments)
        .set({ variantConversions: sql`${abTestExperiments.variantConversions} + 1` })
        .where(eq(abTestExperiments.id, experimentId));
    } else {
      await db
        .update(abTestExperiments)
        .set({ controlConversions: sql`${abTestExperiments.controlConversions} + 1` })
        .where(eq(abTestExperiments.id, experimentId));
    }
  }
  
  /**
   * 分析实验结果
   */
  async analyzeExperiment(experimentId: string) {
    const [experiment] = await db
      .select()
      .from(abTestExperiments)
      .where(eq(abTestExperiments.id, experimentId))
      .limit(1);
    
    if (!experiment) {
      throw new Error('实验不存在');
    }
    
    const controlRate = experiment.controlConversions / experiment.controlSamples;
    const variantRate = experiment.variantConversions / experiment.variantSamples;
    
    // 计算统计显著性（卡方检验）
    const chiSquare = this.calculateChiSquare(
      experiment.controlConversions,
      experiment.controlSamples,
      experiment.variantConversions,
      experiment.variantSamples
    );
    
    const isSignificant = chiSquare.pValue < 0.05;
    const winner = isSignificant 
      ? (variantRate > controlRate ? 'variant' : 'control')
      : null;
    
    return {
      controlRate,
      variantRate,
      improvement: ((variantRate - controlRate) / controlRate * 100).toFixed(2) + '%',
      isSignificant,
      pValue: chiSquare.pValue,
      winner,
    };
  }
  
  // 辅助方法
  private hashUserId(userId: string): number {
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      hash = ((hash << 5) - hash) + userId.charCodeAt(i);
      hash = hash & hash;
    }
    return Math.abs(hash);
  }
  
  private calculateChiSquare(
    c1: number, n1: number,
    c2: number, n2: number
  ) {
    // 简化的卡方检验实现
    const p1 = c1 / n1;
    const p2 = c2 / n2;
    const pooled = (c1 + c2) / (n1 + n2);
    
    const se = Math.sqrt(pooled * (1 - pooled) * (1/n1 + 1/n2));
    const z = (p2 - p1) / se;
    const pValue = 2 * (1 - this.normalCDF(Math.abs(z)));
    
    return { z, pValue };
  }
  
  private normalCDF(z: number): number {
    // 标准正态分布累积分布函数的近似
    const t = 1 / (1 + 0.2316419 * Math.abs(z));
    const d = 0.3989423 * Math.exp(-z * z / 2);
    const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
    return z > 0 ? 1 - p : p;
  }
  
  private async getActiveTemplate(model: string) {
    const [template] = await db
      .select()
      .from(promptTemplates)
      .where(
        and(
          eq(promptTemplates.model, model),
          eq(promptTemplates.isActive, true)
        )
      )
      .limit(1);
    
    return template;
  }
}

export const abTestService = new ABTestService();
```

---

### 阶段 5: 数据分析和自动优化 (第9-10周)

#### 5.1 性能分析服务

`backend/src/services/analyticsService.ts`：

```typescript
import { db } from '../db/index.js';
import { promptGenerationLogs, promptTemplates } from '../db/schema.js';
import { sql, eq, and, gte } from 'drizzle-orm';

export class AnalyticsService {
  /**
   * 获取模板性能报告
   */
  async getTemplatePerformance(
    templateId: string,
    days: number = 7
  ) {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    
    const stats = await db
      .select({
        totalGenerations: sql<number>`COUNT(*)`,
        avgRating: sql<number>`AVG(${promptGenerationLogs.userRating})`,
        successRate: sql<number>`
          (COUNT(CASE WHEN ${promptGenerationLogs.isSuccessful} = true THEN 1 END)::float / 
           COUNT(CASE WHEN ${promptGenerationLogs.userRating} IS NOT NULL THEN 1 END)::float * 100)`,
        avgGenerationTime: sql<number>`AVG(${promptGenerationLogs.generationTime})`,
        copyRate: sql<number>`
          (COUNT(CASE WHEN ${promptGenerationLogs.wasCopied} = true THEN 1 END)::float / 
           COUNT(*)::float * 100)`,
        saveRate: sql<number>`
          (COUNT(CASE WHEN ${promptGenerationLogs.wasSaved} = true THEN 1 END)::float / 
           COUNT(*)::float * 100)`,
        ratingDistribution: sql<any>`
          json_build_object(
            'star_1', COUNT(CASE WHEN ${promptGenerationLogs.userRating} = 1 THEN 1 END),
            'star_2', COUNT(CASE WHEN ${promptGenerationLogs.userRating} = 2 THEN 1 END),
            'star_3', COUNT(CASE WHEN ${promptGenerationLogs.userRating} = 3 THEN 1 END),
            'star_4', COUNT(CASE WHEN ${promptGenerationLogs.userRating} = 4 THEN 1 END),
            'star_5', COUNT(CASE WHEN ${promptGenerationLogs.userRating} = 5 THEN 1 END)
          )`,
      })
      .from(promptGenerationLogs)
      .where(
        and(
          eq(promptGenerationLogs.templateId, templateId),
          gte(promptGenerationLogs.createdAt, since)
        )
      );
    
    return stats[0];
  }
  
  /**
   * 比较多个模板的性能
   */
  async compareTemplates(templateIds: string[], days: number = 7) {
    const results = await Promise.all(
      templateIds.map(id => this.getTemplatePerformance(id, days))
    );
    
    return results;
  }
  
  /**
   * 分析成功提示词的共同特征
   */
  async analyzeSuccessPatterns(model: string, minRating: number = 4) {
    const successfulPrompts = await db
      .select({
        outputPrompt: promptGenerationLogs.outputPrompt,
        inputIdea: promptGenerationLogs.inputIdea,
        inputStyle: promptGenerationLogs.inputStyle,
        userRating: promptGenerationLogs.userRating,
      })
      .from(promptGenerationLogs)
      .where(
        and(
          eq(promptGenerationLogs.inputModel, model),
          gte(promptGenerationLogs.userRating, minRating)
        )
      )
      .limit(100);
    
    // 使用AI分析共同模式
    const analysis = await this.analyzeWithAI(successfulPrompts, model);
    
    return analysis;
  }
  
  /**
   * 使用AI分析提示词模式
   */
  private async analyzeWithAI(prompts: any[], model: string) {
    const promptTexts = prompts.map(p => p.outputPrompt).join('\n\n---\n\n');
    
    const completion = await openrouter.chat.completions.create({
      model: 'anthropic/claude-3.5-sonnet',
      messages: [
        {
          role: 'system',
          content: `You are a data analyst specializing in prompt engineering.
Analyze the following high-rated ${model} prompts and identify common patterns, structures, and techniques.

Focus on:
1. Common keywords and phrases
2. Structural patterns
3. Technical parameter usage
4. Descriptive techniques
5. Effective modifiers

Provide actionable insights for improving future prompts.`
        },
        {
          role: 'user',
          content: `Here are ${prompts.length} successful prompts:\n\n${promptTexts}\n\nWhat patterns do you see?`
        }
      ],
      temperature: 0.3,
    });
    
    return completion.choices[0].message.content;
  }
  
  /**
   * 生成优化建议
   */
  async generateOptimizationSuggestions(templateId: string) {
    const performance = await this.getTemplatePerformance(templateId, 30);
    
    const suggestions = [];
    
    // 基于性能数据生成建议
    if (performance.avgRating < 3.5) {
      suggestions.push({
        type: 'low_rating',
        severity: 'high',
        message: '平均评分较低，建议重新审视提示词结构和内容',
      });
    }
    
    if (performance.successRate < 70) {
      suggestions.push({
        type: 'low_success',
        severity: 'high',
        message: '成功率偏低，建议增加更多具体的技术参数和描述细节',
      });
    }
    
    if (performance.avgGenerationTime > 5000) {
      suggestions.push({
        type: 'slow_generation',
        severity: 'medium',
        message: '生成时间较长，考虑简化system prompt或调整温度参数',
      });
    }
    
    if (performance.copyRate < 40) {
      suggestions.push({
        type: 'low_usage',
        severity: 'medium',
        message: '复制率较低，用户可能觉得生成的提示词不够实用',
      });
    }
    
    return suggestions;
  }
}

export const analyticsService = new AnalyticsService();
```

#### 5.2 自动优化任务

`backend/src/jobs/optimizeStrategies.job.ts`：

```typescript
import cron from 'node-cron';
import { analyticsService } from '../services/analyticsService.js';
import { strategyService } from '../services/strategyService.js';
import { db } from '../db/index.js';
import { promptTemplates } from '../db/schema.js';
import { eq } from 'drizzle-orm';

/**
 * 每天凌晨2点运行优化任务
 */
export function startOptimizationJob() {
  cron.schedule('0 2 * * *', async () => {
    console.log('[优化任务] 开始分析策略性能...');
    
    try {
      // 1. 获取所有活跃模板
      const activeTemplates = await strategyService.listTemplates({ isActive: true });
      
      for (const template of activeTemplates) {
        console.log(`[优化任务] 分析模板: ${template.name}`);
        
        // 2. 获取性能数据
        const performance = await analyticsService.getTemplatePerformance(template.id, 7);
        
        // 3. 检查是否需要优化
        const needsOptimization = 
          performance.avgRating < 3.5 || 
          performance.successRate < 70 ||
          performance.copyRate < 40;
        
        if (needsOptimization) {
          console.log(`[优化任务] 模板 ${template.name} 需要优化`);
          
          // 4. 分析成功模式
          const patterns = await analyticsService.analyzeSuccessPatterns(template.model);
          
          // 5. 生成优化建议
          const suggestions = await analyticsService.generateOptimizationSuggestions(template.id);
          
          // 6. 使用AI生成改进版本
          const improvedPrompt = await generateImprovedPrompt(
            template,
            patterns,
            suggestions
          );
          
          // 7. 创建新版本
          const newVersion = incrementVersion(template.version);
          await strategyService.createTemplate({
            name: `${template.name} (优化版)`,
            model: template.model,
            version: newVersion,
            systemPrompt: improvedPrompt.systemPrompt,
            userPromptTemplate: improvedPrompt.userPromptTemplate,
            metadata: template.metadata,
            createdBy: 'system',
          });
          
          console.log(`[优化任务] 创建新版本: ${newVersion}`);
          
          // 8. 通知管理员
          await notifyAdmins({
            type: 'optimization_suggestion',
            template: template.name,
            performance,
            suggestions,
            newVersion,
          });
        } else {
          console.log(`[优化任务] 模板 ${template.name} 表现良好，无需优化`);
        }
      }
      
      console.log('[优化任务] 完成');
    } catch (error) {
      console.error('[优化任务] 失败:', error);
    }
  });
}

/**
 * 使用AI生成改进的提示词
 */
async function generateImprovedPrompt(
  template: any,
  patterns: string,
  suggestions: any[]
) {
  const completion = await openrouter.chat.completions.create({
    model: 'anthropic/claude-3.5-sonnet',
    messages: [
      {
        role: 'system',
        content: `You are an expert prompt engineer. Your task is to improve an existing prompt template based on:
1. Analysis of successful patterns
2. Performance data and suggestions
3. Best practices for ${template.model}

Provide improved versions of both the system prompt and user prompt template.`
      },
      {
        role: 'user',
        content: `Current template for ${template.model}:

System Prompt:
${template.systemPrompt}

User Prompt Template:
${template.userPromptTemplate}

Success Patterns Analysis:
${patterns}

Optimization Suggestions:
${suggestions.map(s => `- ${s.message}`).join('\n')}

Please provide improved versions that address these issues while maintaining the original intent.

Response format (JSON):
{
  "systemPrompt": "...",
  "userPromptTemplate": "...",
  "changes": ["list of key improvements made"]
}`
      }
    ],
    temperature: 0.7,
    response_format: { type: 'json_object' },
  });
  
  return JSON.parse(completion.choices[0].message.content || '{}');
}

/**
 * 版本号递增
 */
function incrementVersion(version: string): string {
  const parts = version.replace('v', '').split('.');
  const minor = parseInt(parts[1] || '0');
  return `v${parts[0]}.${minor + 1}`;
}

/**
 * 通知管理员
 */
async function notifyAdmins(data: any) {
  // 实现通知逻辑（邮件、Slack、系统通知等）
  console.log('[通知] 发送优化报告给管理员:', data);
  
  // TODO: 发送邮件或其他通知
}
```

---

## 📊 监控指标

### 核心指标 (KPIs)

#### 1. 质量指标

```typescript
// 平均评分 (目标: ≥ 4.0)
avgRating = SUM(ratings) / COUNT(ratings)

// 成功率 (目标: ≥ 80%)
successRate = COUNT(rating >= 3) / COUNT(total_ratings) * 100

// Net Promoter Score (目标: ≥ 50)
NPS = (COUNT(rating >= 4) - COUNT(rating <= 2)) / COUNT(total_ratings) * 100
```

#### 2. 使用指标

```typescript
// 采用率 (目标: ≥ 60%)
adoptionRate = COUNT(copied_or_saved) / COUNT(total_generations) * 100

// 留存率 (目标: ≥ 70%)
retentionRate = COUNT(users_who_returned) / COUNT(total_users) * 100
```

#### 3. 性能指标

```typescript
// 平均生成时间 (目标: ≤ 3秒)
avgGenerationTime = AVG(generation_time_ms) / 1000

// 错误率 (目标: ≤ 1%)
errorRate = COUNT(errors) / COUNT(total_requests) * 100
```

### 监控仪表板

创建 `frontend/src/pages/admin/AnalyticsDashboard.tsx`：

```tsx
import { useState, useEffect } from 'react';
import { BarChart, LineChart, PieChart } from 'recharts';

export const AnalyticsDashboard = () => {
  const [metrics, setMetrics] = useState<any>(null);
  
  useEffect(() => {
    fetchMetrics();
  }, []);
  
  const fetchMetrics = async () => {
    const response = await fetch('/api/v1/admin/analytics/overview', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    setMetrics(data.data);
  };
  
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold text-white">策略性能分析</h1>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="平均评分"
          value={metrics?.avgRating.toFixed(2)}
          target={4.0}
          icon="⭐"
          trend={metrics?.ratingTrend}
        />
        <MetricCard
          title="成功率"
          value={`${metrics?.successRate.toFixed(1)}%`}
          target={80}
          icon="✓"
          trend={metrics?.successTrend}
        />
        <MetricCard
          title="采用率"
          value={`${metrics?.adoptionRate.toFixed(1)}%`}
          target={60}
          icon="📋"
          trend={metrics?.adoptionTrend}
        />
        <MetricCard
          title="生成时间"
          value={`${metrics?.avgTime.toFixed(2)}s`}
          target={3}
          icon="⚡"
          trend={metrics?.timeTrend}
        />
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 评分分布 */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4">评分分布</h3>
          <PieChart data={metrics?.ratingDistribution} />
        </div>
        
        {/* 每日趋势 */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4">每日趋势</h3>
          <LineChart data={metrics?.dailyTrends} />
        </div>
      </div>
      
      {/* 模板对比 */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4">模板性能对比</h3>
        <BarChart data={metrics?.templateComparison} />
      </div>
    </div>
  );
};
```

---

## 🎯 最佳实践

### 1. 策略设计原则

#### ✅ 好的策略
```typescript
const goodStrategy = {
  systemPrompt: `You are an expert Sora prompt engineer with 5+ years of experience.

Your expertise includes:
- Camera movement and cinematography
- Visual storytelling techniques  
- Technical parameters for optimal output
- Style-specific vocabulary

Guidelines:
1. Be specific and detailed
2. Include camera movements
3. Specify lighting and mood
4. Add temporal elements (duration, pacing)
5. Use industry-standard terminology`,
  
  userPromptTemplate: `Create a professional Sora video prompt:

Concept: {{idea}}
Style: {{style}}

Structure your prompt with:
1. **Shot Type**: (e.g., wide shot, close-up, aerial)
2. **Subject & Action**: What is happening
3. **Setting**: Where and when
4. **Camera Movement**: (e.g., slow pan, tracking shot)
5. **Lighting**: Time of day, quality of light
6. **Mood**: Emotional tone
7. **Duration**: Approximate length
8. **Technical**: Frame rate, aspect ratio if relevant

Output a single, cohesive prompt ready to use.`,
};
```

#### ❌ 差的策略
```typescript
const badStrategy = {
  systemPrompt: `You are a prompt generator.`,
  userPromptTemplate: `Make a prompt for {{idea}} in {{style}} style.`,
};
```

**原因**：
- 缺乏具体指导
- 没有结构化输出
- 缺少专业术语
- 没有质量控制

### 2. A/B测试最佳实践

#### 测试什么？
- ✅ 不同的system prompt结构
- ✅ 用户提示词模板的变化
- ✅ 温度和其他参数
- ✅ 输出格式（结构化 vs 自由文本）

#### 何时结束测试？
```typescript
// 达到统计显著性
const minSampleSize = 100; // 每组至少100个样本
const minPValue = 0.05;    // p值小于0.05

if (
  samples >= minSampleSize && 
  pValue < minPValue &&
  Math.abs(improvement) > 5 // 至少5%的提升
) {
  // 可以结束测试并采用赢家
}
```

### 3. 数据收集建议

#### 必须收集的数据
- ✅ 用户评分（1-5星）
- ✅ 成功/失败标记
- ✅ 复制和保存行为
- ✅ 生成时间
- ✅ Token使用量

#### 可选但有用的数据
- 用户设备和浏览器
- 地理位置（用于本地化）
- 会话时长
- 返回频率

### 4. 隐私和合规

```typescript
// 数据脱敏
function anonymizeData(log: any) {
  return {
    ...log,
    userId: hashUserId(log.userId), // 哈希处理
    ipAddress: null,                 // 移除IP
    userAgent: genericizeUserAgent(log.userAgent),
  };
}

// GDPR合规：允许用户删除数据
async function deleteUserData(userId: string) {
  await db.delete(promptGenerationLogs)
    .where(eq(promptGenerationLogs.userId, userId));
}
```

---

## 🚀 进阶优化

### 1. 机器学习驱动

使用历史数据训练模型，预测最佳策略：

```python
# Python脚本 - 训练预测模型
import pandas as pd
from sklearn.ensemble import RandomForestClassifier

# 加载数据
data = pd.read_sql("SELECT * FROM prompt_generation_logs", conn)

# 特征工程
features = [
    'input_length',
    'has_technical_terms',
    'structure_score',
    'keyword_density',
    'model_type',
]

X = data[features]
y = (data['user_rating'] >= 4).astype(int)  # 成功 = 评分≥4

# 训练模型
model = RandomForestClassifier()
model.fit(X, y)

# 预测新策略的表现
prediction = model.predict_proba(new_strategy_features)
```

### 2. 个性化推荐

根据用户历史偏好定制策略：

```typescript
async function getPersonalizedTemplate(userId: string, model: string) {
  // 分析用户历史
  const userHistory = await db
    .select()
    .from(promptGenerationLogs)
    .where(eq(promptGenerationLogs.userId, userId))
    .orderBy(desc(promptGenerationLogs.userRating))
    .limit(20);
  
  // 识别用户偏好
  const preferences = analyzePreferences(userHistory);
  
  // 选择匹配的模板
  return selectTemplateByPreferences(model, preferences);
}
```

### 3. 实时优化

在生成过程中动态调整：

```typescript
async function generateWithRealTimeOptimization(
  idea: string,
  model: string,
  style: string
) {
  // 第一次生成
  let prompt = await generatePrompt(idea, model, style);
  
  // 快速质量评估
  const quality = await assessQuality(prompt);
  
  // 如果质量不佳，尝试优化
  if (quality < 0.7) {
    prompt = await optimizePrompt(prompt, model);
  }
  
  return prompt;
}
```

---

## 📚 总结

### 实施路线图

```
Week 1-2:  ✅ 基础设施（数据库、日志）
Week 3-4:  ✅ 策略管理系统
Week 5-6:  ✅ 用户反馈系统
Week 7-8:  ✅ A/B测试框架
Week 9-10: ✅ 数据分析和自动优化
Week 11+:  🚀 持续迭代和改进
```

### 预期成果

- 📈 **提示词质量提升**: 平均评分从3.5提升至4.2+
- 📈 **用户满意度提升**: NPS从30提升至60+
- 📈 **采用率提升**: 从40%提升至70%+
- 📉 **生成时间降低**: 从5秒降至2秒以内
- 🤖 **自动化运维**: 90%的优化工作自动完成

### 持续改进

这个系统的核心是**持续学习和迭代**：

1. **每日**: 自动收集数据和监控指标
2. **每周**: 分析性能趋势，识别问题
3. **每月**: A/B测试新策略，采用赢家
4. **每季度**: 重大策略升级，引入新技术

---

**文档维护**: 随着系统演进持续更新  
**反馈**: 欢迎团队成员提出改进建议

---

*版权所有 © 2025 PromptValar Team*

