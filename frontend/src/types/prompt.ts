// 提示词相关类型定义

export type AIModel = 'sora' | 'veo' | 'nano_banana' | 'seedream' | 'midjourney' | 'stable_diffusion';

export type PromptStyle = 
  | 'cinematic'
  | 'photorealistic'
  | 'anime'
  | 'cyberpunk'
  | 'fantasy'
  | 'minimalist'
  | 'abstract'
  | 'commercial';

export type ShotType = 
  | 'wide_shot'
  | 'medium_shot'
  | 'close_up'
  | 'extreme_close_up'
  | 'aerial_view'
  | 'POV'
  | 'over_shoulder';

export type LightingType = 
  | 'natural'
  | 'studio'
  | 'golden_hour'
  | 'blue_hour'
  | 'dramatic'
  | 'soft'
  | 'neon'
  | 'backlit';

// 结构化提示词接口
export interface StructuredPrompt {
  subject: string;
  action: string;
  setting: string;
  shotType: ShotType | string;
  lighting: LightingType | string;
  composition: string;
  mood: string[];
  parameters: string;
}

// AI生成提示词请求
export interface GeneratePromptRequest {
  idea: string;
  model: AIModel;
  style: PromptStyle;
}

// AI生成提示词响应
export interface GeneratePromptResponse {
  prompt: string;
  structured: StructuredPrompt;
}

// 提示词实体
export interface Prompt {
  id: string;
  title: string;
  description?: string;
  promptText: string;
  model: AIModel;
  category?: string;
  style?: string;
  tags: string[];
  previewImageUrl?: string;
  authorId: string;
  isPremium: boolean;
  isPublished: boolean;
  viewsCount: number;
  favoritesCount: number;
  createdAt: string;
  updatedAt: string;
}

