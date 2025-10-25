#!/bin/bash

# PromptValar API URL 快速修复脚本
# 修复前端 API 基础 URL 配置

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}开始修复 API URL 配置...${NC}"

# 获取域名
read -p "请输入 API 域名 (例如: api.tablevision.top): " API_DOMAIN
read -p "请输入前端域名 (例如: tablevision.top): " DOMAIN

# 进入前端目录
cd /var/www/promptvalar/frontend

# 创建正确的环境变量文件
echo -e "${YELLOW}创建新的环境变量文件...${NC}"
cat > .env.production <<EOF
VITE_API_BASE_URL=https://${API_DOMAIN}/api/v1
VITE_APP_NAME=PromptValar
VITE_APP_URL=https://${DOMAIN}
EOF

echo -e "${GREEN}环境变量文件已创建：${NC}"
cat .env.production

# 重新构建前端
echo -e "${YELLOW}重新构建前端...${NC}"
sudo -u promptvalar npm run build

echo -e "${GREEN}构建完成！${NC}"

# 验证构建产物中的 API URL
echo -e "${YELLOW}验证构建产物中的 API URL...${NC}"
if grep -r "api.tablevision.top/api/v1" dist/ > /dev/null 2>&1; then
    echo -e "${GREEN}✓ API URL 配置正确${NC}"
else
    echo -e "${YELLOW}⚠ 警告：在构建产物中未找到完整的 API URL${NC}"
    echo "这可能是正常的，请在浏览器控制台中验证"
fi

# 重启 Nginx 以清除缓存
echo -e "${YELLOW}重启 Nginx...${NC}"
sudo systemctl reload nginx

echo -e "${GREEN}修复完成！${NC}"
echo ""
echo -e "${GREEN}请测试以下端点：${NC}"
echo "  前端: https://${DOMAIN}"
echo "  后端: https://${API_DOMAIN}/health"
echo "  登录: https://${API_DOMAIN}/api/v1/auth/login (POST)"
echo ""
echo -e "${YELLOW}请在浏览器中：${NC}"
echo "  1. 清除浏览器缓存 (Ctrl+Shift+Delete)"
echo "  2. 硬刷新页面 (Ctrl+Shift+R)"
echo "  3. 尝试重新登录"

