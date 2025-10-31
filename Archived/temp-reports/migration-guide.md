# PromptValar - 升级迁移指南

当您的业务增长需要更强大的服务器时，按照此指南平滑迁移。

---

## 📊 何时需要升级

### 升级信号

- ⚠️ 内存使用率持续 > 85%
- ⚠️ CPU负载持续 > 1.0
- ⚠️ 响应时间 > 2秒
- ⚠️ 数据库查询变慢
- ⚠️ 用户并发 > 20人
- ⚠️ 数据库大小 > 1GB

### 推荐升级路径

```
1G VPS (MVP阶段)
  ↓
  100-500 UV/天
  ↓
2G VPS (成长期)
  ↓
  500-2000 UV/天
  ↓
4G VPS或云服务 (扩展期)
  ↓
  2000+ UV/天
  ↓
多服务器集群 (成熟期)
```

---

## 🚀 迁移方案

### 方案A: 升级当前VPS（最简单）

**优点**: 保持所有配置，最小停机时间
**适用**: VPS提供商支持原地升级

```bash
# 1. 联系VPS提供商升级套餐（通常2-5分钟停机）
# 2. 升级后检查资源
free -h
df -h

# 3. 优化配置以利用新资源
# 修改PostgreSQL配置（假设升级到2G内存）
sudo nano /etc/postgresql/15/main/conf.d/performance.conf

# 2G内存优化配置
shared_buffers = 512MB
effective_cache_size = 1GB
maintenance_work_mem = 128MB
work_mem = 16MB
max_connections = 50

# 4. 重启服务
sudo systemctl restart postgresql
pm2 restart all

# 5. 如果升级到多核，可以启用PM2 cluster模式
pm2 delete promptvalar-backend
pm2 start ecosystem.config.js --env production
```

### 方案B: 迁移到新服务器（零停机）

**优点**: 可以提前测试，零停机切换
**适用**: 更换VPS提供商或大幅升级

#### 第一阶段：准备新服务器

```bash
# 1. 在新服务器上执行初始部署
bash vps-1g-setup.sh  # 或针对新服务器配置的脚本

# 2. 不要配置DNS，使用临时IP测试
# 测试访问: http://NEW_SERVER_IP
```

#### 第二阶段：数据迁移

```bash
# 在旧服务器上：

# 1. 创建数据库备份
cd /var/www/promptvalar/deployment
bash backup.sh

# 2. 传输备份到新服务器
scp /var/backups/promptvalar/db_*.sql.gz root@NEW_SERVER_IP:/tmp/

# 3. 传输上传文件（如果有）
scp -r /var/www/promptvalar/uploads root@NEW_SERVER_IP:/tmp/

# 在新服务器上：

# 4. 恢复数据库
cd /tmp
gunzip db_*.sql.gz
sudo -u postgres psql promptvalar < db_*.sql

# 5. 恢复上传文件
cp -r /tmp/uploads /var/www/promptvalar/

# 6. 测试新服务器功能
curl http://localhost:5000/health
```

#### 第三阶段：DNS切换（零停机）

```bash
# 1. 降低DNS TTL（提前24小时）
# 在DNS管理面板将TTL设置为300秒（5分钟）

# 2. 确保新服务器完全正常
# 测试所有功能：注册、登录、AI生成等

# 3. 修改DNS记录指向新服务器
# A记录: promptvalar.com → NEW_SERVER_IP
# A记录: api.promptvalar.com → NEW_SERVER_IP

# 4. 等待DNS传播（5-30分钟）
# 检查DNS传播: https://www.whatsmydns.net/

# 5. 监控两台服务器
# 新服务器流量增加，旧服务器流量减少

# 6. 24小时后确认迁移成功，关闭旧服务器
```

---

## 🏢 迁移到云平台（Railway/Render/Fly.io）

### 为什么迁移到云平台？

- ✅ 自动扩展
- ✅ 内置数据库和Redis
- ✅ 自动备份
- ✅ 更好的监控
- ✅ 全球CDN
- ✅ 零运维

### 推荐平台对比

| 平台 | 免费额度 | 价格 | 优势 |
|------|---------|------|------|
| **Railway** | $5/月 | ~$20/月 | 简单易用，支持PostgreSQL |
| **Render** | 750小时/月 | ~$25/月 | 自动SSL，全球CDN |
| **Fly.io** | 3个小服务 | ~$15/月 | 全球部署，边缘计算 |
| **Vercel** | 免费 | 前端免费 | 最佳前端体验 |

### Railway部署（推荐）

```bash
# 1. 安装Railway CLI
npm install -g @railway/cli

# 2. 登录Railway
railway login

# 3. 创建新项目
railway init

# 4. 添加PostgreSQL
railway add postgresql

# 5. 添加Redis
railway add redis

# 6. 部署后端
cd backend
railway up

# 7. 部署前端到Vercel
cd ../frontend
npm install -g vercel
vercel --prod
```

配置Railway环境变量（自动获取数据库URL）：

```bash
# 在Railway Dashboard配置
NODE_ENV=production
JWT_SECRET=your-secret
JWT_REFRESH_SECRET=your-refresh-secret
OPENROUTER_API_KEY=your-key
CORS_ORIGIN=https://your-vercel-app.vercel.app
```

---

## 📦 Docker化部署（为Kubernetes做准备）

为未来的大规模部署做准备：

### 创建生产环境Docker配置

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.prod
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
    deploy:
      replicas: 2  # 多实例
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
    restart: always

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.prod
    deploy:
      replicas: 2
    restart: always

  postgres:
    image: postgres:15-alpine
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_DB=promptvalar
      - POSTGRES_USER=promptvalar
      - POSTGRES_PASSWORD=${DB_PASSWORD}

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - backend
      - frontend

volumes:
  postgres_data:
  redis_data:
```

---

## 🔄 渐进式迁移策略

### 阶段1: 静态资源CDN化（立即可做）

```bash
# 使用Cloudflare CDN加速静态资源
# 1. 域名接入Cloudflare（免费）
# 2. 启用自动压缩和缓存
# 3. 可节省30-50%带宽和服务器负载
```

### 阶段2: 数据库分离（500+ UV/天）

```bash
# 将PostgreSQL迁移到托管服务
# - Supabase（免费500MB）
# - Railway（$5/月起）
# - Amazon RDS（$15/月起）

# 优势：
# ✓ 专业的数据库优化
# ✓ 自动备份和恢复
# ✓ 更好的性能
# ✓ 释放VPS资源
```

### 阶段3: 图片存储外部化（有图片上传时）

```bash
# 使用对象存储服务
# - Cloudflare R2（免费10GB）
# - AWS S3（$0.023/GB）
# - Backblaze B2（$0.005/GB）

# 配置示例
UPLOAD_PROVIDER=cloudflare-r2
R2_ACCOUNT_ID=your-account-id
R2_ACCESS_KEY_ID=your-access-key
R2_SECRET_ACCESS_KEY=your-secret-key
R2_BUCKET_NAME=promptvalar-uploads
```

### 阶段4: 负载均衡（2000+ UV/天）

```nginx
# Nginx负载均衡配置
upstream backend_servers {
    least_conn;  # 最少连接算法
    server backend1.example.com:5000;
    server backend2.example.com:5000;
    server backend3.example.com:5000;
}

server {
    location /api {
        proxy_pass http://backend_servers;
    }
}
```

---

## 📊 迁移后验证清单

- [ ] 健康检查API响应正常
- [ ] 用户可以正常注册和登录
- [ ] AI提示词生成功能正常
- [ ] 数据库查询性能正常
- [ ] 静态资源加载正常
- [ ] SSL证书有效
- [ ] 邮件发送正常（如果有）
- [ ] 备份任务运行正常
- [ ] 监控告警配置正常
- [ ] DNS解析正确
- [ ] 旧数据完整迁移

---

## 🆘 回滚方案

如果迁移出现问题：

```bash
# 1. 快速回滚DNS（如果已切换）
# 在DNS管理面板改回旧服务器IP

# 2. 恢复数据库（如果数据有变化）
gunzip < /var/backups/promptvalar/db_latest.sql.gz | sudo -u postgres psql promptvalar

# 3. 重启旧服务器服务
pm2 restart all
sudo systemctl restart nginx

# 4. 验证旧服务器功能
curl http://old-server/health
```

---

## 💡 成本优化建议

### 预算有限（<$20/月）

- 1-2G VPS: DigitalOcean/Vultr/Linode (~$10-12/月)
- Cloudflare CDN (免费)
- Supabase数据库 (免费)
- Vercel前端 (免费)
- **总成本**: ~$10-12/月

### 中等预算（$20-50/月）

- Railway全托管 (~$20/月)
- Cloudflare R2存储 (~$5/月)
- OpenRouter AI API (按使用付费)
- **总成本**: ~$25-35/月

### 大流量（>$100/月）

- AWS/GCP多区域部署
- 专业CDN服务
- 专用数据库实例
- Redis集群
- 完整监控体系

---

## 📞 需要帮助？

遇到迁移问题，请检查：

1. 日志文件: `pm2 logs`
2. 系统状态: `bash deployment/monitor.sh`
3. 数据库连接: `sudo -u postgres psql -d promptvalar`
4. Nginx配置: `nginx -t`

---

**记住**: 提前规划，小步快跑，保留回滚方案！

