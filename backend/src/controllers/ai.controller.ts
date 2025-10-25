import { Request, Response, NextFunction } from 'express';
import * as openrouterService from '../services/openrouter.service.js';
import { AppError } from '../middleware/errorHandler.js';
import { z } from 'zod';

// 验证schemas
const generatePromptSchema = z.object({
  idea: z.string().min(10, 'Idea must be at least 10 characters'),
  model: z.string(),
  style: z.string(),
});

const parsePromptSchema = z.object({
  prompt: z.string().min(10, 'Prompt must be at least 10 characters'),
  model: z.string(),
});

const suggestSchema = z.object({
  prompt: z.string().min(10, 'Prompt must be at least 10 characters'),
  model: z.string(),
});

/**
 * 生成提示词
 * POST /api/v1/ai/generate-prompt
 */
export async function generatePrompt(req: Request, res: Response, next: NextFunction) {
  try {
    // 验证请求数据
    const { idea, model, style } = generatePromptSchema.parse(req.body);

    // 调用OpenRouter服务
    const result = await openrouterService.generatePromptFromIdea(idea, model, style);

    // 记录AI使用（可选，用于成本追踪）
    // await logAIUsage(req.user?.id, model, inputTokens, outputTokens, cost);

    res.json({
      success: true,
      data: result,
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(
        new AppError(400, 'VALIDATION_ERROR', 'Invalid input data', {
          errors: error.errors,
        })
      );
    } else if (error instanceof Error) {
      next(new AppError(500, 'AI_SERVICE_ERROR', error.message));
    } else {
      next(error);
    }
  }
}

/**
 * 解析提示词
 * POST /api/v1/ai/parse-prompt
 */
export async function parsePrompt(req: Request, res: Response, next: NextFunction) {
  try {
    // 验证请求数据
    const { prompt, model } = parsePromptSchema.parse(req.body);

    // 调用OpenRouter服务
    const result = await openrouterService.parsePromptToStructured(prompt, model);

    res.json({
      success: true,
      data: result,
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(
        new AppError(400, 'VALIDATION_ERROR', 'Invalid input data', {
          errors: error.errors,
        })
      );
    } else if (error instanceof Error) {
      next(new AppError(500, 'AI_SERVICE_ERROR', error.message));
    } else {
      next(error);
    }
  }
}

/**
 * 获取改进建议
 * POST /api/v1/ai/suggest
 */
export async function suggest(req: Request, res: Response, next: NextFunction) {
  try {
    // 验证请求数据
    const { prompt, model } = suggestSchema.parse(req.body);

    // 调用OpenRouter服务
    const suggestions = await openrouterService.getSuggestions(prompt, model);

    res.json({
      success: true,
      data: { suggestions },
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(
        new AppError(400, 'VALIDATION_ERROR', 'Invalid input data', {
          errors: error.errors,
        })
      );
    } else if (error instanceof Error) {
      next(new AppError(500, 'AI_SERVICE_ERROR', error.message));
    } else {
      next(error);
    }
  }
}

