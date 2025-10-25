import { Router } from 'express';
import { optionalAuth } from '../middleware/auth.middleware.js';
import { loggingService } from '../services/loggingService.js';
import { AppError } from '../middleware/errorHandler.js';
import { z } from 'zod';

const router = Router();

// 评分验证schema
const ratingSchema = z.object({
  rating: z.number().int().min(1).max(5),
  isSuccessful: z.boolean(),
  feedback: z.string().optional(),
});

/**
 * 对生成的提示词进行评分
 * POST /api/v1/feedback/generations/:logId/rate
 */
router.post('/generations/:logId/rate', optionalAuth, async (req, res, next) => {
  try {
    const { logId } = req.params;
    
    // 验证请求数据
    const validated = ratingSchema.parse(req.body);
    
    // 记录反馈
    await loggingService.logFeedback(
      logId,
      validated.rating,
      validated.isSuccessful,
      validated.feedback
    );
    
    res.json({
      success: true,
      message: '感谢您的反馈！这将帮助我们改进提示词质量。',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(
        new AppError(400, 'VALIDATION_ERROR', '评分数据无效', {
          errors: error.errors,
        })
      );
    } else {
      next(error);
    }
  }
});

/**
 * 记录用户复制提示词
 * POST /api/v1/feedback/generations/:logId/copy
 */
router.post('/generations/:logId/copy', async (req, res, next) => {
  try {
    const { logId } = req.params;
    
    await loggingService.logUserAction(logId, 'copy');
    
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

/**
 * 记录用户保存提示词
 * POST /api/v1/feedback/generations/:logId/save
 */
router.post('/generations/:logId/save', async (req, res, next) => {
  try {
    const { logId } = req.params;
    
    await loggingService.logUserAction(logId, 'save');
    
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

export default router;

