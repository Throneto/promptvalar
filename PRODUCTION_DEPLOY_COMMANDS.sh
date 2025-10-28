#!/bin/bash

# ====================================================================
# 生产服务器部署命令集合
# 在生产服务器上复制并执行这些命令
# ====================================================================

echo "开始部署..."

# 步骤 1: 更新代码和修复后端构建问题
cd /var/www/promptvalar
git pull origin main
./fix-production-deploy.sh

# 步骤 2: 更新 Nginx 配置
sudo ./update-nginx-config.sh

# 步骤 3: 配置 SSL 证书（如果 DNS 已配置）
# 注意：请先确保 DNS 已经生效再运行此命令
echo ""
echo "准备配置 SSL 证书..."
echo "⚠️ 请确保以下 DNS 记录已配置并生效："
echo "   promptvalar.com → $(curl -s ifconfig.me 2>/dev/null)"
echo "   api.promptvalar.com → $(curl -s ifconfig.me 2>/dev/null)"
echo ""
read -p "DNS 已配置？继续配置 SSL? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    sudo certbot --nginx \
      -d promptvalar.com \
      -d www.promptvalar.com \
      -d api.promptvalar.com \
      --email admin@promptvalar.com \
      --agree-tos \
      --non-interactive
fi

# 步骤 4: 验证部署
echo ""
echo "======================================"
echo "验证部署结果..."
echo "======================================"
echo ""

echo "1. PM2 服务状态："
pm2 status

echo ""
echo "2. Nginx 状态："
sudo systemctl status nginx --no-pager

echo ""
echo "3. 测试 API 端点："
curl -I http://localhost:5000/health 2>/dev/null | head -1

echo ""
echo "4. 测试前端（本地）："
curl -I http://localhost 2>/dev/null | head -1

echo ""
echo "======================================"
echo "✅ 部署完成！"
echo "======================================"
echo ""
echo "请在浏览器中测试："
echo "  • https://promptvalar.com"
echo "  • https://api.promptvalar.com/health"
echo ""
echo "查看日志："
echo "  • pm2 logs promptvalar-backend"
echo "  • sudo tail -f /var/log/nginx/error.log"
echo ""
