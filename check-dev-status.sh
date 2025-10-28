#!/bin/bash

# PromptValar 开发环境状态检查脚本
echo "🔍 PromptValar 开发环境状态检查"
echo "=================================="
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查后端
echo -e "${YELLOW}[后端服务]${NC}"
BACKEND_PID=$(lsof -ti:5000 2>/dev/null)
if [ ! -z "$BACKEND_PID" ]; then
    echo -e "${GREEN}✅ 后端服务运行中 (PID: $BACKEND_PID)${NC}"
    BACKEND_HEALTH=$(curl -s http://localhost:5000/health)
    if [ ! -z "$BACKEND_HEALTH" ]; then
        echo -e "${GREEN}✅ 健康检查通过: $BACKEND_HEALTH${NC}"
    else
        echo -e "${RED}❌ 健康检查失败${NC}"
    fi
else
    echo -e "${RED}❌ 后端服务未运行${NC}"
fi
echo ""

# 检查前端
echo -e "${YELLOW}[前端服务]${NC}"
FRONTEND_PID=$(lsof -ti:3000 2>/dev/null)
if [ ! -z "$FRONTEND_PID" ]; then
    echo -e "${GREEN}✅ 前端服务运行中 (PID: $FRONTEND_PID)${NC}"
    FRONTEND_CHECK=$(curl -s http://localhost:3000 | head -1)
    if [ ! -z "$FRONTEND_CHECK" ]; then
        echo -e "${GREEN}✅ 前端页面可访问${NC}"
    else
        echo -e "${RED}❌ 前端页面无法访问${NC}"
    fi
else
    echo -e "${RED}❌ 前端服务未运行${NC}"
fi
echo ""

# 检查数据库
echo -e "${YELLOW}[数据库连接]${NC}"
DB_CHECK=$(psql -U promptvalar -d promptvalar -c "SELECT 1" 2>&1)
if [[ $DB_CHECK == *"1"* ]]; then
    echo -e "${GREEN}✅ 数据库连接正常${NC}"
else
    echo -e "${RED}❌ 数据库连接失败${NC}"
fi
echo ""

# 检查环境变量文件
echo -e "${YELLOW}[环境变量配置]${NC}"
if [ -f "/root/promptvalar/backend/.env" ]; then
    echo -e "${GREEN}✅ 后端 .env 文件存在${NC}"
else
    echo -e "${RED}❌ 后端 .env 文件不存在${NC}"
fi

if [ -f "/root/promptvalar/frontend/.env.development" ]; then
    echo -e "${GREEN}✅ 前端 .env.development 文件存在${NC}"
    cat /root/promptvalar/frontend/.env.development
else
    echo -e "${RED}❌ 前端 .env.development 文件不存在${NC}"
fi

if [ -f "/root/promptvalar/frontend/.env.production" ]; then
    echo -e "${GREEN}✅ 前端 .env.production 文件存在${NC}"
    cat /root/promptvalar/frontend/.env.production
else
    echo -e "${RED}❌ 前端 .env.production 文件不存在${NC}"
fi
echo ""

# 检查生产环境
echo -e "${YELLOW}[生产环境]${NC}"
PROD_FRONTEND=$(curl -Is https://promptvalar.com | head -1)
if [[ $PROD_FRONTEND == *"200"* ]]; then
    echo -e "${GREEN}✅ 生产前端可访问: https://promptvalar.com${NC}"
else
    echo -e "${YELLOW}⚠️  生产前端状态: $PROD_FRONTEND${NC}"
fi

PROD_API=$(curl -s https://api.promptvalar.com/health)
if [ ! -z "$PROD_API" ]; then
    echo -e "${GREEN}✅ 生产API可访问: https://api.promptvalar.com${NC}"
    echo "   健康检查: $PROD_API"
else
    echo -e "${RED}❌ 生产API无法访问${NC}"
fi
echo ""

# 检查Nginx
echo -e "${YELLOW}[Nginx状态]${NC}"
NGINX_STATUS=$(systemctl is-active nginx)
if [ "$NGINX_STATUS" == "active" ]; then
    echo -e "${GREEN}✅ Nginx 运行中${NC}"
else
    echo -e "${RED}❌ Nginx 未运行${NC}"
fi
echo ""

echo "=================================="
echo "检查完成！"

