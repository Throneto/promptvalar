# 生产服务器快速修复命令

## 🚀 直接在服务器上执行这些命令

```bash
# 1. 进入前端目录
cd /var/www/promptvalar/frontend

# 2. 创建正确的环境变量文件
cat > .env.production <<'EOF'
VITE_API_BASE_URL=https://api.tablevision.top/api/v1
VITE_APP_NAME=PromptValar
VITE_APP_URL=https://tablevision.top
EOF

# 3. 验证环境变量（确认内容正确）
echo "=== 环境变量内容 ==="
cat .env.production

# 4. 重新构建前端
sudo -u promptvalar npm run build

# 5. 重启 Nginx
sudo systemctl reload nginx

# 6. 验证后端健康状态
echo "=== 验证后端 ==="
curl https://api.tablevision.top/health

echo ""
echo "✅ 修复完成！"
echo "请在浏览器中："
echo "  1. 清除缓存 (Ctrl+Shift+Delete)"
echo "  2. 硬刷新页面 (Ctrl+Shift+R)"
echo "  3. 重新登录"
```

## 📋 复制粘贴版本（一键执行）

```bash
cd /var/www/promptvalar/frontend && \
cat > .env.production <<'EOF'
VITE_API_BASE_URL=https://api.tablevision.top/api/v1
VITE_APP_NAME=PromptValar
VITE_APP_URL=https://tablevision.top
EOF
&& echo "=== 环境变量 ===" && cat .env.production && \
sudo -u promptvalar npm run build && \
sudo systemctl reload nginx && \
echo "=== 后端健康检查 ===" && curl https://api.tablevision.top/health && \
echo -e "\n\n✅ 修复完成！请清除浏览器缓存后重试"
```

