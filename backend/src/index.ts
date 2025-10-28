import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import aiRoutes from './routes/ai.routes.js';
import promptRoutes from './routes/prompt.routes.js';
import feedbackRoutes from './routes/feedback.routes.js';
import subscriptionRoutes from './routes/subscription.routes.js';
import adminRoutes from './routes/admin.routes.js';
import sitemapRoutes from './routes/sitemap.routes.js';
import { errorHandler } from './middleware/errorHandler.js';

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// 获取当前文件的目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 加载环境变量
dotenv.config({ path: join(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// 信任反向代理（nginx等）
app.set('trust proxy', true);

// 中间件配置
// CORS必须在helmet之前配置
app.use(cors({
  origin: [
    process.env.CORS_ORIGIN || 'http://localhost:3000',
    'https://tablevision.top',
    'http://tablevision.top'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 600,
}));

// Helmet配置 - 禁用一些可能干扰CORS的选项
app.use(helmet({
  crossOriginResourcePolicy: false, // 禁用以避免CORS冲突
  crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
}));

// Stripe webhook 需要 raw body，所以在 express.json() 之前注册
app.post(
  '/api/v1/subscriptions/webhook',
  express.raw({ type: 'application/json' }),
  subscriptionRoutes
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 健康检查端点
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// SEO 路由
app.use('/', sitemapRoutes);

// API路由
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/ai', aiRoutes);
app.use('/api/v1/prompts', promptRoutes);
app.use('/api/v1/feedback', feedbackRoutes);
app.use('/api/v1/subscriptions', subscriptionRoutes);
app.use('/api/v1/admin', adminRoutes);

// 测试路由
app.get('/api/v1/test/subscription', (req, res) => {
  res.json({ message: 'Subscription routes loaded!', testMode: process.env.STRIPE_TEST_MODE });
});

// 404处理
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'API endpoint not found',
    },
  });
});

// 错误处理中间件
app.use(errorHandler);

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;

