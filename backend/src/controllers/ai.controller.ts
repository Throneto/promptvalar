import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/index.js';
import * as openrouterService from '../services/openrouter.service.js';
import * as subscriptionService from '../services/subscription.service.js';
import { AppError } from '../middleware/errorHandler.js';
import { z } from 'zod';

// 验证schemas
const generatePromptSchema = z.object({
  idea: z.string().min(3, 'Idea must be at least 3 characters'),
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
export async function generatePrompt(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    // 验证请求数据
    const { idea, model, style } = generatePromptSchema.parse(req.body);

    // 获取用户ID（可选，用于日志记录）
    const userId = req.user?.id;

    // 如果用户已登录，检查生成次数限制
    if (userId) {
      const limitCheck = await subscriptionService.checkGenerationLimit(userId);
      
      if (!limitCheck.allowed) {
        return res.status(403).json({
          success: false,
          error: {
            code: 'GENERATION_LIMIT_REACHED',
            message: 'You have reached your monthly generation limit. Upgrade to Pro for unlimited generations.',
            details: {
              limit: limitCheck.limit,
              used: limitCheck.used,
              remaining: limitCheck.remaining,
            },
          },
          upgradeUrl: '/pricing',
        });
      }
    }

    // 调用OpenRouter服务（包含日志记录）
    const result = await openrouterService.generatePromptFromIdea(idea, model, style, userId);

    // 返回结果，包含剩余次数信息
    const responseData: any = {
      success: true,
      data: result,
      meta: {
        timestamp: new Date().toISOString(),
      },
    };

    // 如果用户已登录，附加使用信息
    if (userId) {
      const updatedLimit = await subscriptionService.checkGenerationLimit(userId);
      responseData.usage = {
        remaining: updatedLimit.remaining,
        limit: updatedLimit.limit,
        used: updatedLimit.used,
        isPro: updatedLimit.isPro,
      };
    }

    res.json(responseData);
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
export async function parsePrompt(req: AuthRequest, res: Response, next: NextFunction) {
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
export async function suggest(req: AuthRequest, res: Response, next: NextFunction) {
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

