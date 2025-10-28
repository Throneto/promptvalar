# PromptValar 开发环境配置文档

## 📋 环境概览

### 生产环境
- **前端域名**: https://promptvalar.com
- **后端API域名**: https://api.promptvalar.com
- **部署位置**: `/var/www/promptvalar/`
- **服务用户**: `promptvalar`

### 开发环境
- **前端地址**: http://localhost:3000
- **后端地址**: http://localhost:5000
- **开发目录**: `/root/promptvalar/`

## 🚀 快速开始

### 启动开发环境
```bash
cd /root/promptvalar
./start-dev.sh
```

### 停止开发环境
```bash
cd /root/promptvalar
./stop-dev.sh
```

### 检查环境状态
```bash
cd /root/promptvalar
./check-dev-status.sh
```

## 📁 项目结构

```
/root/promptvalar/
├── backend/              # 后端代码
│   ├── src/             # TypeScript源代码
│   ├── dist/            # 编译后的JavaScript
│   ├── .env             # 后端环境变量
│   └── backend.log      # 后端运行日志
├── frontend/            # 前端代码
│   ├── src/            # React源代码
│   ├── dist/           # 构建后的静态文件
│   ├── .env.development    # 开发环境变量
│   ├── .env.production     # 生产环境变量
│   └── frontend.log    # 前端运行日志
├── start-dev.sh        # 启动开发环境脚本
├── stop-dev.sh         # 停止开发环境脚本
└── check-dev-status.sh # 状态检查脚本
```

## 🔧 环境配置

### 后端环境变量 (.env)

位置: `/root/promptvalar/backend/.env`

```bash
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://promptvalar:throne999000@localhost:5432/promptvalar
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-2024
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
STRIPE_TEST_MODE=true
OPENAI_API_KEY=your_openai_api_key
```

### 前端环境变量

#### 开发环境
位置: `/root/promptvalar/frontend/.env.development`
```bash
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

#### 生产环境
位置: `/root/promptvalar/frontend/.env.production`
```bash
VITE_API_BASE_URL=https://api.promptvalar.com/api/v1
```

## 🌐 Nginx 配置

### 前端配置
- **域名**: promptvalar.com
- **根目录**: `/var/www/promptvalar/frontend/dist`
- **SSL证书**: Let's Encrypt

### 后端API配置
- **域名**: api.promptvalar.com
- **代理地址**: http://localhost:5000
- **SSL证书**: Let's Encrypt

## 📝 开发工作流

### 1. 修改代码
- 前端代码: `/root/promptvalar/frontend/src/`
- 后端代码: `/root/promptvalar/backend/src/`

### 2. 热重载
- **前端**: Vite 自动热重载
- **后端**: tsx watch 自动重启

### 3. 查看日志
```bash
# 查看后端日志
tail -f /root/promptvalar/backend/backend.log

# 查看前端日志
tail -f /root/promptvalar/frontend/frontend.log
```

### 4. 测试API
```bash
# 健康检查
curl http://localhost:5000/health

# 获取prompt列表
curl http://localhost:5000/api/v1/prompts
```

## 🚢 部署到生产环境

### 1. 构建前端
```bash
cd /root/promptvalar/frontend
npm run build
```

### 2. 构建后端
```bash
cd /root/promptvalar/backend
npm run build
```

### 3. 复制到生产目录
```bash
# 前端
sudo cp -r /root/promptvalar/frontend/dist/* /var/www/promptvalar/frontend/dist/

# 后端
sudo cp -r /root/promptvalar/backend/dist/* /var/www/promptvalar/backend/dist/
```

### 4. 重启生产服务
```bash
# 重启后端 (需要根据实际的进程管理方式)
sudo systemctl restart promptvalar-backend
# 或者直接kill进程并重新启动

# 重新加载Nginx
sudo systemctl reload nginx
```

## 🔍 故障排查

### 后端无法启动

1. **检查端口占用**
```bash
lsof -ti:5000
# 如果有进程占用，可以停止
kill $(lsof -ti:5000)
```

2. **检查数据库连接**
```bash
psql -U promptvalar -d promptvalar -c "SELECT 1"
```

3. **查看详细日志**
```bash
cd /root/promptvalar/backend
npm run dev
```

### 前端无法启动

1. **检查端口占用**
```bash
lsof -ti:3000
# 如果有进程占用，可以停止
kill $(lsof -ti:3000)
```

2. **清理缓存重新安装**
```bash
cd /root/promptvalar/frontend
rm -rf node_modules package-lock.json
npm install
```

### API代理问题

1. **检查vite配置**
```bash
cat /root/promptvalar/frontend/vite.config.ts
```

2. **测试代理**
```bash
# 直接访问后端
curl http://localhost:5000/api/v1/prompts

# 通过前端代理访问
curl http://localhost:3000/api/v1/prompts
```

## 📊 端口使用

| 服务 | 端口 | 用途 |
|------|------|------|
| 前端开发服务器 | 3000 | Vite开发服务器 |
| 后端API服务器 | 5000 | Express API服务器 |
| PostgreSQL | 5432 | 数据库服务 |
| Nginx | 80, 443 | Web服务器和反向代理 |

## 🔐 安全注意事项

1. **环境变量文件**
   - `.env` 文件已添加到 `.gitignore`
   - 不要提交包含敏感信息的环境变量文件

2. **数据库凭证**
   - 定期更新数据库密码
   - 使用强密码

3. **JWT密钥**
   - 生产环境使用独立的JWT密钥
   - 不要在代码中硬编码密钥

## 📞 联系方式

如有问题，请查看相关文档或联系开发团队。

---

**最后更新**: 2025-10-26
**维护者**: PromptValar 开发团队

