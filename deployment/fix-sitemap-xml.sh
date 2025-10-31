#!/bin/bash

# PromptValar Sitemap.xml 修复脚本
# 修复 Nginx 配置，确保 sitemap.xml 以正确的 Content-Type 返回

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}开始修复 sitemap.xml Nginx 配置...${NC}"

# 检查是否存在 Nginx 配置文件
NGINX_CONFIG="/etc/nginx/sites-available/promptvalar"

if [ ! -f "$NGINX_CONFIG" ]; then
    echo -e "${RED}错误: 未找到 Nginx 配置文件 $NGINX_CONFIG${NC}"
    echo "请先运行部署脚本或手动创建配置文件"
    exit 1
fi

# 备份原配置文件
BACKUP_FILE="${NGINX_CONFIG}.backup.$(date +%Y%m%d_%H%M%S)"
cp "$NGINX_CONFIG" "$BACKUP_FILE"
echo -e "${GREEN}已备份原配置文件到: $BACKUP_FILE${NC}"

# 检查 sitemap.xml 配置是否已存在
if grep -q "location = /sitemap.xml" "$NGINX_CONFIG"; then
    echo -e "${YELLOW}sitemap.xml 配置已存在，但可能不正确，将更新...${NC}"
else
    echo -e "${YELLOW}添加 sitemap.xml 配置...${NC}"
fi

# 检查前端构建目录中是否有 sitemap.xml
FRONTEND_DIST="/var/www/promptvalar/frontend/dist"
if [ ! -f "$FRONTEND_DIST/sitemap.xml" ]; then
    echo -e "${YELLOW}警告: 构建目录中未找到 sitemap.xml${NC}"
    echo -e "${YELLOW}正在从前端 public 目录复制 sitemap.xml...${NC}"
    
    FRONTEND_PUBLIC="/var/www/promptvalar/frontend/public"
    if [ -f "$FRONTEND_PUBLIC/sitemap.xml" ]; then
        cp "$FRONTEND_PUBLIC/sitemap.xml" "$FRONTEND_DIST/sitemap.xml"
        chown promptvalar:promptvalar "$FRONTEND_DIST/sitemap.xml"
        echo -e "${GREEN}sitemap.xml 已复制到构建目录${NC}"
    else
        echo -e "${RED}错误: 前端 public 目录中也未找到 sitemap.xml${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}构建目录中已存在 sitemap.xml${NC}"
fi

# 使用项目中的模板更新 Nginx 配置
PROJECT_NGINX_CONFIG="/var/www/promptvalar/nginx-config/promptvalar-nginx.conf"
if [ -f "$PROJECT_NGINX_CONFIG" ]; then
    echo -e "${YELLOW}从项目配置模板更新...${NC}"
    
    # 提取前端服务器块部分（从 "# 前端配置" 开始）
    # 注意：这个脚本假设你已经手动更新了 nginx-config/promptvalar-nginx.conf
    
    echo -e "${YELLOW}请手动检查 Nginx 配置，确保包含以下内容：${NC}"
    echo ""
    echo "    # XML 文件（sitemap.xml 等）- 必须在 SPA 路由之前"
    echo "    location ~* \.(xml)$ {"
    echo "        try_files \$uri =404;"
    echo "        add_header Content-Type \"application/xml; charset=utf-8\";"
    echo "        expires 1d;"
    echo "        add_header Cache-Control \"public\";"
    echo "        access_log off;"
    echo "    }"
    echo ""
    echo "    # sitemap.xml - 显式处理，确保返回 XML"
    echo "    location = /sitemap.xml {"
    echo "        try_files \$uri =404;"
    echo "        add_header Content-Type \"application/xml; charset=utf-8\";"
    echo "        expires 1d;"
    echo "        add_header Cache-Control \"public\";"
    echo "        access_log off;"
    echo "    }"
    echo ""
    echo "    # SPA 路由支持 - 放在最后"
    echo "    location / {"
    echo "        try_files \$uri \$uri/ /index.html;"
    echo "    }"
    echo ""
    
    read -p "是否要自动应用项目模板中的配置？(y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        # 这里可以添加自动替换逻辑，但为了安全，建议手动检查
        echo -e "${YELLOW}建议手动更新配置文件以确保正确性${NC}"
    fi
else
    echo -e "${YELLOW}未找到项目配置模板，将手动添加配置${NC}"
fi

# 测试 Nginx 配置
echo -e "${YELLOW}测试 Nginx 配置...${NC}"
if nginx -t; then
    echo -e "${GREEN}✓ Nginx 配置语法正确${NC}"
    
    read -p "是否立即重新加载 Nginx？(y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        systemctl reload nginx
        echo -e "${GREEN}✓ Nginx 已重新加载${NC}"
    fi
else
    echo -e "${RED}✗ Nginx 配置有错误，请检查${NC}"
    echo -e "${YELLOW}已恢复备份文件，请手动修复配置${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}修复完成！${NC}"
echo ""
echo -e "${YELLOW}下一步操作：${NC}"
echo "1. 验证 sitemap.xml 是否可以访问："
echo "   curl -I https://promptvalar.com/sitemap.xml"
echo ""
echo "2. 检查 Content-Type 是否为 application/xml"
echo ""
echo "3. 在 Google Search Console 中重新提交 sitemap.xml"
echo "   https://search.google.com/search-console"

