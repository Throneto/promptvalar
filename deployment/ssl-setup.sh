#!/bin/bash
# PromptValar - SSL证书自动配置脚本
# 使用Let's Encrypt免费SSL证书

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

if [ "$EUID" -ne 0 ]; then 
  echo "请使用 root 用户或 sudo 运行此脚本"
  exit 1
fi

echo -e "${YELLOW}配置SSL证书...${NC}"
echo ""

# 获取域名
read -p "前端域名 (例如: promptvalar.com): " DOMAIN
read -p "API域名 (例如: api.promptvalar.com): " API_DOMAIN
read -p "邮箱地址 (用于Let's Encrypt通知): " EMAIL

# 安装Certbot
echo -e "${YELLOW}安装Certbot...${NC}"
apt install -y certbot python3-certbot-nginx

# 获取SSL证书
echo -e "${YELLOW}获取SSL证书...${NC}"
certbot --nginx \
  -d $DOMAIN \
  -d $API_DOMAIN \
  --non-interactive \
  --agree-tos \
  --email $EMAIL \
  --redirect

# 测试自动续期
echo -e "${YELLOW}测试证书自动续期...${NC}"
certbot renew --dry-run

echo ""
echo -e "${GREEN}SSL配置完成！${NC}"
echo ""
echo "您的网站现在可以通过HTTPS访问："
echo "https://$DOMAIN"
echo "https://$API_DOMAIN"
echo ""
echo "证书将在到期前自动续期"

