import { Request, Response, NextFunction } from 'express';
import { db } from '../db/index.js';
import { users, subscriptions } from '../db/schema.js';
import { eq } from 'drizzle-orm';

/**
 * 订阅验证中间件
 * 用于保护需要 Pro 订阅才能访问的端点
 */

/**
 * 检查用户是否有有效的 Pro 订阅
 */
export async function requireProSubscription(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    // 获取用户信息
    const [user] = await db.select().from(users).where(eq(users.id, userId));

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // 检查用户订阅层级
    if (user.subscriptionTier === 'pro') {
      return next();
    }

    // 如果不是 Pro 用户，返回 403
    return res.status(403).json({
      success: false,
      message: 'Pro subscription required',
      upgradeUrl: '/pricing',
    });
  } catch (error) {
    console.error('Subscription middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to verify subscription',
    });
  }
}

/**
 * 检查用户是否有活跃订阅（不一定是 Pro）
 */
export async function requireActiveSubscription(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    // 获取用户的订阅信息
    const [subscription] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId));

    if (!subscription) {
      return res.status(403).json({
        success: false,
        message: 'Active subscription required',
        upgradeUrl: '/pricing',
      });
    }

    // 检查订阅状态
    if (subscription.status !== 'active') {
      return res.status(403).json({
        success: false,
        message: 'Your subscription is not active',
        status: subscription.status,
        upgradeUrl: '/pricing',
      });
    }

    // 检查订阅是否过期
    if (subscription.currentPeriodEnd && subscription.currentPeriodEnd < new Date()) {
      return res.status(403).json({
        success: false,
        message: 'Your subscription has expired',
        upgradeUrl: '/pricing',
      });
    }

    next();
  } catch (error) {
    console.error('Active subscription middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to verify subscription',
    });
  }
}

/**
 * 为请求添加订阅信息
 * 不会阻止请求，只是添加订阅信息供后续使用
 */
export async function attachSubscriptionInfo(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return next();
    }

    // 获取用户和订阅信息
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    const [subscription] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId));

    // 将订阅信息附加到请求对象
    req.subscription = {
      tier: user?.subscriptionTier || 'free',
      isPro: user?.subscriptionTier === 'pro',
      subscription: subscription || null,
    };

    next();
  } catch (error) {
    console.error('Attach subscription info error:', error);
    // 即使出错也继续，不影响主流程
    next();
  }
}

/**
 * 检查功能访问权限
 * 可以根据不同的功能设置不同的访问规则
 */
export function requireFeatureAccess(feature: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
        });
      }

      const [user] = await db.select().from(users).where(eq(users.id, userId));

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      // 定义功能访问规则
      const featureRules: Record<string, (tier: string) => boolean> = {
        'premium-prompts': (tier) => tier === 'pro',
        'advanced-models': (tier) => tier === 'pro',
        'unlimited-generations': (tier) => tier === 'pro',
        'api-access': (tier) => tier === 'pro',
        'history': (tier) => tier === 'pro',
        'basic-prompts': () => true, // 所有用户都可访问
      };

      const rule = featureRules[feature];
      if (!rule) {
        // 如果没有定义规则，默认需要 Pro
        if (user.subscriptionTier !== 'pro') {
          return res.status(403).json({
            success: false,
            message: `Pro subscription required for feature: ${feature}`,
            upgradeUrl: '/pricing',
          });
        }
      } else if (!rule(user.subscriptionTier)) {
        return res.status(403).json({
          success: false,
          message: `Insufficient permissions for feature: ${feature}`,
          upgradeUrl: '/pricing',
        });
      }

      next();
    } catch (error) {
      console.error('Feature access middleware error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to verify feature access',
      });
    }
  };
}

/**
 * 速率限制基于订阅层级
 * Pro 用户有更高的速率限制
 */
export function getRateLimitForUser(tier: string): number {
  const limits: Record<string, number> = {
    free: 20, // 每 15 分钟 20 次请求
    pro: 1000, // 每 15 分钟 1000 次请求
  };

  return limits[tier] || limits.free;
}

// 类型扩展
declare global {
  namespace Express {
    interface Request {
      subscription?: {
        tier: string;
        isPro: boolean;
        subscription: any;
      };
    }
  }
}

