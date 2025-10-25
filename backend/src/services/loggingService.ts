import { db } from '../db/index.js';
import { promptGenerationLogs } from '../db/schema.js';
import { eq } from 'drizzle-orm';

/**
 * 生成日志数据接口
 */
interface GenerationLogData {
  userId?: string;
  inputIdea: string;
  inputModel: string;
  inputStyle?: string;
  outputPrompt: string;
  outputStructured?: any;
  generationTime: number;
  tokensUsed: number;
  aiModelUsed: string;
}

/**
 * 日志记录服务
 * 负责记录提示词生成过程和用户反馈
 */
export class LoggingService {
  /**
   * 记录提示词生成
   * @returns 日志ID，供前端使用
   */
  async logGeneration(data: GenerationLogData): Promise<string> {
    try {
      const [log] = await db
        .insert(promptGenerationLogs)
        .values({
          userId: data.userId,
          inputIdea: data.inputIdea,
          inputModel: data.inputModel,
          inputStyle: data.inputStyle,
          outputPrompt: data.outputPrompt,
          outputStructured: data.outputStructured,
          generationTime: data.generationTime,
          tokensUsed: data.tokensUsed,
          aiModelUsed: data.aiModelUsed,
        })
        .returning({ id: promptGenerationLogs.id });
      
      console.log(`[日志] 记录生成: ${log.id}`);
      return log.id;
    } catch (error) {
      console.error('[日志] 记录生成失败:', error);
      // 不阻断主流程，返回空ID
      return '';
    }
  }
  
  /**
   * 记录用户评分和反馈
   */
  async logFeedback(
    logId: string,
    rating: number,
    isSuccessful: boolean,
    feedback?: string
  ): Promise<void> {
    try {
      await db
        .update(promptGenerationLogs)
        .set({
          userRating: rating,
          isSuccessful,
          userFeedback: feedback,
          ratedAt: new Date(),
        })
        .where(eq(promptGenerationLogs.id, logId));
      
      console.log(`[日志] 记录反馈: ${logId}, 评分: ${rating}星`);
    } catch (error) {
      console.error('[日志] 记录反馈失败:', error);
    }
  }
  
  /**
   * 记录用户行为（复制、保存）
   */
  async logUserAction(logId: string, action: 'copy' | 'save'): Promise<void> {
    try {
      const updates: any = {};
      
      if (action === 'copy') {
        updates.wasCopied = true;
      } else if (action === 'save') {
        updates.wasSaved = true;
      }
      
      await db
        .update(promptGenerationLogs)
        .set(updates)
        .where(eq(promptGenerationLogs.id, logId));
      
      console.log(`[日志] 记录行为: ${logId} - ${action}`);
    } catch (error) {
      console.error('[日志] 记录行为失败:', error);
    }
  }
  
  /**
   * 获取生成日志详情
   */
  async getLog(logId: string) {
    try {
      const [log] = await db
        .select()
        .from(promptGenerationLogs)
        .where(eq(promptGenerationLogs.id, logId))
        .limit(1);
      
      return log;
    } catch (error) {
      console.error('[日志] 获取日志失败:', error);
      return null;
    }
  }
}

// 导出单例
export const loggingService = new LoggingService();

