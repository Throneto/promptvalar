import { Router } from 'express';
import * as aiController from '../controllers/ai.controller.js';
import { aiRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

/**
 * AI 生成路由
 * Base path: /api/v1/ai
 */

// 生成提示词（应用速率限制）
router.post('/generate-prompt', aiRateLimiter, aiController.generatePrompt);

// 解析提示词
router.post('/parse-prompt', aiRateLimiter, aiController.parsePrompt);

// 获取改进建议
router.post('/suggest', aiRateLimiter, aiController.suggest);

export default router;

