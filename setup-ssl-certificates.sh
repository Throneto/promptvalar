#!/bin/bash

# SSL 证书配置脚本
# 第一次部署时使用，获取 SSL 证书并配置 HTTPS

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  SSL 证书配置向导${NC}"
echo -e "${BLUE}  promptvalar.com${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# 检查是否有 root 权限
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}❌ 请使用 root 权限运行此脚本${NC}"
    echo "   使用: sudo ./setup-ssl-certificates.sh"
    exit 1
fi

# 检查 DNS
echo -e "${YELLOW}[1/4] 检查 DNS 配置...${NC}"
DOMAIN_IP=$(dig +short promptvalar.com | head -1)
API_IP=$(dig +short api.promptvalar.com | head -1)
SERVER_IP=$(curl -s ifconfig.me 2>/dev/null || echo "unknown")

echo "  promptvalar.com     → $DOMAIN_IP"
echo "  api.promptvalar.com → $API_IP"
echo "  服务器 IP           → $SERVER_IP"

if [ "$DOMAIN_IP" != "$SERVER_IP" ] || [ "$API_IP" != "$SERVER_IP" ]; then
    echo -e "${RED}⚠️  警告: DNS 可能未正确指向此服务器${NC}"
    echo -e "${YELLOW}   请确认 DNS 已配置并生效后继续${NC}"
    read -p "是否继续? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    echo -e "${GREEN}✓ DNS 配置正确${NC}"
fi
echo ""

# 部署 HTTP-only 配置
echo -e "${YELLOW}[2/4] 部署 HTTP-only Nginx 配置...${NC}"
if [ -f "nginx-config/promptvalar-nginx-http-only.conf" ]; then
    # 备份
    BACKUP_DIR="/var/backups/nginx"
    mkdir -p $BACKUP_DIR
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    if [ -f "/etc/nginx/sites-available/promptvalar" ]; then
        cp /etc/nginx/sites-available/promptvalar $BACKUP_DIR/promptvalar_${TIMESTAMP}.bak
        echo "  已备份现有配置"
    fi
    
    # 复制配置
    cp nginx-config/promptvalar-nginx-http-only.conf /etc/nginx/sites-available/promptvalar
    ln -sf /etc/nginx/sites-available/promptvalar /etc/nginx/sites-enabled/
    
    # 测试配置
    if nginx -t 2>&1; then
        echo -e "${GREEN}✓ HTTP 配置测试通过${NC}"
        systemctl reload nginx
        echo -e "${GREEN}✓ Nginx 已重新加载${NC}"
    else
        echo -e "${RED}❌ Nginx 配置测试失败${NC}"
        exit 1
    fi
else
    echo -e "${RED}❌ 配置文件不存在: nginx-config/promptvalar-nginx-http-only.conf${NC}"
    exit 1
fi
echo ""

# 创建 certbot 验证目录
echo -e "${YELLOW}[3/4] 准备 Let's Encrypt 验证目录...${NC}"
mkdir -p /var/www/certbot
chown -R www-data:www-data /var/www/certbot
echo -e "${GREEN}✓ 验证目录已创建${NC}"
echo ""

# 获取 SSL 证书
echo -e "${YELLOW}[4/4] 获取 SSL 证书...${NC}"
echo -e "${BLUE}正在向 Let's Encrypt 申请证书...${NC}"
echo ""

# 提示输入邮箱
read -p "请输入您的邮箱地址（用于证书续期通知）: " EMAIL
if [ -z "$EMAIL" ]; then
    EMAIL="admin@promptvalar.com"
    echo "  使用默认邮箱: $EMAIL"
fi

# 运行 certbot
if certbot --nginx \
    -d promptvalar.com \
    -d www.promptvalar.com \
    -d api.promptvalar.com \
    --email "$EMAIL" \
    --agree-tos \
    --non-interactive \
    --redirect; then
    
    echo ""
    echo -e "${GREEN}✓ SSL 证书获取成功！${NC}"
    echo -e "${GREEN}✓ Certbot 已自动配置 HTTPS${NC}"
else
    echo ""
    echo -e "${RED}❌ SSL 证书获取失败${NC}"
    echo ""
    echo -e "${YELLOW}可能的原因：${NC}"
    echo "  1. DNS 未完全生效（需要等待几分钟）"
    echo "  2. 防火墙阻止了 80/443 端口"
    echo "  3. 域名配置错误"
    echo ""
    echo -e "${YELLOW}解决方案：${NC}"
    echo "  1. 等待几分钟后重试"
    echo "  2. 检查防火墙: sudo ufw status"
    echo "  3. 确认端口开放: sudo ufw allow 80/tcp && sudo ufw allow 443/tcp"
    echo "  4. 手动重试: sudo certbot --nginx -d promptvalar.com -d api.promptvalar.com"
    exit 1
fi
echo ""

echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}✅ SSL 配置完成！${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

echo -e "${YELLOW}📋 证书信息：${NC}"
certbot certificates 2>/dev/null || echo "  (证书列表不可用)"
echo ""

echo -e "${YELLOW}🌐 测试访问：${NC}"
echo "  • https://promptvalar.com"
echo "  • https://api.promptvalar.com/health"
echo ""

echo -e "${YELLOW}📝 后续维护：${NC}"
echo "  • 查看证书: sudo certbot certificates"
echo "  • 测试续期: sudo certbot renew --dry-run"
echo "  • 手动续期: sudo certbot renew"
echo "  • Nginx 日志: sudo tail -f /var/log/nginx/error.log"
echo ""

echo -e "${GREEN}🎉 部署完成！请在浏览器中访问 https://promptvalar.com${NC}"
echo ""
