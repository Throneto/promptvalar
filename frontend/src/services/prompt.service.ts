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

export interface Prompt {
  id: string;
  title: string;
  description: string | null;
  content: string;
  modelType: string;
  style: string | null;
  category: string | null;
  tags: string[];
  previewImage: string | null;
  viewCount: number;
  favoriteCount: number;
  isFavorited?: boolean;
  createdAt: string;
  updatedAt: string;
  author?: {
    id: string;
    username: string;
    email: string;
  };
}

export interface PromptListResponse {
  success: boolean;
  data: {
    prompts: Prompt[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

export interface PromptDetailResponse {
  success: boolean;
  data: Prompt;
}

export interface CreatePromptRequest {
  title: string;
  description?: string;
  content: string;
  modelType: string;
  style?: string;
  category?: string;
  tags?: string[];
  previewImage?: string;
}

export interface UpdatePromptRequest extends Partial<CreatePromptRequest> {}

/**
 * 获取提示词列表
 */
export async function getPrompts(params?: {
  page?: number;
  limit?: number;
  search?: string;
  modelType?: string;
  style?: string;
  category?: string;
  tags?: string[];
}): Promise<PromptListResponse> {
  const response = await apiClient.get<PromptListResponse>('/prompts', { params });
  return response.data;
}

/**
 * 获取提示词详情
 */
export async function getPromptById(id: string): Promise<PromptDetailResponse> {
  const response = await apiClient.get<PromptDetailResponse>(`/prompts/${id}`);
  return response.data;
}

/**
 * 创建提示词
 */
export async function createPrompt(data: CreatePromptRequest): Promise<PromptDetailResponse> {
  const response = await apiClient.post<PromptDetailResponse>('/prompts', data);
  return response.data;
}

/**
 * 更新提示词
 */
export async function updatePrompt(id: string, data: UpdatePromptRequest): Promise<PromptDetailResponse> {
  const response = await apiClient.put<PromptDetailResponse>(`/prompts/${id}`, data);
  return response.data;
}

/**
 * 删除提示词
 */
export async function deletePrompt(id: string): Promise<{ success: boolean }> {
  const response = await apiClient.delete(`/prompts/${id}`);
  return response.data;
}

/**
 * 收藏/取消收藏提示词
 */
export async function toggleFavorite(id: string): Promise<{ success: boolean; data: { isFavorited: boolean } }> {
  const response = await apiClient.post(`/prompts/${id}/favorite`);
  return response.data;
}

/**
 * 获取我的收藏列表
 */
export async function getMyFavorites(params?: {
  page?: number;
  limit?: number;
}): Promise<PromptListResponse> {
  const response = await apiClient.get<PromptListResponse>('/prompts/favorites/me', { params });
  return response.data;
}

