import { Request, Response } from 'express';
import * as subscriptionService from '../services/subscription.service.js';

/**
 * 获取订阅计划信息
 */
export async function getPlans(req: Request, res: Response) {
  try {
    res.json({
      success: true,
      plans: subscriptionService.SUBSCRIPTION_PLANS,
    });
  } catch (error) {
    console.error('Get plans error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get subscription plans',
    });
  }
}

/**
 * 获取当前用户的订阅信息
 */
export async function getCurrentSubscription(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const subscription = await subscriptionService.getUserSubscription(userId);

    res.json({
      success: true,
      subscription,
    });
  } catch (error) {
    console.error('Get subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get subscription',
    });
  }
}

/**
 * 创建 Checkout Session
 */
export async function createCheckout(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const { priceId } = req.body;
    if (!priceId) {
      return res.status(400).json({
        success: false,
        message: 'Price ID is required',
      });
    }

    const session = await subscriptionService.createCheckoutSession(userId, priceId);

    res.json({
      success: true,
      sessionId: session.id,
      url: session.url,
      testMode: session.testMode,
    });
  } catch (error) {
    console.error('Create checkout error:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    console.error('Error message:', error instanceof Error ? error.message : String(error));
    res.status(500).json({
      success: false,
      message: 'Failed to create checkout session',
      error: process.env.NODE_ENV === 'development' ? error : undefined,
    });
  }
}

/**
 * 创建 Portal Session (管理订阅)
 */
export async function createPortal(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const session = await subscriptionService.createPortalSession(userId);

    res.json({
      success: true,
      url: session.url,
      testMode: session.testMode,
    });
  } catch (error) {
    console.error('Create portal error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create portal session',
    });
  }
}

/**
 * 取消订阅
 */
export async function cancelSubscription(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const { immediate } = req.body;
    const result = await subscriptionService.cancelSubscription(userId, immediate);

    res.json({
      success: true,
      message: immediate
        ? 'Subscription cancelled immediately'
        : 'Subscription will be cancelled at period end',
      testMode: result.testMode,
    });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel subscription',
    });
  }
}

/**
 * 恢复订阅
 */
export async function resumeSubscription(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const result = await subscriptionService.resumeSubscription(userId);

    res.json({
      success: true,
      message: 'Subscription resumed',
      testMode: result.testMode,
    });
  } catch (error) {
    console.error('Resume subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to resume subscription',
    });
  }
}

/**
 * Stripe Webhook 处理器
 */
export async function handleWebhook(req: Request, res: Response) {
  try {
    const signature = req.headers['stripe-signature'];
    if (!signature || typeof signature !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Missing stripe signature',
      });
    }

    await subscriptionService.handleWebhookEvent(
      req.body,
      req.body,
      signature
    );

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).json({
      success: false,
      message: 'Webhook handling failed',
    });
  }
}

/**
 * 测试模式：激活订阅
 * 仅在开发环境使用
 */
export async function testModeActivate(req: Request, res: Response) {
  try {
    if (process.env.STRIPE_TEST_MODE !== 'true') {
      return res.status(403).json({
        success: false,
        message: 'Test mode is not enabled',
      });
    }

    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const result = await subscriptionService.testModeActivateSubscription(userId);

    res.json(result);
  } catch (error) {
    console.error('Test mode activate error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to activate test subscription',
    });
  }
}

/**
 * 检查订阅访问权限
 */
export async function checkAccess(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const { feature } = req.query;
    if (!feature || typeof feature !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Feature parameter is required',
      });
    }

    const hasAccess = await subscriptionService.checkSubscriptionAccess(
      userId,
      feature
    );

    res.json({
      success: true,
      hasAccess,
      feature,
    });
  } catch (error) {
    console.error('Check access error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check access',
    });
  }
}

