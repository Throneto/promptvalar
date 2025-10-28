#!/bin/bash

# 修复生产环境部署脚本
# 解决 tsc not found 问题

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}🔧 修复生产环境部署...${NC}"
echo ""

# 进入后端目录
cd /var/www/promptvalar/backend

echo -e "${YELLOW}[1/4] 安装所有依赖（包括 TypeScript）...${NC}"
npm install
echo -e "${GREEN}✓ 依赖安装完成${NC}"
echo ""

echo -e "${YELLOW}[2/4] 构建后端...${NC}"
npm run build
echo -e "${GREEN}✓ 后端构建完成${NC}"
echo ""

echo -e "${YELLOW}[3/4] 清理开发依赖（可选）...${NC}"
npm prune --production
echo -e "${GREEN}✓ 开发依赖已清理${NC}"
echo ""

echo -e "${YELLOW}[4/4] 重启 PM2 服务...${NC}"
pm2 restart promptvalar-backend
sleep 2
pm2 status
echo -e "${GREEN}✓ 服务已重启${NC}"
echo ""

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✅ 后端修复完成！${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# 构建前端
echo -e "${YELLOW}是否需要构建前端？ (y/n)${NC}"
read -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}构建前端...${NC}"
    cd /var/www/promptvalar/frontend
    npm ci
    npm run build
    echo -e "${GREEN}✓ 前端构建完成${NC}"
    
    echo -e "${YELLOW}重新加载 Nginx...${NC}"
    sudo systemctl reload nginx
    echo -e "${GREEN}✓ Nginx 已重新加载${NC}"
fi

echo ""
echo -e "${GREEN}🎉 部署完成！${NC}"
echo ""
echo -e "${YELLOW}测试链接:${NC}"
echo "  前端: https://promptvalar.com"
echo "  API:  https://api.promptvalar.com/health"
echo ""
echo -e "${YELLOW}提示: 请清除浏览器缓存后测试${NC}"
