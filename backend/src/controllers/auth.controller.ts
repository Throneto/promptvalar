import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service.js';
import { registerSchema, loginSchema, refreshTokenSchema } from '../validators/auth.validator.js';
import { AppError } from '../middleware/errorHandler.js';
import { z } from 'zod';

/**
 * 用户注册控制器
 * POST /api/v1/auth/register
 */
export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    // 验证请求数据
    const validatedData = registerSchema.parse(req.body);

    // 调用注册服务
    const result = await authService.register(validatedData);

    res.status(201).json({
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
    } else {
      next(error);
    }
  }
}

/**
 * 用户登录控制器
 * POST /api/v1/auth/login
 */
export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    // 验证请求数据
    const validatedData = loginSchema.parse(req.body);

    // 调用登录服务
    const result = await authService.login(validatedData);

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
    } else {
      next(error);
    }
  }
}

/**
 * 刷新访问令牌控制器
 * POST /api/v1/auth/refresh
 */
export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    // 验证请求数据
    const { refreshToken } = refreshTokenSchema.parse(req.body);

    // 调用刷新服务
    const result = await authService.refreshAccessToken(refreshToken);

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
    } else {
      next(error);
    }
  }
}

/**
 * 登出控制器
 * POST /api/v1/auth/logout
 * 注意: JWT是无状态的,客户端应该删除token
 */
export async function logout(_req: Request, res: Response) {
  res.json({
    success: true,
    data: {
      message: 'Logged out successfully',
    },
  });
}

