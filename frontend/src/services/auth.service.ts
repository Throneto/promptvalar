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

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: {
      id: string;
      username: string;
      email: string;
      subscriptionTier: string;
      createdAt: string;
    };
    accessToken: string;
    refreshToken: string;
  };
  meta: {
    timestamp: string;
  };
}

export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
  meta: {
    timestamp: string;
  };
}

export interface UpdateProfileRequest {
  username?: string;
  email?: string;
  bio?: string;
  avatarUrl?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

/**
 * 用户注册
 */
export async function register(data: RegisterRequest): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>('/auth/register', data);
  
  // 保存tokens到localStorage
  if (response.data.success && response.data.data) {
    localStorage.setItem('accessToken', response.data.data.accessToken);
    localStorage.setItem('refreshToken', response.data.data.refreshToken);
    localStorage.setItem('user', JSON.stringify(response.data.data.user));
  }
  
  return response.data;
}

/**
 * 用户登录
 */
export async function login(data: LoginRequest): Promise<AuthResponse> {
  console.log('📡 发送登录请求到:', apiClient.defaults.baseURL);
  console.log('📧 邮箱:', data.email);
  
  try {
    const response = await apiClient.post<AuthResponse>('/auth/login', data);
    console.log('📥 收到响应:', response.status, response.statusText);
    console.log('📦 响应数据:', response.data);
    
    // 保存tokens到localStorage
    if (response.data.success && response.data.data) {
      console.log('💾 保存tokens到localStorage...');
      localStorage.setItem('accessToken', response.data.data.accessToken);
      localStorage.setItem('refreshToken', response.data.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
      console.log('✅ tokens已保存');
      
      // 触发自定义事件通知其他组件
      window.dispatchEvent(new Event('auth-change'));
    } else {
      console.warn('⚠️ 响应格式异常:', response.data);
    }
    
    return response.data;
  } catch (error) {
    console.error('❌ 登录API调用失败:', error);
    throw error;
  }
}

/**
 * 用户登出
 */
export function logout(): void {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
}

/**
 * 获取当前用户信息
 */
export function getCurrentUser() {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

/**
 * 检查是否已登录
 */
export function isAuthenticated(): boolean {
  return !!localStorage.getItem('accessToken');
}

/**
 * 检查是否为管理员
 */
export function isAdmin(): boolean {
  const user = getCurrentUser();
  return user?.role === 'admin';
}

/**
 * 获取访问token
 */
export function getAccessToken(): string | null {
  return localStorage.getItem('accessToken');
}

/**
 * 更新用户资料
 */
export async function updateProfile(data: UpdateProfileRequest): Promise<any> {
  const response = await apiClient.put('/auth/profile', data);
  
  // 更新localStorage中的用户信息
  if (response.data.success && response.data.data) {
    const currentUser = getCurrentUser();
    if (currentUser) {
      const updatedUser = { ...currentUser, ...response.data.data };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  }
  
  return response.data;
}

/**
 * 更改密码
 */
export async function changePassword(data: ChangePasswordRequest): Promise<any> {
  const response = await apiClient.put('/auth/password', data);
  return response.data;
}

