import axios from 'axios';
import { GeneratePromptRequest, GeneratePromptResponse, StructuredPrompt } from '../types/prompt';

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
 * 从自然语言想法生成专业提示词
 */
export async function generatePrompt(
  request: GeneratePromptRequest
): Promise<GeneratePromptResponse> {
  const response = await apiClient.post<{
    success: boolean;
    data: GeneratePromptResponse;
  }>('/ai/generate-prompt', request);
  
  return response.data.data;
}

/**
 * 解析提示词为结构化组件
 */
export async function parsePrompt(
  promptText: string,
  model: string
): Promise<StructuredPrompt> {
  const response = await apiClient.post<{
    success: boolean;
    data: StructuredPrompt;
  }>('/ai/parse-prompt', {
    prompt: promptText,
    model,
  });
  
  return response.data.data;
}

/**
 * 获取AI改进建议
 */
export async function getSuggestions(
  promptText: string,
  model: string
): Promise<string[]> {
  const response = await apiClient.post<{
    success: boolean;
    data: { suggestions: string[] };
  }>('/ai/suggest', {
    prompt: promptText,
    model,
  });
  
  return response.data.data.suggestions;
}

