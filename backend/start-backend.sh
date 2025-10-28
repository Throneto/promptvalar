#!/bin/bash

# 进入后端目录
cd /root/promptvalar/backend

# 加载环境变量
export $(cat .env | grep -v '^#' | xargs)

# 检查必需的环境变量
if [ -z "$DATABASE_URL" ]; then
  echo "❌ 错误: DATABASE_URL 未设置"
  exit 1
fi

if [ -z "$JWT_SECRET" ]; then
  echo "❌ 错误: JWT_SECRET 未设置"
  exit 1
fi

if [ -z "$JWT_REFRESH_SECRET" ]; then
  echo "❌ 错误: JWT_REFRESH_SECRET 未设置"
  exit 1
fi

echo "✅ 环境变量检查通过"
echo "🚀 启动后端服务..."

# 启动后端
npm run dev

