#!/bin/bash

# 前端更新验证脚本
# 用于确认页面是否已更新为英文版本

echo "============================================"
echo "  PromptValar 前端更新验证脚本"
echo "============================================"
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. 检查源文件内容
echo "📝 检查源文件..."
echo "----------------------------------------"

echo -n "MyPromptsPage.tsx 英文化: "
if grep -q "My Prompts" /root/promptvalar/frontend/src/pages/MyPromptsPage.tsx; then
    echo -e "${GREEN}✓ 已完成${NC}"
else
    echo -e "${RED}✗ 未完成${NC}"
fi

echo -n "MyFavoritesPage.tsx 英文化: "
if grep -q "My Favorites" /root/promptvalar/frontend/src/pages/MyFavoritesPage.tsx; then
    echo -e "${GREEN}✓ 已完成${NC}"
else
    echo -e "${RED}✗ 未完成${NC}"
fi

echo ""

# 2. 检查前端服务器状态
echo "🚀 检查前端服务器状态..."
echo "----------------------------------------"

if pgrep -f "vite" > /dev/null; then
    echo -e "${GREEN}✓ 前端服务器正在运行${NC}"
    PORT=$(ps aux | grep vite | grep -o "port [0-9]*" | awk '{print $2}' || echo "3000")
    if [ -z "$PORT" ]; then
        PORT="3000"
    fi
    echo "  端口: $PORT"
else
    echo -e "${RED}✗ 前端服务器未运行${NC}"
    echo -e "${YELLOW}  请运行: cd /root/promptvalar/frontend && npm run dev${NC}"
    exit 1
fi

echo ""

# 3. 测试前端访问
echo "🌐 测试前端访问..."
echo "----------------------------------------"

if curl -s http://localhost:3000 > /dev/null; then
    echo -e "${GREEN}✓ 可以访问 http://localhost:3000${NC}"
    TITLE=$(curl -s http://localhost:3000 | grep -o "<title>.*</title>")
    echo "  页面标题: $TITLE"
else
    echo -e "${RED}✗ 无法访问 http://localhost:3000${NC}"
fi

echo ""

# 4. 检查关键英文文本
echo "🔍 验证关键英文文本..."
echo "----------------------------------------"

check_text() {
    local file=$1
    local text=$2
    if grep -q "$text" "$file"; then
        echo -e "${GREEN}✓${NC} 找到: '$text'"
    else
        echo -e "${RED}✗${NC} 未找到: '$text'"
    fi
}

echo "MyPromptsPage.tsx:"
check_text "/root/promptvalar/frontend/src/pages/MyPromptsPage.tsx" "My Prompts"
check_text "/root/promptvalar/frontend/src/pages/MyPromptsPage.tsx" "Create New Prompt"
check_text "/root/promptvalar/frontend/src/pages/MyPromptsPage.tsx" "Search prompts"

echo ""
echo "MyFavoritesPage.tsx:"
check_text "/root/promptvalar/frontend/src/pages/MyFavoritesPage.tsx" "My Favorites"
check_text "/root/promptvalar/frontend/src/pages/MyFavoritesPage.tsx" "Search favorites"
check_text "/root/promptvalar/frontend/src/pages/MyFavoritesPage.tsx" "Browse Library"

echo ""

# 5. 检查构建文件时间
echo "📦 检查构建状态..."
echo "----------------------------------------"

if [ -d "/root/promptvalar/frontend/dist" ]; then
    BUILD_TIME=$(stat -c %y /root/promptvalar/frontend/dist 2>/dev/null | cut -d' ' -f1,2 | cut -d'.' -f1)
    echo -e "${GREEN}✓${NC} 最新构建时间: $BUILD_TIME"
else
    echo -e "${YELLOW}ℹ${NC} 未找到 dist 目录（开发模式不需要）"
fi

echo ""

# 6. 提供访问链接
echo "🔗 访问链接..."
echo "----------------------------------------"
echo "首页:         http://localhost:3000"
echo "登录:         http://localhost:3000/login"
echo "My Prompts:   http://localhost:3000/dashboard/prompts"
echo "My Favorites: http://localhost:3000/dashboard/favorites"
echo ""

# 7. 重要提示
echo "============================================"
echo -e "${YELLOW}⚠️  重要提示${NC}"
echo "============================================"
echo "1. 必须先登录才能访问 Dashboard 相关页面"
echo "2. 如果页面显示中文，请清除浏览器缓存："
echo "   - Chrome/Edge: Ctrl+Shift+Delete"
echo "   - 或使用硬刷新: Ctrl+Shift+R"
echo "3. 如果仍然显示中文，请运行："
echo "   pkill -f vite && cd /root/promptvalar/frontend && npm run dev"
echo ""
echo "============================================"
echo -e "${GREEN}验证完成！${NC}"
echo "============================================"

