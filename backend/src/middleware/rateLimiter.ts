import rateLimit from 'express-rate-limit';

/**
 * AI API 速率限制中间件
 * 限制AI生成请求的频率，防止滥用
 */
export const aiRateLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15分钟
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '20'), // 免费用户每15分钟20次请求
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many AI requests. Please try again later or upgrade to Pro.',
    },
  },
  standardHeaders: true, // 返回标准的 RateLimit-* headers
  legacyHeaders: false, // 禁用 X-RateLimit-* headers
  // 修复 trust proxy 警告 - 明确指定 validate 选项
  validate: {
    trustProxy: false, // 禁用 trust proxy 验证（开发环境安全）
  },
  // 为Pro用户跳过限制
  skip: (req) => {
    // 如果用户已认证且是Pro用户，跳过限制
    const user = (req as any).user;
    return user?.subscriptionTier === 'pro';
  },
});

/**
 * 认证API速率限制
 * 防止暴力破解登录
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 5, // 每15分钟最多5次失败尝试
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many login attempts. Please try again later.',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
  validate: {
    trustProxy: false, // 禁用 trust proxy 验证
  },
  // 只对失败的认证请求计数
  skipSuccessfulRequests: true,
});

/**
 * 通用API速率限制
 * 适用于大多数API端点
 */
export const generalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100, // 每15分钟最多100次请求
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests. Please try again later.',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
  validate: {
    trustProxy: false, // 禁用 trust proxy 验证
  },
});

