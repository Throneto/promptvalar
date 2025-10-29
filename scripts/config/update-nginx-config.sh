#!/bin/bash

# 自动更新 Nginx 配置脚本
# 用途：将域名从 tablevision.top 更新为 promptvalar.com

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Nginx 配置更新脚本${NC}"
echo -e "${BLUE}  promptvalar.com${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# 检查是否有 root 权限
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}❌ 请使用 root 权限运行此脚本${NC}"
    echo "   使用: sudo ./update-nginx-config.sh"
    exit 1
fi

# 备份当前配置
echo -e "${YELLOW}[1/5] 备份当前 Nginx 配置...${NC}"
BACKUP_DIR="/var/backups/nginx"
mkdir -p $BACKUP_DIR
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

if [ -f "/etc/nginx/sites-available/promptvalar" ]; then
    cp /etc/nginx/sites-available/promptvalar $BACKUP_DIR/promptvalar_${TIMESTAMP}.bak
    echo -e "${GREEN}✓ 配置已备份到: $BACKUP_DIR/promptvalar_${TIMESTAMP}.bak${NC}"
else
    echo -e "${YELLOW}⚠ 未找到现有配置文件${NC}"
fi
echo ""

# 复制新配置
echo -e "${YELLOW}[2/5] 部署新的 Nginx 配置...${NC}"
if [ -f "nginx-config/promptvalar-nginx.conf" ]; then
    cp nginx-config/promptvalar-nginx.conf /etc/nginx/sites-available/promptvalar
    echo -e "${GREEN}✓ 新配置已复制${NC}"
else
    echo -e "${RED}❌ 配置文件不存在: nginx-config/promptvalar-nginx.conf${NC}"
    exit 1
fi
echo ""

# 启用配置
echo -e "${YELLOW}[3/5] 启用配置...${NC}"
ln -sf /etc/nginx/sites-available/promptvalar /etc/nginx/sites-enabled/
echo -e "${GREEN}✓ 配置已启用${NC}"
echo ""

# 测试配置
echo -e "${YELLOW}[4/5] 测试 Nginx 配置...${NC}"
if nginx -t 2>&1; then
    echo -e "${GREEN}✓ Nginx 配置测试通过${NC}"
else
    echo -e "${RED}❌ Nginx 配置测试失败${NC}"
    echo -e "${YELLOW}正在恢复备份...${NC}"
    if [ -f "$BACKUP_DIR/promptvalar_${TIMESTAMP}.bak" ]; then
        cp $BACKUP_DIR/promptvalar_${TIMESTAMP}.bak /etc/nginx/sites-available/promptvalar
        echo -e "${GREEN}✓ 配置已恢复${NC}"
    fi
    exit 1
fi
echo ""

# 重新加载 Nginx
echo -e "${YELLOW}[5/5] 重新加载 Nginx...${NC}"
systemctl reload nginx
echo -e "${GREEN}✓ Nginx 已重新加载${NC}"
echo ""

echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}✅ Nginx 配置更新完成！${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

echo -e "${YELLOW}📋 下一步操作：${NC}"
echo ""
echo "1. 配置 SSL 证书（如果还没有）："
echo -e "   ${GREEN}sudo certbot --nginx -d promptvalar.com -d api.promptvalar.com${NC}"
echo ""
echo "2. 验证配置："
echo "   curl -I http://promptvalar.com"
echo "   curl -I http://api.promptvalar.com"
echo ""
echo "3. 查看 Nginx 日志："
echo "   tail -f /var/log/nginx/error.log"
echo "   tail -f /var/log/nginx/access.log"
echo ""

echo -e "${YELLOW}⚠️ 提醒：${NC}"
echo "  • 确保 DNS 已配置指向此服务器"
echo "  • promptvalar.com → $(curl -s ifconfig.me 2>/dev/null || echo '[服务器IP]')"
echo "  • api.promptvalar.com → $(curl -s ifconfig.me 2>/dev/null || echo '[服务器IP]')"
echo ""
