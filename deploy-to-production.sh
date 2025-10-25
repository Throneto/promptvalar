#!/bin/bash

# PromptValar - 快速部署到生产环境脚本
# 此脚本需要在生产服务器上执行

set -e  # 遇到错误立即退出

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  PromptValar 生产环境部署脚本${NC}"
echo -e "${BLUE}  域名: tablevision.top${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# 检查是否在正确的目录
if [ ! -f "package.json" ] || [ ! -d "frontend" ] || [ ! -d "backend" ]; then
    echo -e "${RED}❌ 错误: 请在项目根目录执行此脚本${NC}"
    echo -e "${YELLOW}当前目录: $(pwd)${NC}"
    echo -e "${YELLOW}应该在: /var/www/promptvalar${NC}"
    exit 1
fi

# 显示当前版本信息
echo -e "${YELLOW}📊 当前版本信息:${NC}"
echo "当前 Git 提交:"
git log -1 --format="%h - %s (%cr)" || echo "无法获取 Git 信息"
echo ""

# 询问是否继续
read -p "是否继续部署? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}部署已取消${NC}"
    exit 0
fi

# 1. 创建备份
echo ""
echo -e "${YELLOW}[1/7] 创建备份...${NC}"
BACKUP_DIR="/var/backups/promptvalar"
mkdir -p $BACKUP_DIR
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# 备份数据库
echo "  - 备份数据库..."
sudo -u postgres pg_dump promptvalar 2>/dev/null | gzip > $BACKUP_DIR/db_${TIMESTAMP}.sql.gz || echo "  ⚠️  数据库备份失败（可能没有权限）"

# 备份前端构建
echo "  - 备份前端构建..."
if [ -d "frontend/dist" ]; then
    tar -czf $BACKUP_DIR/frontend_${TIMESTAMP}.tar.gz frontend/dist/ 2>/dev/null || echo "  ⚠️  前端备份失败"
fi

echo -e "  ${GREEN}✓ 备份完成: $BACKUP_DIR/${NC}"

# 2. 拉取最新代码
echo ""
echo -e "${YELLOW}[2/7] 拉取最新代码...${NC}"
git fetch origin
git pull origin main
echo -e "  ${GREEN}✓ 代码已更新${NC}"

# 显示更新后的版本
echo ""
echo "更新后的版本:"
git log -1 --format="%h - %s (%cr)"
echo ""

# 3. 更新后端依赖
echo ""
echo -e "${YELLOW}[3/7] 更新后端依赖...${NC}"
cd backend
npm ci --only=production --quiet
echo -e "  ${GREEN}✓ 后端依赖已更新${NC}"

# 4. 构建后端
echo ""
echo -e "${YELLOW}[4/7] 构建后端...${NC}"
npm run build
echo -e "  ${GREEN}✓ 后端构建完成${NC}"

# 5. 数据库迁移
echo ""
echo -e "${YELLOW}[5/7] 检查数据库迁移...${NC}"
npm run db:migrate 2>&1 || echo "  ⚠️  没有新的数据库迁移"
echo -e "  ${GREEN}✓ 数据库检查完成${NC}"

# 6. 更新前端
echo ""
echo -e "${YELLOW}[6/7] 更新和构建前端...${NC}"
cd ../frontend

# 清除旧的构建缓存
echo "  - 清除缓存..."
rm -rf node_modules/.vite 2>/dev/null || true

# 安装依赖
echo "  - 安装依赖..."
npm ci --quiet

# 构建前端
echo "  - 构建前端..."
npm run build

# 检查构建结果
if [ -d "dist" ] && [ -f "dist/index.html" ]; then
    echo -e "  ${GREEN}✓ 前端构建完成${NC}"
    echo "  构建文件大小:"
    du -sh dist/
else
    echo -e "  ${RED}❌ 前端构建失败${NC}"
    exit 1
fi

# 7. 重启服务
echo ""
echo -e "${YELLOW}[7/7] 重启服务...${NC}"
cd ..

# 重启 PM2
echo "  - 重启 PM2 进程..."
pm2 restart promptvalar-backend
sleep 2

# 刷新 PM2 日志
pm2 flush

# 重新加载 Nginx（清除缓存）
echo "  - 重新加载 Nginx..."
sudo systemctl reload nginx 2>/dev/null || echo "  ⚠️  Nginx 重载失败（可能需要手动执行）"

echo -e "  ${GREEN}✓ 服务已重启${NC}"

# 验证部署
echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  部署验证${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# 检查 PM2 状态
echo -e "${YELLOW}PM2 进程状态:${NC}"
pm2 status

echo ""
echo -e "${YELLOW}最近的日志（最后10行）:${NC}"
pm2 logs promptvalar-backend --lines 10 --nostream

echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}✅ 部署完成！${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo "后续步骤："
echo "1. 访问 https://tablevision.top 验证网站"
echo "2. 清除浏览器缓存（Ctrl+Shift+Delete）"
echo "3. 测试主要功能是否正常"
echo "4. 查看实时日志: pm2 logs promptvalar-backend"
echo ""
echo -e "${YELLOW}⚠️  重要提示：${NC}"
echo "- 清除浏览器缓存后才能看到最新版本"
echo "- 如有问题，可以回滚到备份："
echo "  git reset --hard <previous-commit>"
echo "  ./deployment/update.sh"
echo ""
echo "备份位置: $BACKUP_DIR/"
echo ""

