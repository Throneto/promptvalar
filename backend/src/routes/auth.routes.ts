import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

/**
 * 认证路由
 * Base path: /api/v1/auth
 */

// 用户注册
router.post('/register', authController.register);

// 用户登录
router.post('/login', authController.login);

// 刷新访问令牌
router.post('/refresh', authController.refresh);

// 用户登出
router.post('/logout', authController.logout);

// 需要认证的路由
router.put('/profile', authenticate, authController.updateProfile);
router.put('/password', authenticate, authController.changePassword);

export default router;

