import Stripe from 'stripe';
import { db } from '../db/index.js';
import { subscriptions, users, promptGenerationLogs } from '../db/schema.js';
import { eq, and, gte, sql } from 'drizzle-orm';

/**
 * 订阅服务
 * 处理所有与 Stripe 和订阅管理相关的业务逻辑
 */

// 初始化 Stripe（如果不在测试模式）
const isTestMode = process.env.STRIPE_TEST_MODE === 'true';
let stripe: Stripe | null = null;

if (!isTestMode && process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-09-30.clover',
  });
}

/**
 * 订阅计划配置
 */
export const SUBSCRIPTION_PLANS = {
  free: {
    name: 'Free',
    price: 0,
    features: [
      '20 AI generations per month',
      'Access basic prompt library',
      'Basic model support',
      'Community support',
    ],
    limits: {
      aiGenerationsPerMonth: 20,
      premiumPromptsAccess: false,
      advancedModels: false,
    },
  },
  pro: {
    name: 'Pro',
    price: 15.99,
    priceId: process.env.STRIPE_PRO_PRICE_ID || 'price_test_pro',
    features: [
      'Unlimited AI generations',
      'Access all premium prompts',
      'All AI models support',
      'Priority customer support',
      'Advanced editor features',
      'Prompt history',
    ],
    limits: {
      aiGenerationsPerMonth: -1, // unlimited
      premiumPromptsAccess: true,
      advancedModels: true,
    },
  },
};

/**
 * 创建 Stripe Checkout Session
 */
export async function createCheckoutSession(userId: string, priceId: string) {
  if (isTestMode) {
    // 测试模式：返回模拟的 checkout session
    return {
      id: `cs_test_${Date.now()}`,
      url: `http://localhost:5173/subscription/success?session_id=cs_test_${Date.now()}`,
      testMode: true,
    };
  }

  if (!stripe) {
    throw new Error('Stripe is not initialized');
  }

  // 获取用户信息
  const [user] = await db.select().from(users).where(eq(users.id, userId));
  if (!user) {
    throw new Error('User not found');
  }

  // 创建或获取 Stripe Customer
  let customerId = user.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: {
        userId: user.id,
      },
    });
    customerId = customer.id;

    // 更新用户的 Stripe Customer ID
    await db
      .update(users)
      .set({ stripeCustomerId: customerId })
      .where(eq(users.id, userId));
  }

  // 创建 Checkout Session
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${process.env.CORS_ORIGIN}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.CORS_ORIGIN}/pricing?cancelled=true`,
    metadata: {
      userId,
    },
  });

  return {
    id: session.id,
    url: session.url,
    testMode: false,
  };
}

/**
 * 创建 Stripe Billing Portal Session
 */
export async function createPortalSession(userId: string) {
  if (isTestMode) {
    // 测试模式：返回模拟的 portal session
    return {
      url: `http://localhost:5173/dashboard/subscription`,
      testMode: true,
    };
  }

  if (!stripe) {
    throw new Error('Stripe is not initialized');
  }

  const [user] = await db.select().from(users).where(eq(users.id, userId));
  if (!user || !user.stripeCustomerId) {
    throw new Error('No Stripe customer found');
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${process.env.CORS_ORIGIN}/dashboard/subscription`,
  });

  return {
    url: session.url,
    testMode: false,
  };
}

/**
 * 获取用户的当前订阅
 */
export async function getUserSubscription(userId: string) {
  const [subscription] = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId))
    .orderBy(subscriptions.createdAt);

  return subscription || null;
}

/**
 * 创建或更新订阅
 */
export async function createOrUpdateSubscription(data: {
  userId: string;
  planType: string;
  status: string;
  stripeSubscriptionId?: string;
  stripeCustomerId?: string;
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
}) {
  const existingSubscription = await getUserSubscription(data.userId);

  if (existingSubscription) {
    // 更新现有订阅
    const [updated] = await db
      .update(subscriptions)
      .set({
        planType: data.planType,
        status: data.status,
        stripeSubscriptionId: data.stripeSubscriptionId,
        stripeCustomerId: data.stripeCustomerId,
        currentPeriodStart: data.currentPeriodStart,
        currentPeriodEnd: data.currentPeriodEnd,
        updatedAt: new Date(),
      })
      .where(eq(subscriptions.id, existingSubscription.id))
      .returning();

    return updated;
  } else {
    // 创建新订阅
    const [created] = await db
      .insert(subscriptions)
      .values({
        userId: data.userId,
        planType: data.planType,
        status: data.status,
        stripeSubscriptionId: data.stripeSubscriptionId,
        stripeCustomerId: data.stripeCustomerId,
        currentPeriodStart: data.currentPeriodStart,
        currentPeriodEnd: data.currentPeriodEnd,
      })
      .returning();

    return created;
  }
}

/**
 * 取消订阅
 */
export async function cancelSubscription(userId: string, immediate = false) {
  if (isTestMode) {
    // 测试模式：直接更新数据库
    const subscription = await getUserSubscription(userId);
    if (!subscription) {
      throw new Error('No subscription found');
    }

    await db
      .update(subscriptions)
      .set({
        status: immediate ? 'cancelled' : 'active',
        cancelAtPeriodEnd: !immediate,
        updatedAt: new Date(),
      })
      .where(eq(subscriptions.id, subscription.id));

    // 如果立即取消，更新用户的订阅层级
    if (immediate) {
      await db
        .update(users)
        .set({ subscriptionTier: 'free' })
        .where(eq(users.id, userId));
    }

    return { success: true, testMode: true };
  }

  if (!stripe) {
    throw new Error('Stripe is not initialized');
  }

  const subscription = await getUserSubscription(userId);
  if (!subscription || !subscription.stripeSubscriptionId) {
    throw new Error('No active subscription found');
  }

  if (immediate) {
    // 立即取消
    await stripe.subscriptions.cancel(subscription.stripeSubscriptionId);
  } else {
    // 在当前计费周期结束时取消
    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: true,
    });
  }

  return { success: true, testMode: false };
}

/**
 * 恢复已取消的订阅
 */
export async function resumeSubscription(userId: string) {
  if (isTestMode) {
    // 测试模式
    const subscription = await getUserSubscription(userId);
    if (!subscription) {
      throw new Error('No subscription found');
    }

    await db
      .update(subscriptions)
      .set({
        cancelAtPeriodEnd: false,
        updatedAt: new Date(),
      })
      .where(eq(subscriptions.id, subscription.id));

    return { success: true, testMode: true };
  }

  if (!stripe) {
    throw new Error('Stripe is not initialized');
  }

  const subscription = await getUserSubscription(userId);
  if (!subscription || !subscription.stripeSubscriptionId) {
    throw new Error('No subscription found');
  }

  await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
    cancel_at_period_end: false,
  });

  return { success: true, testMode: false };
}

/**
 * 处理 Stripe Webhook 事件
 */
export async function handleWebhookEvent(
  event: Stripe.Event,
  rawBody: string,
  signature: string
) {
  if (isTestMode) {
    // 测试模式：跳过签名验证
    console.log('Test mode: Skipping webhook signature verification');
  } else if (stripe && process.env.STRIPE_WEBHOOK_SECRET) {
    // 验证 webhook 签名
    try {
      event = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      throw new Error('Invalid signature');
    }
  }

  // 处理不同的事件类型
  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutComplete(event.data.object as Stripe.Checkout.Session);
      break;

    case 'customer.subscription.created':
    case 'customer.subscription.updated':
      await handleSubscriptionUpdate(event.data.object as Stripe.Subscription);
      break;

    case 'customer.subscription.deleted':
      await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
      break;

    case 'invoice.payment_succeeded':
      await handlePaymentSucceeded(event.data.object as Stripe.Invoice);
      break;

    case 'invoice.payment_failed':
      await handlePaymentFailed(event.data.object as Stripe.Invoice);
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }
}

/**
 * 处理 Checkout 完成事件
 */
async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;
  if (!userId) {
    console.error('No userId in checkout session metadata');
    return;
  }

  const subscriptionId = session.subscription as string;
  const customerId = session.customer as string;

  // 创建订阅记录
  await createOrUpdateSubscription({
    userId,
    planType: 'pro',
    status: 'active',
    stripeSubscriptionId: subscriptionId,
    stripeCustomerId: customerId,
  });

  // 更新用户的订阅层级
  await db
    .update(users)
    .set({ subscriptionTier: 'pro' })
    .where(eq(users.id, userId));

  console.log(`Subscription activated for user ${userId}`);
}

/**
 * 处理订阅更新事件
 */
async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId;
  if (!userId) {
    console.error('No userId in subscription metadata');
    return;
  }

  const subscriptionData: any = subscription;
  await createOrUpdateSubscription({
    userId,
    planType: 'pro',
    status: subscription.status,
    stripeSubscriptionId: subscription.id,
    stripeCustomerId: subscription.customer as string,
    currentPeriodStart: subscriptionData.current_period_start ? new Date(subscriptionData.current_period_start * 1000) : new Date(),
    currentPeriodEnd: subscriptionData.current_period_end ? new Date(subscriptionData.current_period_end * 1000) : new Date(),
  });

  // 根据订阅状态更新用户层级
  const tier = subscription.status === 'active' ? 'pro' : 'free';
  await db.update(users).set({ subscriptionTier: tier }).where(eq(users.id, userId));

  console.log(`Subscription updated for user ${userId}: ${subscription.status}`);
}

/**
 * 处理订阅删除事件
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId;
  if (!userId) {
    console.error('No userId in subscription metadata');
    return;
  }

  await createOrUpdateSubscription({
    userId,
    planType: 'pro',
    status: 'cancelled',
    stripeSubscriptionId: subscription.id,
    stripeCustomerId: subscription.customer as string,
  });

  // 降级为免费用户
  await db.update(users).set({ subscriptionTier: 'free' }).where(eq(users.id, userId));

  console.log(`Subscription cancelled for user ${userId}`);
}

/**
 * 处理支付成功事件
 */
async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log(`Payment succeeded for invoice ${invoice.id}`);
  // 可以在这里添加发送收据邮件等逻辑
}

/**
 * 处理支付失败事件
 */
async function handlePaymentFailed(invoice: Stripe.Invoice) {
  console.log(`Payment failed for invoice ${invoice.id}`);
  // 可以在这里添加发送支付失败通知等逻辑
}

/**
 * 测试模式：模拟订阅激活
 * 用于开发环境测试
 */
export async function testModeActivateSubscription(userId: string) {
  if (!isTestMode) {
    throw new Error('This function is only available in test mode');
  }

  // 创建模拟订阅
  await createOrUpdateSubscription({
    userId,
    planType: 'pro',
    status: 'active',
    stripeSubscriptionId: `sub_test_${Date.now()}`,
    stripeCustomerId: `cus_test_${Date.now()}`,
    currentPeriodStart: new Date(),
    currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30天后
  });

  // 更新用户订阅层级
  await db.update(users).set({ subscriptionTier: 'pro' }).where(eq(users.id, userId));

  return { success: true, message: 'Test subscription activated' };
}

/**
 * 检查用户是否有权访问高级功能
 */
export async function checkSubscriptionAccess(userId: string, feature: string) {
  const [user] = await db.select().from(users).where(eq(users.id, userId));

  if (!user) {
    return false;
  }

  if (user.subscriptionTier === 'pro') {
    return true;
  }

  // 这里可以根据不同的功能添加更细粒度的控制
  return false;
}

/**
 * 检查用户当月的生成次数限制
 * 免费用户：20次/月
 * Pro用户：无限制
 */
export async function checkGenerationLimit(userId: string) {
  // 获取用户信息
  const [user] = await db.select().from(users).where(eq(users.id, userId));
  
  if (!user) {
    throw new Error('User not found');
  }

  // Pro用户无限制
  if (user.subscriptionTier === 'pro') {
    return {
      allowed: true,
      remaining: -1, // -1 表示无限制
      limit: -1,
      used: 0,
      isPro: true,
    };
  }

  // 免费用户检查当月使用次数
  const limit = SUBSCRIPTION_PLANS.free.limits.aiGenerationsPerMonth;
  
  // 获取当月第一天的时间
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  
  // 查询当月生成次数
  const result = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(promptGenerationLogs)
    .where(
      and(
        eq(promptGenerationLogs.userId, userId),
        gte(promptGenerationLogs.createdAt, startOfMonth)
      )
    );
  
  const used = result[0]?.count || 0;
  const remaining = Math.max(0, limit - used);
  const allowed = used < limit;

  return {
    allowed,
    remaining,
    limit,
    used,
    isPro: false,
  };
}

/**
 * 获取用户的使用统计信息
 */
export async function getUserUsageStats(userId: string) {
  const [user] = await db.select().from(users).where(eq(users.id, userId));
  
  if (!user) {
    throw new Error('User not found');
  }

  const isPro = user.subscriptionTier === 'pro';
  
  // 获取当月第一天
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  
  // 查询当月生成次数
  const result = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(promptGenerationLogs)
    .where(
      and(
        eq(promptGenerationLogs.userId, userId),
        gte(promptGenerationLogs.createdAt, startOfMonth)
      )
    );
  
  const used = result[0]?.count || 0;
  const limit = isPro ? -1 : SUBSCRIPTION_PLANS.free.limits.aiGenerationsPerMonth;
  const remaining = isPro ? -1 : Math.max(0, limit - used);

  return {
    subscriptionTier: user.subscriptionTier,
    isPro,
    limit,
    used,
    remaining,
    periodStart: startOfMonth,
    periodEnd: new Date(now.getFullYear(), now.getMonth() + 1, 0), // 月末
  };
}

