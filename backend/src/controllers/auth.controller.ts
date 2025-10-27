import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service.js';
import { registerSchema, loginSchema, refreshTokenSchema, updateProfileSchema, changePasswordSchema } from '../validators/auth.validator.js';
import { AppError } from '../middleware/errorHandler.js';
import { AuthRequest } from '../types/index.js';
import { z } from 'zod';

/**
 * 用户注册控制器
 * POST /api/v1/auth/register
 */
export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    // 验证请求数据
    const validatedData = registerSchema.parse(req.body) as Parameters<typeof authService.register>[0];

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
    const validatedData = loginSchema.parse(req.body) as Parameters<typeof authService.login>[0];

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

/**
 * 更新用户资料控制器
 * PUT /api/v1/auth/profile
 */
export async function updateProfile(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    // 验证请求数据
    const validatedData = updateProfileSchema.parse(req.body);

    // 获取当前用户ID
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError(401, 'UNAUTHORIZED', '请先登录');
    }

    // 更新用户资料
    const updatedUser = await authService.updateProfile(userId, validatedData);

    res.status(200).json({
      success: true,
      data: updatedUser,
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
 * 更改密码控制器
 * PUT /api/v1/auth/password
 */
export async function changePassword(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    // 验证请求数据
    const { currentPassword, newPassword } = changePasswordSchema.parse(req.body);

    // 获取当前用户ID
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError(401, 'UNAUTHORIZED', '请先登录');
    }

    // 更改密码
    const result = await authService.changePassword(userId, currentPassword, newPassword);

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
        new AppError(400, 'VALIDATION_ERROR', 'Invalid input data', {
          errors: error.errors,
        })
      );
    } else {
      next(error);
    }
  }
}

