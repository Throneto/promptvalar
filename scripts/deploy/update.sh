#!/bin/bash
# PromptValar - 更新部署脚本
# 用于从GitHub拉取最新代码并重新部署

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}开始更新PromptValar...${NC}"

cd /var/www/promptvalar

# 1. 拉取最新代码
echo -e "${YELLOW}[1/5] 拉取最新代码...${NC}"
git pull origin main

# 2. 更新后端
echo -e "${YELLOW}[2/5] 更新后端...${NC}"
cd backend
sudo -u promptvalar npm ci --only=production
sudo -u promptvalar npm run build

# 检查是否有新的数据库迁移
echo -e "${YELLOW}[3/5] 检查数据库迁移...${NC}"
sudo -u promptvalar npm run db:migrate

# 3. 更新前端
echo -e "${YELLOW}[4/5] 更新前端...${NC}"
cd ../frontend
sudo -u promptvalar npm ci
sudo -u promptvalar npm run build

# 4. 重启服务
echo -e "${YELLOW}[5/5] 重启服务...${NC}"
pm2 restart promptvalar-backend

# 清理缓存
pm2 flush

echo ""
echo -e "${GREEN}更新完成！${NC}"
echo ""
echo "检查服务状态："
pm2 status
echo ""
echo "查看日志："
echo "pm2 logs promptvalar-backend --lines 50"

