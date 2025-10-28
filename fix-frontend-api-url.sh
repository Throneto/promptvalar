#!/bin/bash

# 修复前端 API URL 配置脚本

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}=== 修复前端 API URL 配置 ===${NC}\n"

# 切换到前端目录
cd /var/www/promptvalar/frontend

# 备份当前的构建
echo -e "${YELLOW}备份当前构建...${NC}"
if [ -d "dist" ]; then
    sudo cp -r dist dist.backup.$(date +%Y%m%d_%H%M%S)
fi

# 创建正确的生产环境变量文件
echo -e "${YELLOW}创建环境变量文件...${NC}"
cat > .env.production <<'EOF'
VITE_API_BASE_URL=https://api.promptvalar.com/api/v1
VITE_APP_NAME=PromptValar
VITE_APP_URL=https://promptvalar.com
EOF

echo -e "${GREEN}环境变量文件内容：${NC}"
cat .env.production

# 清理缓存和旧构建
echo -e "\n${YELLOW}清理缓存和旧构建...${NC}"
sudo rm -rf dist .vite node_modules/.vite

# 重新构建
echo -e "${YELLOW}重新构建前端...${NC}"
sudo -u promptvalar npm run build

# 验证构建结果
echo -e "\n${YELLOW}验证构建结果...${NC}"
if [ -d "dist" ]; then
    echo -e "${GREEN}✓ dist 目录已创建${NC}"
    
    # 检查是否有 JS 文件
    js_count=$(find dist -name "*.js" | wc -l)
    echo -e "${GREEN}✓ 找到 $js_count 个 JavaScript 文件${NC}"
    
    # 检查 API URL 配置
    if grep -r "api.promptvalar.com" dist/ > /dev/null 2>&1; then
        echo -e "${GREEN}✓ API URL 已正确嵌入${NC}"
    else
        echo -e "${YELLOW}⚠ 警告：未在构建文件中找到 API URL${NC}"
    fi
else
    echo -e "${RED}✗ 构建失败：dist 目录不存在${NC}"
    exit 1
fi

# 重启 Nginx
echo -e "\n${YELLOW}重新加载 Nginx...${NC}"
sudo systemctl reload nginx

echo -e "\n${GREEN}=== 修复完成！ ===${NC}"
echo -e "\n${YELLOW}请执行以下步骤来验证修复：${NC}"
echo "1. 在浏览器中打开开发者工具 (F12)"
echo "2. 切换到 Network 标签"
echo "3. 清除浏览器缓存 (Ctrl+Shift+Delete)"
echo "4. 硬刷新页面 (Ctrl+Shift+R)"
echo "5. 检查 API 请求的 URL 是否正确："
echo "   正确: https://api.promptvalar.com/api/v1/subscriptions/plans"
echo "   错误: https://api.promptvalar.com/api/v1/api/v1/subscriptions/plans"


