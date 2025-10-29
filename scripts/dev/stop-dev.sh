#!/bin/bash

# PromptValar 开发环境停止脚本
echo "🛑 停止 PromptValar 开发环境..."

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 停止后端
echo -e "${YELLOW}停止后端服务...${NC}"
BACKEND_PID=$(lsof -ti:5000 2>/dev/null)
if [ ! -z "$BACKEND_PID" ]; then
    kill $BACKEND_PID 2>/dev/null || true
    echo "后端服务已停止 (PID: $BACKEND_PID)"
else
    echo "后端服务未运行"
fi

# 停止前端
echo -e "${YELLOW}停止前端服务...${NC}"
FRONTEND_PID=$(lsof -ti:3000 2>/dev/null)
if [ ! -z "$FRONTEND_PID" ]; then
    kill $FRONTEND_PID 2>/dev/null || true
    echo "前端服务已停止 (PID: $FRONTEND_PID)"
else
    echo "前端服务未运行"
fi

# 清理所有tsx watch进程
TSX_PIDS=$(ps aux | grep "tsx watch" | grep -v grep | awk '{print $2}')
if [ ! -z "$TSX_PIDS" ]; then
    echo -e "${YELLOW}清理tsx进程...${NC}"
    echo "$TSX_PIDS" | xargs kill 2>/dev/null || true
fi

# 清理所有vite进程
VITE_PIDS=$(ps aux | grep "node.*vite" | grep -v grep | awk '{print $2}')
if [ ! -z "$VITE_PIDS" ]; then
    echo -e "${YELLOW}清理vite进程...${NC}"
    echo "$VITE_PIDS" | xargs kill 2>/dev/null || true
fi

echo -e "${GREEN}✅ 开发环境已停止${NC}"

