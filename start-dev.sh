#!/bin/bash

# PromptValar 开发环境启动脚本
echo "🚀 启动 PromptValar 开发环境..."

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 检查并停止旧进程
echo -e "${YELLOW}检查旧进程...${NC}"
OLD_BACKEND_PID=$(lsof -ti:5000 2>/dev/null)
if [ ! -z "$OLD_BACKEND_PID" ]; then
    echo "停止旧的后端进程 (PID: $OLD_BACKEND_PID)..."
    kill $OLD_BACKEND_PID 2>/dev/null || true
    sleep 2
fi

OLD_FRONTEND_PID=$(lsof -ti:3000 2>/dev/null)
if [ ! -z "$OLD_FRONTEND_PID" ]; then
    echo "停止旧的前端进程 (PID: $OLD_FRONTEND_PID)..."
    kill $OLD_FRONTEND_PID 2>/dev/null || true
    sleep 2
fi

# 启动后端
echo -e "${GREEN}启动后端服务 (端口 5000)...${NC}"
cd /root/promptvalar/backend
DATABASE_URL="postgresql://promptvalar:throne999000@localhost:5432/promptvalar" \
NODE_ENV=development \
nohup npm run dev > backend.log 2>&1 &
BACKEND_PID=$!
echo "后端进程 PID: $BACKEND_PID"

# 等待后端启动
sleep 5

# 检查后端是否成功启动
if curl -s http://localhost:5000/health > /dev/null; then
    echo -e "${GREEN}✅ 后端启动成功${NC}"
else
    echo -e "${RED}❌ 后端启动失败，请检查日志${NC}"
    tail -20 /root/promptvalar/backend/backend.log
    exit 1
fi

# 启动前端
echo -e "${GREEN}启动前端服务 (端口 3000)...${NC}"
cd /root/promptvalar/frontend
nohup npm run dev > frontend.log 2>&1 &
FRONTEND_PID=$!
echo "前端进程 PID: $FRONTEND_PID"

# 等待前端启动
sleep 5

# 检查前端是否成功启动
if curl -s http://localhost:3000 > /dev/null; then
    echo -e "${GREEN}✅ 前端启动成功${NC}"
else
    echo -e "${RED}❌ 前端启动失败，请检查日志${NC}"
    tail -20 /root/promptvalar/frontend/frontend.log
    exit 1
fi

echo ""
echo -e "${GREEN}🎉 开发环境启动完成！${NC}"
echo ""
echo "📝 服务地址:"
echo "   前端: http://localhost:3000"
echo "   后端: http://localhost:5000"
echo "   API健康检查: http://localhost:5000/health"
echo ""
echo "📋 日志位置:"
echo "   后端日志: /root/promptvalar/backend/backend.log"
echo "   前端日志: /root/promptvalar/frontend/frontend.log"
echo ""
echo "⚠️  注意: 前端已绑定域名 tablevision.top"
echo "   生产环境: https://tablevision.top"
echo "   生产API: https://api.tablevision.top"
echo ""
echo "🛑 停止服务: pkill -f 'tsx watch' && pkill -f 'vite'"

