#!/bin/bash

echo "🚀 启动 PromptValar 服务..."

# 停止旧进程
echo "📛 停止旧进程..."
pkill -f "tsx watch src/index.ts" 2>/dev/null
sleep 2

# 启动后端
echo "🔧 启动后端服务..."
cd /root/promptvalar/backend
nohup npm run dev > backend.log 2>&1 &
BACKEND_PID=$!

# 等待后端启动
sleep 5

# 检查后端状态
if curl -s http://localhost:5000/health > /dev/null; then
    echo "✅ 后端服务已启动 (PID: $BACKEND_PID)"
else
    echo "❌ 后端服务启动失败"
    exit 1
fi

# 启动前端（如果需要）
echo "🎨 检查前端服务..."
if ! lsof -i :3000 > /dev/null 2>&1; then
    echo "🎨 启动前端服务..."
    cd /root/promptvalar/frontend
    nohup npm run dev > frontend.log 2>&1 &
    sleep 3
    echo "✅ 前端服务已启动"
else
    echo "ℹ️  前端服务已在运行"
fi

echo ""
echo "================================"
echo "🎉 所有服务已启动！"
echo "================================"
echo ""
echo "📡 后端 API: http://localhost:5000"
echo "🌐 前端页面: http://localhost:3000 或 http://localhost:3001"
echo ""
echo "📝 查看日志:"
echo "  后端: tail -f /root/promptvalar/backend/backend.log"
echo "  前端: tail -f /root/promptvalar/frontend/frontend.log"
echo ""
