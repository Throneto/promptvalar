#!/bin/bash
# 订阅系统后端启动脚本

echo "🚀 启动 PromptValar 订阅系统后端..."

# 停止旧进程
pkill -9 -f "node.*promptvalar" 2>/dev/null
pkill -9 -f "tsx.*src/index" 2>/dev/null
sleep 2

# 进入后端目录
cd /root/promptvalar/backend

# 设置环境变量
export DATABASE_URL="postgresql://promptvalar:throne999000@localhost:5432/promptvalar"
export STRIPE_TEST_MODE=true
export STRIPE_SECRET_KEY=sk_test_placeholder
export STRIPE_WEBHOOK_SECRET=whsec_test_placeholder
export STRIPE_PRO_PRICE_ID=price_test_pro
export OPENAI_API_KEY=sk-test-key
export OPENROUTER_API_KEY=sk-test-key
export NODE_ENV=development
export PORT=5001
export CORS_ORIGIN=http://localhost:5173
export JWT_SECRET=dev-jwt-secret
export JWT_REFRESH_SECRET=dev-refresh-secret

echo "✅ 环境变量已设置"
echo "📝 测试模式: $STRIPE_TEST_MODE"
echo "🔌 端口: $PORT"

# 启动服务
echo "🔄 启动服务..."
npx tsx src/index.ts

