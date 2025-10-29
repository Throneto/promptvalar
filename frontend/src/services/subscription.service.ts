import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 添加请求拦截器以包含认证token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * 用户使用统计信息类型
 */
export interface UsageStats {
  subscriptionTier: 'free' | 'pro';
  isPro: boolean;
  limit: number; // -1 表示无限制
  used: number;
  remaining: number; // -1 表示无限制
  periodStart: string;
  periodEnd: string;
}

/**
 * 获取用户的使用统计信息
 */
export async function getUserUsageStats(): Promise<UsageStats> {
  const response = await apiClient.get<{
    success: boolean;
    data: UsageStats;
  }>('/subscriptions/usage-stats');
  
  return response.data.data;
}

/**
 * 订阅计划信息
 */
export interface SubscriptionPlan {
  name: string;
  price: number;
  features: string[];
  limits: {
    aiGenerationsPerMonth: number;
    premiumPromptsAccess: boolean;
    advancedModels: boolean;
  };
}

/**
 * 获取所有订阅计划
 */
export async function getSubscriptionPlans(): Promise<{
  free: SubscriptionPlan;
  pro: SubscriptionPlan;
}> {
  const response = await apiClient.get<{
    success: boolean;
    plans: {
      free: SubscriptionPlan;
      pro: SubscriptionPlan;
    };
  }>('/subscriptions/plans');
  
  return response.data.plans;
}

