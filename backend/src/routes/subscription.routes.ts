import express from 'express';
import * as subscriptionController from '../controllers/subscription.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

/**
 * 公开端点
 */

// 获取订阅计划信息
router.get('/plans', subscriptionController.getPlans);

/**
 * Webhook 端点（不需要认证，但需要 Stripe 签名验证）
 * 注意：这个端点需要使用 express.raw() 而不是 express.json()
 */
router.post('/webhook', subscriptionController.handleWebhook);

/**
 * 需要认证的端点
 */

// 获取当前用户的订阅信息
router.get('/current', authenticate, subscriptionController.getCurrentSubscription);

// 创建 Checkout Session (购买订阅)
router.post('/checkout', authenticate, subscriptionController.createCheckout);

// 创建 Portal Session (管理订阅)
router.post('/portal', authenticate, subscriptionController.createPortal);

// 取消订阅
router.post('/cancel', authenticate, subscriptionController.cancelSubscription);

// 恢复订阅
router.post('/resume', authenticate, subscriptionController.resumeSubscription);

// 检查功能访问权限
router.get('/check-access', authenticate, subscriptionController.checkAccess);

// 获取用户使用统计信息（生成次数等）
router.get('/usage-stats', authenticate, subscriptionController.getUsageStats);

/**
 * 测试模式端点（仅在开发环境）
 */
if (process.env.STRIPE_TEST_MODE === 'true') {
  // 测试模式：激活 Pro 订阅
  router.post('/test/activate', authenticate, subscriptionController.testModeActivate);
}

export default router;

