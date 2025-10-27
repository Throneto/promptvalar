import { z } from 'zod';

/**
 * 创建提示词的验证schema
 */
export const createPromptSchema = z.object({
  title: z.string().min(3, '标题至少需要3个字符').max(255, '标题不能超过255个字符'),
  description: z.string().optional(),
  promptText: z.string().min(10, '提示词内容至少需要10个字符'),
  model: z.enum(['sora', 'veo', 'midjourney', 'stable-diffusion', 'dalle', 'seedream'], {
    errorMap: () => ({ message: '无效的AI模型' }),
  }),
  category: z.string().optional(),
  style: z.string().optional(),
  tags: z.array(z.string()).default([]),
  previewImageUrl: z.string().url('无效的图片URL').optional(),
  isPremium: z.boolean().default(false),
  isPublished: z.boolean().default(true),
  // 结构化数据（8要素框架）
  structured: z
    .object({
      // 核心要素
      subject: z.string().optional(),
      setting: z.string().optional(),
      action: z.string().optional(),
      
      // 摄影要素
      shotType: z.string().optional(),
      cameraMovement: z.string().optional(),
      
      // 视觉与音频
      style: z.string().optional(),
      lighting: z.string().optional(),
      audio: z.string().optional(),
      
      // 时间轴
      timeline: z.array(z.object({
        start: z.number(),
        end: z.number(),
        description: z.string(),
      })).optional(),
      
      // 约束条件
      constraints: z.string().optional(),
      
      // 传统字段
      composition: z.string().optional(),
      mood: z.array(z.string()).default([]),
      parameters: z.record(z.any()).optional(),
    })
    .optional(),
});

/**
 * 更新提示词的验证schema
 */
export const updatePromptSchema = z.object({
  title: z.string().min(3).max(255).optional(),
  description: z.string().optional(),
  promptText: z.string().min(10).optional(),
  model: z.enum(['sora', 'veo', 'midjourney', 'stable-diffusion', 'dalle', 'seedream']).optional(),
  category: z.string().optional(),
  style: z.string().optional(),
  tags: z.array(z.string()).optional(),
  previewImageUrl: z.string().url().optional(),
  isPremium: z.boolean().optional(),
  isPublished: z.boolean().optional(),
  structured: z
    .object({
      subject: z.string().optional(),
      action: z.string().optional(),
      setting: z.string().optional(),
      shotType: z.string().optional(),
      lighting: z.string().optional(),
      composition: z.string().optional(),
      mood: z.array(z.string()).optional(),
      parameters: z.record(z.any()).optional(),
    })
    .optional(),
});

/**
 * 查询提示词列表的验证schema
 */
export const queryPromptsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(12),
  model: z.string().optional(),
  category: z.string().optional(),
  style: z.string().optional(),
  tags: z.string().optional(), // 逗号分隔的标签字符串
  search: z.string().optional(), // 搜索关键词
  featured: z.coerce.boolean().optional(),
  isPremium: z.coerce.boolean().optional(),
  authorId: z.string().uuid().optional(),
  sortBy: z.enum(['createdAt', 'updatedAt', 'viewsCount', 'favoritesCount']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

/**
 * UUID 参数验证
 */
export const uuidParamSchema = z.object({
  id: z.string().uuid('无效的ID格式'),
});

