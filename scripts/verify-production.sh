#!/bin/bash
# PromptValar - 生产环境验证脚本
# 用于验证生产环境代码与GitHub仓库的一致性

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

EXPECTED_COMMIT="60c720c"

echo "════════════════════════════════════════════════════════════════"
echo "  PromptValar 生产环境验证"
echo "════════════════════════════════════════════════════════════════"
echo ""

# 检查当前目录
if [ ! -f "package.json" ] || [ ! -d "frontend" ]; then
    echo -e "${RED}错误: 请在项目根目录运行此脚本${NC}"
    exit 1
fi

# 1. 检查Git状态
echo -e "${YELLOW}[1/8] 检查Git状态...${NC}"
CURRENT_COMMIT=$(git rev-parse --short HEAD)
CURRENT_BRANCH=$(git branch --show-current)

echo "  当前分支: $CURRENT_BRANCH"
echo "  当前提交: $CURRENT_COMMIT"
echo "  期望提交: $EXPECTED_COMMIT"

if [ "$CURRENT_COMMIT" = "$EXPECTED_COMMIT" ]; then
    echo -e "  ${GREEN}✓ 提交ID匹配${NC}"
else
    echo -e "  ${RED}✗ 提交ID不匹配！${NC}"
    echo "  请运行: git pull origin main"
fi
echo ""

# 2. 检查关键文件是否存在
echo -e "${YELLOW}[2/8] 检查关键文件...${NC}"
FILES=(
    "frontend/src/contexts/ThemeContext.tsx"
    "frontend/src/components/ThemeToggle.tsx"
    "frontend/src/hooks/useResponsive.ts"
    "frontend/src/utils/browser.ts"
    "frontend/.browserslistrc"
)

ALL_FILES_EXIST=true
for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "  ${GREEN}✓${NC} $file"
    else
        echo -e "  ${RED}✗${NC} $file (缺失)"
        ALL_FILES_EXIST=false
    fi
done
echo ""

# 3. 检查前端依赖
echo -e "${YELLOW}[3/8] 检查前端依赖...${NC}"
cd frontend
if [ -d "node_modules" ]; then
    echo -e "  ${GREEN}✓ node_modules存在${NC}"
    # 检查关键包
    if [ -d "node_modules/lucide-react" ]; then
        echo -e "  ${GREEN}✓ lucide-react已安装（图标库）${NC}"
    else
        echo -e "  ${YELLOW}⚠ lucide-react未安装${NC}"
    fi
else
    echo -e "  ${RED}✗ node_modules不存在，需要运行: npm install${NC}"
fi
echo ""

# 4. 检查Tailwind配置
echo -e "${YELLOW}[4/8] 检查Tailwind配置...${NC}"
if grep -q "darkMode.*class" tailwind.config.js; then
    echo -e "  ${GREEN}✓ 暗色模式已启用${NC}"
else
    echo -e "  ${RED}✗ 暗色模式未配置${NC}"
fi
echo ""

# 5. 检查main.tsx中的ThemeProvider
echo -e "${YELLOW}[5/8] 检查ThemeProvider...${NC}"
if grep -q "ThemeProvider" src/main.tsx; then
    echo -e "  ${GREEN}✓ ThemeProvider已添加${NC}"
else
    echo -e "  ${RED}✗ ThemeProvider未找到${NC}"
fi
echo ""

# 6. 检查index.html的meta标签
echo -e "${YELLOW}[6/8] 检查HTML meta标签...${NC}"
META_TAGS=0
if grep -q "theme-color" index.html; then
    echo -e "  ${GREEN}✓ theme-color meta标签${NC}"
    ((META_TAGS++))
fi
if grep -q "apple-mobile-web-app" index.html; then
    echo -e "  ${GREEN}✓ iOS优化meta标签${NC}"
    ((META_TAGS++))
fi
if grep -q "viewport.*viewport-fit" index.html; then
    echo -e "  ${GREEN}✓ 优化的viewport配置${NC}"
    ((META_TAGS++))
fi
echo "  找到 $META_TAGS/3 个新增meta标签"
echo ""

# 7. 尝试构建（可选）
echo -e "${YELLOW}[7/8] 测试构建...${NC}"
if command -v npm &> /dev/null; then
    echo "  正在执行构建测试..."
    if npm run build > /tmp/promptvalar-build.log 2>&1; then
        echo -e "  ${GREEN}✓ 构建成功${NC}"
        
        # 检查dist目录
        if [ -d "dist" ]; then
            DIST_SIZE=$(du -sh dist/ | cut -f1)
            echo "  构建产物大小: $DIST_SIZE"
            
            # 检查关键文件
            if [ -f "dist/index.html" ]; then
                echo -e "  ${GREEN}✓ dist/index.html存在${NC}"
            fi
            
            if ls dist/assets/*.js &> /dev/null; then
                JS_COUNT=$(ls dist/assets/*.js | wc -l)
                echo "  生成了 $JS_COUNT 个JS文件"
            fi
            
            if ls dist/assets/*.css &> /dev/null; then
                CSS_COUNT=$(ls dist/assets/*.css | wc -l)
                echo "  生成了 $CSS_COUNT 个CSS文件"
            fi
        fi
    else
        echo -e "  ${RED}✗ 构建失败${NC}"
        echo "  查看日志: cat /tmp/promptvalar-build.log"
    fi
else
    echo -e "  ${YELLOW}⚠ npm未安装，跳过构建测试${NC}"
fi
echo ""

# 8. 总结
echo -e "${YELLOW}[8/8] 验证总结${NC}"
echo "════════════════════════════════════════════════════════════════"

CHECKS_PASSED=0
TOTAL_CHECKS=5

if [ "$CURRENT_COMMIT" = "$EXPECTED_COMMIT" ]; then ((CHECKS_PASSED++)); fi
if [ "$ALL_FILES_EXIST" = true ]; then ((CHECKS_PASSED++)); fi
if [ -d "node_modules" ]; then ((CHECKS_PASSED++)); fi
if grep -q "darkMode.*class" tailwind.config.js; then ((CHECKS_PASSED++)); fi
if grep -q "ThemeProvider" src/main.tsx; then ((CHECKS_PASSED++)); fi

echo ""
echo "通过检查: $CHECKS_PASSED/$TOTAL_CHECKS"
echo ""

if [ $CHECKS_PASSED -eq $TOTAL_CHECKS ]; then
    echo -e "${GREEN}✓ 所有检查通过！代码已准备好部署。${NC}"
    echo ""
    echo "下一步："
    echo "1. 如果还没构建，运行: npm run build"
    echo "2. 部署到生产环境"
    echo "3. 访问网站测试主题切换功能"
    exit 0
else
    echo -e "${YELLOW}⚠ 部分检查未通过，请修复后再部署。${NC}"
    echo ""
    echo "建议操作："
    echo "1. 确保在main分支: git checkout main"
    echo "2. 拉取最新代码: git pull origin main"
    echo "3. 安装依赖: cd frontend && npm install"
    echo "4. 再次运行验证: bash scripts/verify-production.sh"
    exit 1
fi

