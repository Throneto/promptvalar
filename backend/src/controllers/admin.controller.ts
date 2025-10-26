import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/index.js';
import * as adminService from '../services/admin.service.js';
import { AppError } from '../middleware/errorHandler.js';

/**
 * 获取仪表板统计数据
 * GET /api/v1/admin/dashboard/stats
 */
export async function getDashboardStats(
  _req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const stats = await adminService.getDashboardStats();

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 获取用户增长数据
 * GET /api/v1/admin/dashboard/user-growth
 */
export async function getUserGrowth(
  _req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const growthData = await adminService.getUserGrowthData();

    res.json({
      success: true,
      data: growthData,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 获取热门提示词
 * GET /api/v1/admin/dashboard/top-prompts
 */
export async function getTopPrompts(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const topPrompts = await adminService.getTopPrompts(limit);

    res.json({
      success: true,
      data: topPrompts,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 获取用户列表
 * GET /api/v1/admin/users
 */
export async function getUsers(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = req.query.search as string;
    const role = req.query.role as 'user' | 'admin' | undefined;
    const isActive = req.query.isActive === 'true' ? true : req.query.isActive === 'false' ? false : undefined;
    const subscriptionTier = req.query.subscriptionTier as 'free' | 'pro' | undefined;

    const result = await adminService.getUsers({
      page,
      limit,
      search,
      role,
      isActive,
      subscriptionTier,
    });

    res.json({
      success: true,
      data: result.users,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 获取用户详情
 * GET /api/v1/admin/users/:id
 */
export async function getUserDetail(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.params.id;
    const user = await adminService.getUserDetail(userId);

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 更新用户
 * PUT /api/v1/admin/users/:id
 */
export async function updateUser(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) {
      throw new AppError(401, 'UNAUTHORIZED', 'Authentication required');
    }

    const userId = req.params.id;
    const { username, email, role, subscriptionTier, isActive } = req.body;

    // 验证输入
    if (role && !['user', 'admin'].includes(role)) {
      throw new AppError(400, 'INVALID_ROLE', 'Invalid role value');
    }

    if (subscriptionTier && !['free', 'pro'].includes(subscriptionTier)) {
      throw new AppError(400, 'INVALID_TIER', 'Invalid subscription tier');
    }

    const updatedUser = await adminService.updateUser(
      req.user.id,
      userId,
      { username, email, role, subscriptionTier, isActive },
      req.ip,
      req.get('user-agent')
    );

    res.json({
      success: true,
      data: updatedUser,
      message: 'User updated successfully',
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 重置用户密码
 * POST /api/v1/admin/users/:id/reset-password
 */
export async function resetUserPassword(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) {
      throw new AppError(401, 'UNAUTHORIZED', 'Authentication required');
    }

    const userId = req.params.id;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 8) {
      throw new AppError(400, 'INVALID_PASSWORD', 'Password must be at least 8 characters');
    }

    await adminService.resetUserPassword(
      req.user.id,
      userId,
      newPassword,
      req.ip,
      req.get('user-agent')
    );

    res.json({
      success: true,
      message: 'Password reset successfully',
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 删除用户
 * DELETE /api/v1/admin/users/:id
 */
export async function deleteUser(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) {
      throw new AppError(401, 'UNAUTHORIZED', 'Authentication required');
    }

    const userId = req.params.id;

    // 防止删除自己
    if (userId === req.user.id) {
      throw new AppError(400, 'CANNOT_DELETE_SELF', 'Cannot delete your own account');
    }

    await adminService.deleteUser(
      req.user.id,
      userId,
      req.ip,
      req.get('user-agent')
    );

    res.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 获取提示词列表
 * GET /api/v1/admin/prompts
 */
export async function getPrompts(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = req.query.search as string;
    const model = req.query.model as string;
    const isPublished = req.query.isPublished === 'true' ? true : req.query.isPublished === 'false' ? false : undefined;

    const result = await adminService.getPrompts({
      page,
      limit,
      search,
      model,
      isPublished,
    });

    res.json({
      success: true,
      data: result.prompts,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 更新提示词
 * PUT /api/v1/admin/prompts/:id
 */
export async function updatePrompt(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) {
      throw new AppError(401, 'UNAUTHORIZED', 'Authentication required');
    }

    const promptId = req.params.id;
    const { title, description, isPublished, isPremium } = req.body;

    const updatedPrompt = await adminService.updatePrompt(
      req.user.id,
      promptId,
      { title, description, isPublished, isPremium },
      req.ip,
      req.get('user-agent')
    );

    res.json({
      success: true,
      data: updatedPrompt,
      message: 'Prompt updated successfully',
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 删除提示词
 * DELETE /api/v1/admin/prompts/:id
 */
export async function deletePrompt(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) {
      throw new AppError(401, 'UNAUTHORIZED', 'Authentication required');
    }

    const promptId = req.params.id;

    await adminService.deletePrompt(
      req.user.id,
      promptId,
      req.ip,
      req.get('user-agent')
    );

    res.json({
      success: true,
      message: 'Prompt deleted successfully',
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 获取管理员操作日志
 * GET /api/v1/admin/logs
 */
export async function getAdminLogs(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const adminId = req.query.adminId as string;
    const action = req.query.action as string;

    const result = await adminService.getAdminLogs({
      page,
      limit,
      adminId,
      action,
    });

    res.json({
      success: true,
      data: result.logs,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
}

