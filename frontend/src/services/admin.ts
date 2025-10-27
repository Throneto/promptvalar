import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

// ========================================
// 类型定义
// ========================================

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  totalPrompts: number;
  activeSubscriptions: number;
  freeUsers: number;
  newUsersThisMonth: number;
  newPromptsThisMonth: number;
  conversionRate: string;
}

export interface UserGrowthData {
  date: string;
  count: number;
}

export interface TopPrompt {
  id: string;
  title: string;
  model: string;
  viewsCount: number;
  favoritesCount: number;
  createdAt: string;
  authorUsername: string;
}

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  subscriptionTier: 'free' | 'pro';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  generationCount: number;
}

export interface UserDetail extends AdminUser {
  avatarUrl?: string;
  bio?: string;
  stats: {
    promptsCount: number;
    favoritesCount: number;
  };
  subscription: any;
}

export interface AdminPrompt {
  id: string;
  title: string;
  description?: string;
  model: string;
  category?: string;
  isPublished: boolean;
  isPremium: boolean;
  viewsCount: number;
  favoritesCount: number;
  createdAt: string;
  authorUsername: string;
  authorId: string;
}

export interface AdminLog {
  id: string;
  action: string;
  targetType?: string;
  targetId?: string;
  details?: any;
  ipAddress?: string;
  createdAt: string;
  adminUsername: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// ========================================
// 仪表板统计 API
// ========================================

/**
 * 获取仪表板统计数据
 */
export async function getDashboardStats(token: string): Promise<DashboardStats> {
  const response = await axios.get(`${API_BASE_URL}/admin/dashboard/stats`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.data;
}

/**
 * 获取用户增长数据
 */
export async function getUserGrowth(token: string): Promise<UserGrowthData[]> {
  const response = await axios.get(`${API_BASE_URL}/admin/dashboard/user-growth`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.data;
}

/**
 * 获取热门提示词
 */
export async function getTopPrompts(token: string, limit: number = 10): Promise<TopPrompt[]> {
  const response = await axios.get(`${API_BASE_URL}/admin/dashboard/top-prompts`, {
    params: { limit },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.data;
}

// ========================================
// 用户管理 API
// ========================================

/**
 * 获取用户列表
 */
export async function getUsers(
  token: string,
  params: {
    page?: number;
    limit?: number;
    search?: string;
    role?: 'user' | 'admin';
    isActive?: boolean;
    subscriptionTier?: 'free' | 'pro';
    sortBy?: 'createdAt' | 'generationCount' | 'username';
    sortOrder?: 'asc' | 'desc';
  }
): Promise<{ users: AdminUser[]; pagination: PaginationInfo }> {
  const response = await axios.get(`${API_BASE_URL}/admin/users`, {
    params,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return {
    users: response.data.data,
    pagination: response.data.pagination,
  };
}

/**
 * 获取用户详情
 */
export async function getUserDetail(token: string, userId: string): Promise<UserDetail> {
  const response = await axios.get(`${API_BASE_URL}/admin/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.data;
}

/**
 * 更新用户
 */
export async function updateUser(
  token: string,
  userId: string,
  data: {
    username?: string;
    email?: string;
    role?: 'user' | 'admin';
    subscriptionTier?: 'free' | 'pro';
    isActive?: boolean;
  }
): Promise<AdminUser> {
  const response = await axios.put(`${API_BASE_URL}/admin/users/${userId}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.data;
}

/**
 * 重置用户密码
 */
export async function resetUserPassword(
  token: string,
  userId: string,
  newPassword: string
): Promise<void> {
  await axios.post(
    `${API_BASE_URL}/admin/users/${userId}/reset-password`,
    { newPassword },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}

/**
 * 删除用户
 */
export async function deleteUser(token: string, userId: string): Promise<void> {
  await axios.delete(`${API_BASE_URL}/admin/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// ========================================
// 提示词管理 API
// ========================================

/**
 * 获取提示词列表
 */
export async function getPrompts(
  token: string,
  params: {
    page?: number;
    limit?: number;
    search?: string;
    model?: string;
    isPublished?: boolean;
  }
): Promise<{ prompts: AdminPrompt[]; pagination: PaginationInfo }> {
  const response = await axios.get(`${API_BASE_URL}/admin/prompts`, {
    params,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return {
    prompts: response.data.data,
    pagination: response.data.pagination,
  };
}

/**
 * 更新提示词
 */
export async function updatePrompt(
  token: string,
  promptId: string,
  data: {
    title?: string;
    description?: string;
    isPublished?: boolean;
    isPremium?: boolean;
  }
): Promise<AdminPrompt> {
  const response = await axios.put(`${API_BASE_URL}/admin/prompts/${promptId}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.data;
}

/**
 * 删除提示词
 */
export async function deletePrompt(token: string, promptId: string): Promise<void> {
  await axios.delete(`${API_BASE_URL}/admin/prompts/${promptId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// ========================================
// 审计日志 API
// ========================================

/**
 * 获取管理员操作日志
 */
export async function getAdminLogs(
  token: string,
  params: {
    page?: number;
    limit?: number;
    adminId?: string;
    action?: string;
  }
): Promise<{ logs: AdminLog[]; pagination: PaginationInfo }> {
  const response = await axios.get(`${API_BASE_URL}/admin/logs`, {
    params,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return {
    logs: response.data.data,
    pagination: response.data.pagination,
  };
}

