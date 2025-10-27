/**
 * 提示词合成服务
 * 
 * 将结构化的8要素数据智能地编织成流畅、自然的提示词文本
 * 
 * 核心理念：
 * - 避免机械罗列要素
 * - 使用连接词（then, as, while, next）串联动作
 * - 根据不同模型应用不同的合成模板
 * - 确保在字符限制内（约1400字符）
 */

import { TimelineScene } from './openrouter.service.js';

export interface StructuredPromptInput {
  subject: string;
  setting: string;
  action: string;
  shotType: string;
  cameraMovement?: string;
  style?: string;
  lighting: string;
  audio?: string;
  timeline?: TimelineScene[];
  constraints?: string;
  composition?: string;
  mood?: string[];
  parameters?: string | Record<string, any>;
}

/**
 * 为Sora视频生成合成提示词
 * 强调电影化叙事和物理真实感
 */
export function composeSoraPrompt(data: StructuredPromptInput): string {
  const parts: string[] = [];
  
  // 1. 主题 + 动作 + 环境（核心场景描述）
  if (data.subject && data.action && data.setting) {
    parts.push(`${data.subject} ${data.action} in ${data.setting}.`);
  } else if (data.subject && data.action) {
    parts.push(`${data.subject} ${data.action}.`);
  } else if (data.subject && data.setting) {
    parts.push(`${data.subject} in ${data.setting}.`);
  }
  
  // 2. 摄影（镜头类型 + 运动）
  const cameraDesc: string[] = [];
  if (data.shotType) {
    cameraDesc.push(data.shotType);
  }
  if (data.cameraMovement) {
    cameraDesc.push(data.cameraMovement);
  }
  if (cameraDesc.length > 0) {
    parts.push(cameraDesc.join(' with ') + '.');
  }
  
  // 3. 视觉风格 + 光线
  const styleDesc: string[] = [];
  if (data.lighting) {
    styleDesc.push(data.lighting);
  }
  if (data.style) {
    styleDesc.push(data.style);
  }
  if (styleDesc.length > 0) {
    parts.push(styleDesc.join(', ') + '.');
  }
  
  // 4. 音效（增强沉浸感）
  if (data.audio) {
    parts.push(`${data.audio}.`);
  }
  
  // 5. 氛围
  if (data.mood && data.mood.length > 0) {
    parts.push(`${data.mood.join(', ')} atmosphere.`);
  }
  
  // 6. 约束条件（提升质量 - Sora特别重要）
  if (data.constraints) {
    parts.push(data.constraints + '.');
  }
  
  // 7. 技术参数
  if (data.parameters) {
    const params = typeof data.parameters === 'string' 
      ? data.parameters 
      : formatParameters(data.parameters);
    if (params) {
      parts.push(params + '.');
    }
  }
  
  let prompt = parts.join(' ').replace(/\s+/g, ' ').trim();
  
  // 8. 时间轴（如果有多场景）
  if (data.timeline && data.timeline.length > 0) {
    prompt = composeTimelinePrompt(data.timeline, prompt);
  }
  
  return optimizeLength(prompt, 1400);
}

/**
 * 为Veo视频生成合成提示词
 * 强调音频元素和五元素公式
 */
export function composeVeoPrompt(data: StructuredPromptInput): string {
  const parts: string[] = [];
  
  // Veo五元素公式：(镜头) + (主体与动作) + (场景) + (风格与光线) + (音频)
  
  // 1. 镜头类型开场
  if (data.shotType) {
    parts.push(`${data.shotType} of`);
  }
  
  // 2. 主体与动作
  if (data.subject && data.action) {
    parts.push(`${data.subject} ${data.action}`);
  } else if (data.subject) {
    parts.push(data.subject);
  }
  
  // 3. 场景环境
  if (data.setting) {
    parts.push(`in ${data.setting}.`);
  } else {
    parts.push('.');
  }
  
  // 4. 视觉风格与光线
  const visualDesc: string[] = [];
  if (data.style) {
    visualDesc.push(data.style);
  }
  if (data.lighting) {
    visualDesc.push(data.lighting);
  }
  if (visualDesc.length > 0) {
    parts.push(visualDesc.join(' with ') + '.');
  }
  
  // 5. 镜头运动
  if (data.cameraMovement) {
    parts.push(`Camera ${data.cameraMovement}.`);
  }
  
  // 6. 音频元素（⭐ Veo的特色）
  if (data.audio) {
    parts.push(`Audio: ${data.audio}.`);
  }
  
  // 7. 氛围
  if (data.mood && data.mood.length > 0) {
    parts.push(`Mood: ${data.mood.join(', ')}.`);
  }
  
  // 8. 约束
  if (data.constraints) {
    parts.push(data.constraints + '.');
  }
  
  let prompt = parts.join(' ').replace(/\s+/g, ' ').trim();
  
  // 时间轴支持
  if (data.timeline && data.timeline.length > 0) {
    prompt = composeTimelinePrompt(data.timeline, prompt);
  }
  
  return optimizeLength(prompt, 1400);
}

/**
 * 为nano banana图像生成合成提示词
 * 强调摄影师视角和场景叙事
 */
export function composeNanoBananaPrompt(data: StructuredPromptInput): string {
  const parts: string[] = [];
  
  // 场景叙事法：用完整的句子构建画面
  
  // 1. 主体在场景中的完整描述
  if (data.subject && data.setting && data.action) {
    parts.push(`${data.subject} ${data.action} in ${data.setting}.`);
  } else if (data.subject && data.setting) {
    parts.push(`${data.subject} in ${data.setting}.`);
  } else if (data.subject) {
    parts.push(data.subject + '.');
  }
  
  // 2. 摄影细节（nano banana的特色）
  const photoDetails: string[] = [];
  
  if (data.shotType) {
    photoDetails.push(data.shotType);
  }
  
  // 从style中提取摄影信息
  if (data.style && (data.style.includes('Shot with') || data.style.includes('lens'))) {
    parts.push(data.style + '.');
  } else if (data.style) {
    photoDetails.push(data.style);
  }
  
  if (data.lighting) {
    photoDetails.push(data.lighting + ' lighting');
  }
  
  if (photoDetails.length > 0) {
    parts.push(photoDetails.join(', ') + '.');
  }
  
  // 3. 构图和氛围
  if (data.composition) {
    parts.push(data.composition + '.');
  }
  
  if (data.mood && data.mood.length > 0) {
    parts.push(`${data.mood.join(', ')} atmosphere.`);
  }
  
  // 4. 技术参数
  if (data.parameters) {
    const params = typeof data.parameters === 'string' 
      ? data.parameters 
      : formatParameters(data.parameters);
    if (params) {
      parts.push(params + '.');
    }
  }
  
  return optimizeLength(parts.join(' ').replace(/\s+/g, ' ').trim(), 1000);
}

/**
 * 为Seedream图像编辑合成提示词
 * 强调精准指令和质量要求
 */
export function composeSeedreamPrompt(data: StructuredPromptInput): string {
  const parts: string[] = [];
  
  // 1. 主体描述
  if (data.subject) {
    parts.push(data.subject + '.');
  }
  
  // 2. 编辑动作
  if (data.action) {
    parts.push(data.action + '.');
  }
  
  // 3. 场景变更
  if (data.setting) {
    parts.push(`Setting: ${data.setting}.`);
  }
  
  // 4. 风格要求
  if (data.style) {
    parts.push(`Style: ${data.style}.`);
  }
  
  if (data.lighting) {
    parts.push(`Lighting: ${data.lighting}.`);
  }
  
  // 5. 约束和质量要求（⭐ Seedream的重点）
  if (data.constraints) {
    parts.push(`Requirements: ${data.constraints}.`);
  }
  
  // 6. 技术参数
  if (data.parameters) {
    const params = typeof data.parameters === 'string' 
      ? data.parameters 
      : formatParameters(data.parameters);
    if (params) {
      parts.push(params + '.');
    }
  }
  
  return optimizeLength(parts.join(' ').replace(/\s+/g, ' ').trim(), 1000);
}

/**
 * 通用图像模型提示词合成
 */
export function composeGenericPrompt(data: StructuredPromptInput): string {
  const parts: string[] = [];
  
  // 标准结构：主体 + 动作 + 环境 + 风格 + 光线
  
  if (data.subject) {
    parts.push(data.subject);
  }
  
  if (data.action) {
    parts.push(data.action);
  }
  
  if (data.setting) {
    parts.push(`in ${data.setting}`);
  }
  
  if (parts.length > 0) {
    parts[parts.length - 1] += '.';
  }
  
  if (data.shotType) {
    parts.push(`${data.shotType}.`);
  }
  
  const styleElements: string[] = [];
  if (data.style) {
    styleElements.push(data.style);
  }
  if (data.lighting) {
    styleElements.push(data.lighting + ' lighting');
  }
  if (styleElements.length > 0) {
    parts.push(styleElements.join(', ') + '.');
  }
  
  if (data.mood && data.mood.length > 0) {
    parts.push(`${data.mood.join(', ')} mood.`);
  }
  
  if (data.composition) {
    parts.push(data.composition + '.');
  }
  
  return optimizeLength(parts.join(' ').replace(/\s+/g, ' ').trim(), 1000);
}

/**
 * 处理时间轴，生成多场景描述
 */
function composeTimelinePrompt(timeline: TimelineScene[], basePrompt: string): string {
  if (timeline.length === 0) {
    return basePrompt;
  }
  
  // 如果只有一个场景，直接使用基础提示词
  if (timeline.length === 1) {
    return `${timeline[0].description}. ${basePrompt}`;
  }
  
  // 多场景：生成预告片式的时间轴描述
  const scenes = timeline.map((scene, index) => {
    const timeRange = `${scene.start}-${scene.end}s`;
    return `Scene ${index + 1} (${timeRange}): ${scene.description}`;
  }).join('. ');
  
  return `${scenes}. ${basePrompt}`;
}

/**
 * 格式化技术参数
 */
function formatParameters(params: Record<string, any>): string {
  const parts: string[] = [];
  
  if (params.duration) {
    parts.push(`${params.duration}`);
  }
  
  if (params.resolution) {
    parts.push(`${params.resolution} resolution`);
  }
  
  if (params.aspectRatio) {
    parts.push(`${params.aspectRatio} aspect ratio`);
  }
  
  // 添加其他参数
  Object.entries(params).forEach(([key, value]) => {
    if (!['duration', 'resolution', 'aspectRatio'].includes(key) && value) {
      parts.push(`${value}`);
    }
  });
  
  return parts.join(', ');
}

/**
 * 优化提示词长度，确保在字符限制内
 */
function optimizeLength(prompt: string, maxLength: number): string {
  if (prompt.length <= maxLength) {
    return prompt;
  }
  
  // 简单截断策略（可以后续优化为智能压缩）
  console.warn(`Prompt length (${prompt.length}) exceeds limit (${maxLength}), truncating...`);
  
  // 尝试在句号处截断
  const truncated = prompt.substring(0, maxLength);
  const lastPeriod = truncated.lastIndexOf('.');
  
  if (lastPeriod > maxLength * 0.8) {
    return truncated.substring(0, lastPeriod + 1);
  }
  
  return truncated + '...';
}

/**
 * 主合成函数：根据目标模型选择合适的合成策略
 */
export function composePrompt(
  data: StructuredPromptInput,
  targetModel: string
): string {
  const modelLower = targetModel.toLowerCase();
  
  if (modelLower === 'sora') {
    return composeSoraPrompt(data);
  }
  
  if (modelLower === 'veo') {
    return composeVeoPrompt(data);
  }
  
  if (modelLower === 'nano_banana' || modelLower === 'nano-banana') {
    return composeNanoBananaPrompt(data);
  }
  
  if (modelLower === 'seedream') {
    return composeSeedreamPrompt(data);
  }
  
  // 通用图像模型
  return composeGenericPrompt(data);
}

/**
 * 添加物理约束到现有提示词
 * 用于Sora等需要真实物理效果的模型
 */
export function enforceConstraints(
  prompt: string,
  constraints?: string
): string {
  if (!constraints) {
    // 默认物理约束
    constraints = 'Enforce realistic physics, natural gravity, clean reflections, no warped geometry';
  }
  
  // 如果提示词已经包含约束，不重复添加
  if (prompt.toLowerCase().includes('enforce') || 
      prompt.toLowerCase().includes('constraint')) {
    return prompt;
  }
  
  return `${prompt} ${constraints}.`;
}

/**
 * 智能添加时间轴叙事
 */
export function addTimelineNarrative(
  basePrompt: string,
  timeline: TimelineScene[]
): string {
  return composeTimelinePrompt(timeline, basePrompt);
}

