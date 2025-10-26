import OpenAI from 'openai';
import { loggingService } from './loggingService.js';
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
 * 从用户想法生成专业提示词
 */
export async function generatePromptFromIdea(
  idea: string,
  targetModel: string,
  style: string,
  userId?: string
): Promise<{ prompt: string; structured: StructuredPromptData; logId: string }> {
  const startTime = Date.now();
  const systemPrompt = `You are an expert prompt engineer specializing in AI image and video generation models.

Your task is to transform user ideas into professional, detailed prompts optimized for ${targetModel}.

Guidelines:
- Be specific and descriptive
- Include relevant technical details (shot type, lighting, composition)
- Match the ${style} style aesthetic
- Use appropriate terminology for ${targetModel}
- Structure the prompt logically

Also provide a structured breakdown with these components:
- subject: Main subject/character
- action: What's happening
- setting: Location/environment
- shotType: Camera angle/framing
- lighting: Lighting conditions
- composition: Composition details
- mood: Array of mood descriptors
- parameters: Model-specific parameters (if applicable)

Return your response as JSON with two fields: "prompt" (the full prompt text) and "structured" (the breakdown object).`;

  try {
    const completion = await openrouter.chat.completions.create({
      model: MODELS.generation,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: idea },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error('No response from AI model');
    }

    const result = JSON.parse(content);
    const generationTime = Date.now() - startTime;
    
    // 记录生成日志
    const logId = await loggingService.logGeneration({
      userId,
      inputIdea: idea,
      inputModel: targetModel,
      inputStyle: style,
      outputPrompt: result.prompt,
      outputStructured: result.structured,
      generationTime,
      tokensUsed: completion.usage?.total_tokens || 0,
      aiModelUsed: MODELS.generation,
    });
    
    return {
      prompt: result.prompt,
      structured: result.structured,
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

// 类型定义
export interface StructuredPromptData {
  subject: string;
  action: string;
  setting: string;
  shotType: string;
  lighting: string;
  composition: string;
  mood: string[];
  parameters: string;
}

