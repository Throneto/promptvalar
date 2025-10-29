# PromptValar 故障排查指南

**最后更新**: 2025-10-29  
**版本**: v1.0.0

---

## 📋 目录

1. [登录问题](#登录问题)
2. [订阅系统问题](#订阅系统问题)
3. [API问题](#api问题)
4. [部署问题](#部署问题)
5. [管理员权限问题](#管理员权限问题)
6. [性能问题](#性能问题)
7. [常见错误代码](#常见错误代码)

---

## 🔐 登录问题

### 问题：登录返回500错误

**症状**:
```
POST https://api.promptvalar.com/api/v1/auth/login 500 (Internal Server Error)
```

**原因**:
1. 后端服务端口被占用
2. 环境变量缺失（如JWT_REFRESH_SECRET）
3. 数据库连接失败

**解决方案**:

```bash
# 1. 检查后端服务状态
lsof -i :5000

# 2. 清理旧进程
kill -9 <PID>

# 3. 检查环境变量
cd /root/promptvalar/backend
cat .env | grep JWT_REFRESH_SECRET

# 如果缺失，添加：
echo 'JWT_REFRESH_SECRET=your-super-secret-jwt-refresh-key' >> .env

# 4. 重启后端服务
npm run dev

# 5. 测试登录
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123456"}'
```

### 问题：登录成功但无法访问受保护的页面

**原因**: JWT token未正确存储或已过期

**解决方案**:

```javascript
// 在浏览器控制台检查token
console.log(localStorage.getItem('accessToken'));

// 如果token为空或过期，清除并重新登录
localStorage.clear();
window.location.href = '/login';
```

---

## 💳 订阅系统问题

### 问题：点击"Upgrade to Pro"返回500错误

**症状**:
```
Failed to create checkout session
Request failed with status code 500
```

**原因**:
1. Stripe环境变量缺失
2. PM2配置未更新
3. Stripe未正确初始化

**解决方案**:

```bash
# 1. 检查Stripe环境变量
cd /root/promptvalar/backend
cat .env | grep STRIPE

# 如果缺失，添加测试模式配置：
cat >> .env << EOF
STRIPE_TEST_MODE=true
STRIPE_SECRET_KEY=sk_test_placeholder
STRIPE_WEBHOOK_SECRET=whsec_test_placeholder
STRIPE_PRO_PRICE_ID=price_test_pro
EOF

# 2. 更新PM2配置
nano deployment/ecosystem.config.js
# 添加Stripe相关环境变量

# 3. 重启服务
pm2 restart all

# 4. 测试订阅功能
node test-subscription.js
```

### 问题：订阅激活后状态未更新

**原因**: 前端缓存的用户信息未刷新

**解决方案**:

```javascript
// 在浏览器控制台执行
localStorage.removeItem('user');
window.location.reload();

// 或重新登录获取最新的用户信息
```

---

## 🌐 API问题

### 问题：API返回404错误，URL包含重复的/api/v1

**症状**:
```
https://api.promptvalar.com/api/v1/api/v1/subscriptions/plans
```

**原因**: 环境变量配置错误，导致路径重复

**解决方案**:

```bash
# 1. 清除旧的构建缓存
cd /root/promptvalar/frontend
rm -rf dist node_modules/.vite

# 2. 设置正确的环境变量
export VITE_API_BASE_URL=https://api.promptvalar.com/api/v1

# 3. 重新构建
npm run build

# 4. 同步到生产环境
rsync -av --delete dist/ /var/www/promptvalar/frontend/dist/

# 5. 重新加载Nginx
sudo systemctl reload nginx

# 6. 清除浏览器缓存
# Ctrl + Shift + Delete
```

### 问题：API返回CORS错误

**症状**:
```
Access to fetch at 'https://api.promptvalar.com' from origin 'https://promptvalar.com' has been blocked by CORS policy
```

**原因**: 后端CORS配置不正确

**解决方案**:

```bash
# 检查后端CORS配置
cd /root/promptvalar/backend
cat .env | grep CORS_ORIGIN

# 确保设置正确：
# CORS_ORIGIN=https://promptvalar.com

# 重启后端
pm2 restart all
```

---

## 🚀 部署问题

### 问题：部署后页面仍显示旧版本

**原因**: 多层缓存未清除

**解决方案**:

```bash
# 1. 清除Nginx缓存
sudo systemctl reload nginx

# 2. 如果使用Cloudflare，清除CDN缓存
# 登录Cloudflare控制台 → Caching → Purge Everything

# 3. 清除浏览器缓存
# Ctrl + F5 (Windows) 或 Cmd + Shift + R (Mac)

# 4. 验证部署
curl -I https://promptvalar.com/index.html | grep Cache-Control
# 应该看到: Cache-Control: no-store, no-cache
```

### 问题：前端构建失败

**症状**:
```
Error: Cannot find module '@vitejs/plugin-react'
```

**解决方案**:

```bash
cd /root/promptvalar/frontend

# 清除node_modules
rm -rf node_modules package-lock.json

# 重新安装依赖
npm install

# 重新构建
npm run build
```

### 问题：PM2进程频繁重启

**原因**: 内存不足或代码错误

**解决方案**:

```bash
# 1. 查看PM2日志
pm2 logs --err --lines 100

# 2. 检查内存使用
pm2 monit

# 3. 增加内存限制
# 编辑 deployment/ecosystem.config.js
max_memory_restart: '500M'

# 4. 重启PM2
pm2 restart all
```

---

## 🔐 管理员权限问题

### 问题：无法访问管理后台（被重定向到首页）

**原因**: 用户角色不是admin

**解决方案**:

```bash
# 1. 检查用户角色
sudo -u postgres psql -d promptvalar -c "SELECT email, role FROM users WHERE email = 'your-email@example.com';"

# 2. 设置管理员权限
cd /root/promptvalar
./set-admin.sh your-email@example.com

# 3. 清除浏览器缓存
# 打开浏览器控制台执行：
localStorage.clear();
window.location.reload();

# 4. 重新登录
```

### 问题：管理员页面显示空白

**原因**: 前端类型定义缺少role字段

**解决方案**:

已在代码中修复，确保：

```typescript
// frontend/src/services/auth.service.ts
export interface AuthResponse {
  success: boolean;
  data: {
    user: {
      id: string;
      username: string;
      email: string;
      role: 'user' | 'admin';  // 必须包含
      subscriptionTier: string;
      createdAt: string;
    };
    // ...
  };
}
```

如果问题仍然存在：

```bash
# 1. 拉取最新代码
cd /root/promptvalar
git pull origin main

# 2. 重新构建前端
cd frontend
npm run build

# 3. 清除浏览器缓存并重新登录
```

---

## ⚡ 性能问题

### 问题：数据库查询缓慢

**解决方案**:

```bash
# 1. 检查数据库索引
sudo -u postgres psql -d promptvalar -c "\d+ prompts"

# 2. 运行VACUUM和ANALYZE
sudo -u postgres psql -d promptvalar -c "VACUUM ANALYZE;"

# 3. 查看慢查询
sudo -u postgres psql -d promptvalar -c "SELECT * FROM pg_stat_statements ORDER BY mean_exec_time DESC LIMIT 10;"
```

### 问题：内存使用率过高

**解决方案**:

```bash
# 1. 查看内存使用
free -h
pm2 monit

# 2. 重启服务释放内存
pm2 restart all
sudo systemctl restart postgresql

# 3. 如果持续高，考虑升级VPS配置
```

### 问题：响应时间过长

**解决方案**:

```bash
# 1. 启用缓存
# 已在代码中实现Redis缓存

# 2. 优化数据库查询
# 查看慢查询日志

# 3. 启用CDN
# 使用Cloudflare加速静态资源

# 4. 检查API日志
pm2 logs | grep -E "(slow|timeout)"
```

---

## 🚨 常见错误代码

### HTTP 400 - Bad Request

**原因**: 请求参数格式错误

**解决方案**:
- 检查请求体格式
- 验证必需字段是否完整
- 确认数据类型正确

### HTTP 401 - Unauthorized

**原因**: 未登录或token无效

**解决方案**:
```javascript
// 检查token
console.log(localStorage.getItem('accessToken'));

// 重新登录
localStorage.clear();
window.location.href = '/login';
```

### HTTP 403 - Forbidden

**原因**: 没有权限访问该资源

**解决方案**:
- 确认用户角色
- 检查订阅状态
- 验证权限中间件

### HTTP 404 - Not Found

**原因**: 资源不存在或URL错误

**解决方案**:
- 检查URL是否正确
- 确认资源是否存在
- 查看Nginx配置

### HTTP 500 - Internal Server Error

**原因**: 服务器内部错误

**解决方案**:
```bash
# 查看后端日志
pm2 logs --err --lines 50

# 检查数据库连接
sudo systemctl status postgresql

# 验证环境变量
cat backend/.env
```

### HTTP 502 - Bad Gateway

**原因**: Nginx无法连接到后端

**解决方案**:
```bash
# 1. 检查后端是否运行
pm2 status

# 2. 检查端口
curl http://localhost:5000/health

# 3. 重启服务
pm2 restart all
sudo systemctl restart nginx
```

### HTTP 503 - Service Unavailable

**原因**: 服务暂时不可用

**解决方案**:
```bash
# 检查所有服务状态
pm2 status
sudo systemctl status postgresql
sudo systemctl status nginx

# 重启所有服务
pm2 restart all
sudo systemctl restart postgresql
sudo systemctl restart nginx
```

---

## 🔍 调试技巧

### 1. 查看完整日志

```bash
# 后端日志
pm2 logs --lines 200

# Nginx访问日志
tail -f /var/log/nginx/access.log

# Nginx错误日志
tail -f /var/log/nginx/error.log

# PostgreSQL日志
sudo tail -f /var/log/postgresql/postgresql-15-main.log
```

### 2. 测试API端点

```bash
# 测试健康检查
curl https://api.promptvalar.com/health

# 测试带认证的端点
curl -H "Authorization: Bearer $TOKEN" \
     https://api.promptvalar.com/api/v1/subscriptions/current

# 查看完整响应
curl -v https://api.promptvalar.com/api/v1/prompts
```

### 3. 检查服务状态

```bash
# 创建状态检查脚本
cat > check-status.sh << 'EOF'
#!/bin/bash
echo "=== PM2 Status ==="
pm2 status

echo -e "\n=== PostgreSQL Status ==="
sudo systemctl status postgresql --no-pager

echo -e "\n=== Nginx Status ==="
sudo systemctl status nginx --no-pager

echo -e "\n=== Memory Usage ==="
free -h

echo -e "\n=== Disk Usage ==="
df -h
EOF

chmod +x check-status.sh
./check-status.sh
```

---

## 📚 相关文档

- [部署指南](./DEPLOYMENT.md) - 生产环境部署
- [订阅系统指南](./SUBSCRIPTION.md) - 订阅系统配置
- [管理员指南](./ADMIN.md) - 管理员后台使用

---

## 🆘 获取帮助

如果问题仍未解决：

1. **查看项目文档** - 阅读相关章节
2. **检查日志** - 查看详细错误信息
3. **搜索Issues** - 查看是否有相同问题
4. **联系支持** - 提供详细的错误信息和日志

**提供问题报告时，请包含**:
- 错误症状和复现步骤
- 相关日志（后端、Nginx）
- 系统环境（VPS配置、系统版本）
- 已尝试的解决方案

---

**保持系统稳定运行！** 🛠️

