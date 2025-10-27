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
  | 'drone_view'
  | 'POV'
  | 'over_shoulder'
  | 'establishing_shot'
  | 'tracking_shot';

export type LightingType = 
  | 'natural'
  | 'studio'
  | 'golden_hour'
  | 'blue_hour'
  | 'dramatic'
  | 'soft'
  | 'neon'
  | 'backlit'
  | 'rim_light'
  | 'high_key'
  | 'low_key';

// 镜头运动类型
export type CameraMovementType = 
  | 'static'
  | 'tracking'
  | 'dolly_in'
  | 'dolly_out'
  | 'crane'
  | 'handheld'
  | 'zoom_in'
  | 'zoom_out'
  | 'pan'
  | 'tilt'
  | 'steadicam';

// 音频元素类型
export type AudioType = 
  | 'dialogue'
  | 'sound_effects'
  | 'music'
  | 'ambient'
  | 'voiceover';

// 时间轴场景接口
export interface TimelineScene {
  start: number; // 开始时间（秒）
  end: number; // 结束时间（秒）
  description: string; // 场景描述
}

// 音频元素接口
export interface AudioElement {
  type: AudioType;
  description: string;
}

// 结构化提示词接口 (8要素框架)
// 基于导演式视频生成优化理论
export interface StructuredPrompt {
  // 要素1: Subject - 主题
  subject: string;
  
  // 要素2: Setting - 环境
  setting: string;
  
  // 要素3: Action - 动作
  action: string;
  
  // 要素4: Camera - 摄影
  shotType: ShotType | string;
  cameraMovement?: CameraMovementType | string;
  
  // 要素5: Style - 视觉风格
  style?: string;
  lighting: LightingType | string;
  
  // 要素6: Audio - 音效（Veo特别重要）
  audio?: string;
  
  // 要素7: Timeline - 时间轴（多场景视频）
  timeline?: TimelineScene[];
  
  // 要素8: Constraints - 约束条件
  constraints?: string;
  
  // 传统字段（保留兼容性）
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

