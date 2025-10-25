import { Router } from 'express';
import * as promptController from '../controllers/prompt.controller.js';
import { authenticate, optionalAuth } from '../middleware/auth.middleware.js';

const router = Router();

/**
 * 提示词路由
 * Base URL: /api/v1/prompts
 */

// 公开路由（不需要认证，但可以选择性认证以获取收藏状态）
router.get('/', optionalAuth, promptController.getPrompts);
router.get('/:id', optionalAuth, promptController.getPromptById);

// 需要认证的路由
router.post('/', authenticate, promptController.createPrompt);
router.put('/:id', authenticate, promptController.updatePrompt);
router.delete('/:id', authenticate, promptController.deletePrompt);

// 收藏相关路由
router.post('/:id/favorite', authenticate, promptController.toggleFavorite);
router.get('/favorites/me', authenticate, promptController.getUserFavorites);

export default router;

