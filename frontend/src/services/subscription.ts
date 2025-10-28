import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

/**
 * 订阅 API 服务
 */

export interface SubscriptionPlan {
  name: string;
  price: number;
  priceId?: string;
  features: string[];
  limits: {
    aiGenerationsPerMonth: number;
    premiumPromptsAccess: boolean;
    advancedModels: boolean;
  };
}

export interface SubscriptionPlans {
  free: SubscriptionPlan;
  pro: SubscriptionPlan;
}

export interface Subscription {
  id: string;
  userId: string;
  planType: string;
  status: string;
  stripeSubscriptionId?: string;
  stripeCustomerId?: string;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * 获取订阅计划信息
 */
export async function getSubscriptionPlans(): Promise<SubscriptionPlans> {
  const response = await axios.get(`${API_BASE_URL}/subscriptions/plans`);
  return response.data.plans;
}

/**
 * 获取当前用户的订阅信息
 */
export async function getCurrentSubscription(token: string): Promise<Subscription | null> {
  const response = await axios.get(`${API_BASE_URL}/subscriptions/current`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.subscription;
}

/**
 * 创建 Checkout Session
 */
export async function createCheckoutSession(
  token: string,
  priceId: string
): Promise<{ sessionId: string; url: string; testMode: boolean }> {
  const response = await axios.post(
    `${API_BASE_URL}/subscriptions/checkout`,
    { priceId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
}

/**
 * 创建 Portal Session
 */
export async function createPortalSession(
  token: string
): Promise<{ url: string; testMode: boolean }> {
  const response = await axios.post(
    `${API_BASE_URL}/subscriptions/portal`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
}

/**
 * 取消订阅
 */
export async function cancelSubscription(
  token: string,
  immediate = false
): Promise<{ success: boolean; message: string; testMode: boolean }> {
  const response = await axios.post(
    `${API_BASE_URL}/subscriptions/cancel`,
    { immediate },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
}

/**
 * 恢复订阅
 */
export async function resumeSubscription(
  token: string
): Promise<{ success: boolean; message: string; testMode: boolean }> {
  const response = await axios.post(
    `${API_BASE_URL}/subscriptions/resume`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
}

/**
 * 检查功能访问权限
 */
export async function checkFeatureAccess(
  token: string,
  feature: string
): Promise<{ hasAccess: boolean; feature: string }> {
  const response = await axios.get(
    `${API_BASE_URL}/subscriptions/check-access`,
    {
      params: { feature },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
}

/**
 * 测试模式：激活 Pro 订阅
 */
export async function testModeActivateSubscription(
  token: string
): Promise<{ success: boolean; message: string }> {
  const response = await axios.post(
    `${API_BASE_URL}/subscriptions/test/activate`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
}

