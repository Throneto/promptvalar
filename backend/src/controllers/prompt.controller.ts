import { Request, Response, NextFunction } from 'express';
import * as promptService from '../services/prompt.service.js';
import {
  createPromptSchema,
  updatePromptSchema,
  queryPromptsSchema,
  uuidParamSchema,
} from '../validators/prompt.validator.js';
import { AppError } from '../middleware/errorHandler.js';
import { z } from 'zod';

/**
 * 创建新提示词
 * POST /api/v1/prompts
 */
export async function createPrompt(req: Request, res: Response, next: NextFunction) {
  try {
    // 验证请求数据
    const validatedData = createPromptSchema.parse(req.body);

    // 获取当前用户ID（从认证中间件设置）
    const authorId = req.user?.id;
    if (!authorId) {
      throw new AppError(401, 'UNAUTHORIZED', '请先登录');
    }

    // 创建提示词
    const prompt = await promptService.createPrompt({
      ...validatedData,
      authorId,
    });

    res.status(201).json({
      success: true,
      data: prompt,
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(
        new AppError(400, 'VALIDATION_ERROR', '输入数据无效', {
          errors: error.errors,
        })
      );
    } else {
      next(error);
    }
  }
}

/**
 * 获取提示词列表（带分页和过滤）
 * GET /api/v1/prompts
 */
export async function getPrompts(req: Request, res: Response, next: NextFunction) {
  try {
    // 验证查询参数
    const validatedQuery = queryPromptsSchema.parse(req.query);

    // 处理标签（从逗号分隔字符串转为数组）
    const tags = validatedQuery.tags ? validatedQuery.tags.split(',').map((t) => t.trim()) : undefined;

    // 查询提示词列表
    const result = await promptService.getPrompts({
      ...validatedQuery,
      tags,
    });

    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(
        new AppError(400, 'VALIDATION_ERROR', '查询参数无效', {
          errors: error.errors,
        })
      );
    } else {
      next(error);
    }
  }
}

/**
 * 根据ID获取单个提示词详情
 * GET /api/v1/prompts/:id
 */
export async function getPromptById(req: Request, res: Response, next: NextFunction) {
  try {
    // 验证参数
    const { id } = uuidParamSchema.parse(req.params);

    // 获取当前用户ID（可选，用于判断是否收藏）
    const userId = req.user?.id;

    // 查询提示词详情
    const prompt = await promptService.getPromptById(id, userId);

    res.status(200).json({
      success: true,
      data: prompt,
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(
        new AppError(400, 'VALIDATION_ERROR', '无效的ID格式', {
          errors: error.errors,
        })
      );
    } else {
      next(error);
    }
  }
}

/**
 * 更新提示词
 * PUT /api/v1/prompts/:id
 */
export async function updatePrompt(req: Request, res: Response, next: NextFunction) {
  try {
    // 验证参数
    const { id } = uuidParamSchema.parse(req.params);

    // 验证请求数据
    const validatedData = updatePromptSchema.parse(req.body);

    // 获取当前用户ID
    const authorId = req.user?.id;
    if (!authorId) {
      throw new AppError(401, 'UNAUTHORIZED', '请先登录');
    }

    // 更新提示词
    const prompt = await promptService.updatePrompt(id, authorId, validatedData);

    res.status(200).json({
      success: true,
      data: prompt,
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(
        new AppError(400, 'VALIDATION_ERROR', '输入数据无效', {
          errors: error.errors,
        })
      );
    } else {
      next(error);
    }
  }
}

/**
 * 删除提示词
 * DELETE /api/v1/prompts/:id
 */
export async function deletePrompt(req: Request, res: Response, next: NextFunction) {
  try {
    // 验证参数
    const { id } = uuidParamSchema.parse(req.params);

    // 获取当前用户ID
    const authorId = req.user?.id;
    if (!authorId) {
      throw new AppError(401, 'UNAUTHORIZED', '请先登录');
    }

    // 删除提示词
    const result = await promptService.deletePrompt(id, authorId);

    res.status(200).json({
      success: true,
      data: result,
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(
        new AppError(400, 'VALIDATION_ERROR', '无效的ID格式', {
          errors: error.errors,
        })
      );
    } else {
      next(error);
    }
  }
}

/**
 * 添加/取消收藏
 * POST /api/v1/prompts/:id/favorite
 */
export async function toggleFavorite(req: Request, res: Response, next: NextFunction) {
  try {
    // 验证参数
    const { id } = uuidParamSchema.parse(req.params);

    // 获取当前用户ID
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError(401, 'UNAUTHORIZED', '请先登录');
    }

    // 切换收藏状态
    const result = await promptService.toggleFavorite(id, userId);

    res.status(200).json({
      success: true,
      data: result,
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(
        new AppError(400, 'VALIDATION_ERROR', '无效的ID格式', {
          errors: error.errors,
        })
      );
    } else {
      next(error);
    }
  }
}

/**
 * 获取用户收藏的提示词列表
 * GET /api/v1/prompts/favorites/me
 */
export async function getUserFavorites(req: Request, res: Response, next: NextFunction) {
  try {
    // 获取当前用户ID
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError(401, 'UNAUTHORIZED', '请先登录');
    }

    // 获取分页参数
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;

    // 查询收藏列表
    const result = await promptService.getUserFavorites(userId, page, limit);

    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
}

