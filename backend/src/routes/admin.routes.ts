import { Router } from 'express';
import { authenticate, requireAdmin } from '../middleware/auth.middleware.js';
import * as adminController from '../controllers/admin.controller.js';

const router = Router();

// 所有管理员路由都需要认证和管理员权限
router.use(authenticate, requireAdmin);

// ========================================
// 仪表板统计
// ========================================

/**
 * GET /api/v1/admin/dashboard/stats
 * 获取平台总体统计数据
 */
router.get('/dashboard/stats', adminController.getDashboardStats);

/**
 * GET /api/v1/admin/dashboard/user-growth
 * 获取用户增长数据
 */
router.get('/dashboard/user-growth', adminController.getUserGrowth);

/**
 * GET /api/v1/admin/dashboard/top-prompts
 * 获取热门提示词
 */
router.get('/dashboard/top-prompts', adminController.getTopPrompts);

// ========================================
// 用户管理
// ========================================

/**
 * GET /api/v1/admin/users
 * 获取用户列表（支持分页、搜索、筛选）
 */
router.get('/users', adminController.getUsers);

/**
 * GET /api/v1/admin/users/:id
 * 获取用户详情
 */
router.get('/users/:id', adminController.getUserDetail);

/**
 * PUT /api/v1/admin/users/:id
 * 更新用户信息
 */
router.put('/users/:id', adminController.updateUser);

/**
 * POST /api/v1/admin/users/:id/reset-password
 * 重置用户密码
 */
router.post('/users/:id/reset-password', adminController.resetUserPassword);

/**
 * DELETE /api/v1/admin/users/:id
 * 删除用户（禁用账户）
 */
router.delete('/users/:id', adminController.deleteUser);

// ========================================
// 提示词管理
// ========================================

/**
 * GET /api/v1/admin/prompts
 * 获取提示词列表（支持分页、搜索、筛选）
 */
router.get('/prompts', adminController.getPrompts);

/**
 * PUT /api/v1/admin/prompts/:id
 * 更新提示词
 */
router.put('/prompts/:id', adminController.updatePrompt);

/**
 * DELETE /api/v1/admin/prompts/:id
 * 删除提示词
 */
router.delete('/prompts/:id', adminController.deletePrompt);

// ========================================
// 审计日志
// ========================================

/**
 * GET /api/v1/admin/logs
 * 获取管理员操作日志
 */
router.get('/logs', adminController.getAdminLogs);

export default router;

