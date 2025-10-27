import OpenAI from 'openai';
import { loggingService } from './loggingService.js';
import { 
  getSystemPrompt, 
  getModelTemperature, 
  getModelMaxTokens 
} from '../config/modelPromptStrategies.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// 加载环境变量
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../../.env') });

// 初始化OpenRouter客户端
const openrouter = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': process.env.OPENROUTER_SITE_URL || 'https://promptvalar.com',
    'X-Title': process.env.OPENROUTER_APP_NAME || 'PromptValar',
  },
});

// 模型配置
const MODELS = {
  generation: 'anthropic/claude-3.5-sonnet', // 用于生成提示词
  parsing: 'anthropic/claude-3-haiku', // 用于解析提示词（更快更便宜）
} as const;

/**
 * 从用户想法生成专业提示词（基于8要素框架和导演式思维）
 * 
 * 优化亮点：
 * 1. 根据目标模型动态选择专用System Prompt
 * 2. 强制要求8要素结构化输出
 * 3. 针对不同模型调整生成参数（temperature, max_tokens）
 * 4. 引导AI像导演一样思考，而非关键词生成器
 */
export async function generatePromptFromIdea(
  idea: string,
  targetModel: string,
  style: string,
  userId?: string
): Promise<{ prompt: string; structured: StructuredPromptData; logId: string }> {
  const startTime = Date.now();
  
  // 🎯 核心优化：根据模型选择专门的System Prompt
  const systemPrompt = getSystemPrompt(targetModel, style);
  
  // 构建用户消息，引导AI进行结构化思考
  const userMessage = `用户创意想法：${idea}

目标模型：${targetModel}
期望风格：${style}

请按照8要素框架（Subject, Setting, Action, Camera, Style, Audio, Timeline, Constraints）生成专业的提示词。

特别注意：
${targetModel === 'sora' ? '- 这是视频生成，需要考虑时间轴和动作连贯性\n- 添加物理约束以确保真实感' : ''}
${targetModel === 'veo' ? '- 这是视频+音频生成，必须详细描述音频元素（对话/音效/配乐）\n- 考虑多场景时可使用timeline' : ''}
${targetModel === 'nano_banana' ? '- 使用摄影师视角，描述场景而非罗列关键词\n- 包含相机和镜头细节' : ''}
${targetModel === 'seedream' ? '- 这是图像编辑，需要精准的指令\n- 强调质量和细节保留' : ''}`;

  try {
    const completion = await openrouter.chat.completions.create({
      model: MODELS.generation,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      // 🎯 根据模型类型动态调整参数
      temperature: getModelTemperature(targetModel),
      max_tokens: getModelMaxTokens(targetModel),
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error('No response from AI model');
    }

    const result = JSON.parse(content);
    
    // 验证必需字段是否存在
    if (!result.prompt || !result.structured) {
      throw new Error('Invalid response format from AI');
    }
    
    // 确保structured对象包含所有必需的基础字段
    const structured: StructuredPromptData = {
      subject: result.structured.subject || '',
      setting: result.structured.setting || '',
      action: result.structured.action || '',
      shotType: result.structured.shotType || '',
      cameraMovement: result.structured.cameraMovement,
      style: result.structured.style,
      lighting: result.structured.lighting || '',
      audio: result.structured.audio,
      timeline: result.structured.timeline,
      constraints: result.structured.constraints,
      composition: result.structured.composition || '',
      mood: result.structured.mood || [],
      parameters: result.structured.parameters || '',
    };
    
    const generationTime = Date.now() - startTime;
    
    // 记录生成日志
    const logId = await loggingService.logGeneration({
      userId,
      inputIdea: idea,
      inputModel: targetModel,
      inputStyle: style,
      outputPrompt: result.prompt,
      outputStructured: structured,
      generationTime,
      tokensUsed: completion.usage?.total_tokens || 0,
      aiModelUsed: MODELS.generation,
    });
    
    return {
      prompt: result.prompt,
      structured,
      logId,
    };
  } catch (error) {
    console.error('OpenRouter API error:', error);
    throw new Error('Failed to generate prompt. Please try again.');
  }
}

/**
 * 解析现有提示词为结构化组件
 */
export async function parsePromptToStructured(
  promptText: string,
  targetModel: string
): Promise<StructuredPromptData> {
  const systemPrompt = `You are a prompt analysis expert. Parse the given ${targetModel} prompt into structured components.

Extract and return JSON with these fields:
- subject: Main subject/character
- action: What's happening
- setting: Location/environment
- shotType: Camera angle/framing
- lighting: Lighting conditions
- composition: Composition details
- mood: Array of mood descriptors
- parameters: Model-specific parameters (if any)

If a component is not present in the prompt, use an empty string or empty array.`;

  try {
    const completion = await openrouter.chat.completions.create({
      model: MODELS.parsing,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: promptText },
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error('No response from AI model');
    }

    return JSON.parse(content);
  } catch (error) {
    console.error('OpenRouter API error:', error);
    throw new Error('Failed to parse prompt. Please try again.');
  }
}

/**
 * 获取提示词改进建议
 */
export async function getSuggestions(
  promptText: string,
  targetModel: string
): Promise<string[]> {
  const systemPrompt = `You are a prompt improvement expert for ${targetModel}.

Analyze the given prompt and provide 3-5 specific suggestions for improvement.

Return your response as JSON with a "suggestions" array containing string items.`;

  try {
    const completion = await openrouter.chat.completions.create({
      model: MODELS.parsing,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: promptText },
      ],
      temperature: 0.5,
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error('No response from AI model');
    }

    const result = JSON.parse(content);
    return result.suggestions || [];
  } catch (error) {
    console.error('OpenRouter API error:', error);
    throw new Error('Failed to get suggestions. Please try again.');
  }
}

// 时间轴场景类型
export interface TimelineScene {
  start: number; // 开始时间（秒）
  end: number; // 结束时间（秒）
  description: string; // 场景描述
}

// 结构化提示词数据类型 (8要素框架)
// 基于导演式视频生成优化理论
export interface StructuredPromptData {
  // 要素1: Subject - 主题
  subject: string;
  
  // 要素2: Setting - 环境
  setting: string;
  
  // 要素3: Action - 动作
  action: string;
  
  // 要素4: Camera - 摄影
  shotType: string;
  cameraMovement?: string;
  
  // 要素5: Style - 视觉风格
  style?: string;
  lighting: string;
  
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

