# API URL 404 错误修复指南

## 🔍 问题描述

登录时遇到 404 错误：
```
Failed to load resource: api.tablevision.top/auth/login:1
Status: 404 (Not Found)
Error: API endpoint not found
```

## 🎯 根本原因

1. **后端路由配置**：所有 API 路由挂载在 `/api/v1` 路径下
   - 正确的登录端点：`/api/v1/auth/login`
   
2. **前端环境变量错误**：部署时生成的 `VITE_API_BASE_URL` 缺少 `/api/v1` 后缀
   - 错误配置：`VITE_API_BASE_URL=https://api.tablevision.top`
   - 正确配置：`VITE_API_BASE_URL=https://api.tablevision.top/api/v1`

3. **结果**：前端请求 `https://api.tablevision.top/auth/login`，但后端期望 `https://api.tablevision.top/api/v1/auth/login`

## 🔧 修复步骤

### 方法 1：使用自动修复脚本（推荐）

```bash
# 1. 上传修复脚本到服务器
scp deployment/fix-api-url.sh root@your-server:/tmp/

# 2. SSH 连接到服务器
ssh root@your-server

# 3. 运行修复脚本
cd /tmp
chmod +x fix-api-url.sh
./fix-api-url.sh
```

### 方法 2：手动修复

```bash
# 1. SSH 连接到服务器
ssh root@your-server

# 2. 进入前端目录
cd /var/www/promptvalar/frontend

# 3. 创建正确的环境变量文件
cat > .env.production <<EOF
VITE_API_BASE_URL=https://api.tablevision.top/api/v1
VITE_APP_NAME=PromptValar
VITE_APP_URL=https://tablevision.top
EOF

# 4. 验证环境变量
cat .env.production

# 5. 重新构建前端
sudo -u promptvalar npm run build

# 6. 重启 Nginx
sudo systemctl reload nginx
```

## ✅ 验证修复

### 1. 检查后端健康状态
```bash
curl https://api.tablevision.top/health
# 应该返回: {"status":"ok","timestamp":"..."}
```

### 2. 测试登录端点
```bash
curl -X POST https://api.tablevision.top/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@tablevision.top","password":"test123"}'
```

### 3. 浏览器测试

1. **清除浏览器缓存**（重要！）
   - Chrome/Edge: `Ctrl + Shift + Delete`
   - 选择"缓存的图像和文件"
   - 时间范围：全部时间

2. **硬刷新页面**
   - Windows/Linux: `Ctrl + Shift + R`
   - Mac: `Cmd + Shift + R`

3. **打开开发者工具**
   - 按 `F12`
   - 切换到 Console 标签
   - 尝试登录

4. **验证日志输出**
   ```
   应该看到:
   🔐 开始登录...
   📡 发送登录请求到: https://api.tablevision.top/api/v1
   📧 邮箱: test@tablevision.top
   📥 收到响应: 200 OK
   ✅ 登录成功！
   ```

## 🚀 未来部署

为避免类似问题，已更新部署脚本 `deployment/vps-1g-setup.sh`：

```bash
# 修复前
VITE_API_BASE_URL=https://${API_DOMAIN}

# 修复后
VITE_API_BASE_URL=https://${API_DOMAIN}/api/v1
```

## 📋 故障排查

### 问题 1：仍然看到 404 错误

**原因**：浏览器缓存了旧的 JavaScript 文件

**解决**：
```bash
# 1. 确认服务器上的文件已更新
ssh root@your-server
grep -r "api.tablevision.top/api/v1" /var/www/promptvalar/frontend/dist/

# 2. 强制清除 Nginx 缓存
sudo rm -rf /var/cache/nginx/*
sudo systemctl reload nginx

# 3. 在浏览器中打开隐私/无痕窗口测试
```

### 问题 2：后端返回 500 错误

**原因**：数据库连接或配置问题

**解决**：
```bash
# 检查后端日志
pm2 logs promptvalar-backend

# 检查后端环境变量
cat /var/www/promptvalar/backend/.env

# 重启后端
pm2 restart promptvalar-backend
```

### 问题 3：CORS 错误

**原因**：后端 CORS 配置不正确

**解决**：
```bash
# 检查后端 .env 文件
cat /var/www/promptvalar/backend/.env | grep CORS_ORIGIN

# 应该包含:
CORS_ORIGIN=https://tablevision.top

# 如果不正确，编辑文件后重启
pm2 restart promptvalar-backend
```

## 🔍 相关文件

- `backend/src/index.ts` - 路由挂载配置
- `frontend/src/services/auth.service.ts` - API 客户端配置
- `deployment/vps-1g-setup.sh` - 部署脚本（已修复）
- `deployment/fix-api-url.sh` - 快速修复脚本

## 📞 测试账号

```
邮箱: test@tablevision.top
密码: test123
```

## ✨ 预期结果

修复后，登录流程应该正常工作：

1. 用户输入邮箱和密码
2. 前端发送请求到 `https://api.tablevision.top/api/v1/auth/login`
3. 后端验证凭据并返回 JWT tokens
4. 前端保存 tokens 并跳转到工作室页面
5. 用户成功登录 ✅

