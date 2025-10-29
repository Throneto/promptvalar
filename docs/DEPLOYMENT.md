# PromptValar 部署指南

**最后更新**: 2025-10-29  
**版本**: v1.0.0  
**状态**: ✅ 生产就绪

---

## 📋 目录

1. [快速部署](#快速部署)
2. [Docker部署](#docker部署)
3. [1G VPS优化部署](#1g-vps优化部署)
4. [生产环境配置](#生产环境配置)
5. [域名和SSL配置](#域名和ssl配置)
6. [日常维护](#日常维护)
7. [故障排查](#故障排查)
8. [升级迁移](#升级迁移)

---

## 🚀 快速部署

### 前置要求

- **VPS**: 最低1G内存，20GB硬盘
- **系统**: Ubuntu 20.04/22.04 或 Debian 11/12
- **域名**: 已解析到服务器IP
- **准备信息**:
  - OpenRouter API Key
  - PostgreSQL数据库密码
  - JWT密钥

### 一键部署脚本

```bash
# 1. SSH登录到VPS
ssh root@your-vps-ip

# 2. 克隆项目
git clone https://github.com/your-username/promptvalar.git
cd promptvalar

# 3. 执行部署脚本
cd deployment
chmod +x *.sh
./vps-1g-setup.sh

# 按提示输入配置信息
```

**部署脚本自动完成**:
- ✅ 系统更新和软件安装
- ✅ 创建2GB Swap分区
- ✅ 安装Node.js 18, PostgreSQL 15, Redis 7, Nginx
- ✅ 优化所有服务配置
- ✅ 克隆代码并构建
- ✅ 执行数据库迁移
- ✅ 配置PM2自动重启
- ✅ 配置Nginx反向代理
- ✅ 配置防火墙

**部署时间**: 约10-15分钟

### 配置SSL证书

```bash
cd /var/www/promptvalar/deployment
./ssl-setup.sh

# 输入域名和邮箱信息
```

---

## 🐳 Docker部署

### 开发环境

```bash
# 启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs -f backend

# 停止服务
docker-compose down
```

### 生产环境

```bash
# 1. 创建环境变量文件
cp .env.example .env
nano .env  # 编辑环境变量

# 2. 启动生产环境
docker-compose -f docker-compose.prod.yml up -d

# 3. 查看状态
docker-compose -f docker-compose.prod.yml ps

# 4. 查看日志
docker-compose -f docker-compose.prod.yml logs -f backend
```

### 环境变量配置

创建 `.env.production`:

```bash
# 数据库配置
POSTGRES_DB=promptvalar
POSTGRES_USER=promptvalar
POSTGRES_PASSWORD=your-secure-password

# JWT密钥
JWT_SECRET=your-production-jwt-secret
JWT_REFRESH_SECRET=your-production-refresh-secret

# CORS
CORS_ORIGIN=https://promptvalar.com

# OpenRouter API
OPENROUTER_API_KEY=sk-or-v1-xxxxx

# Stripe配置
STRIPE_TEST_MODE=false
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
STRIPE_PRO_PRICE_ID=price_xxxxx
```

---

## ⚡ 1G VPS优化部署

### 性能优化配置

#### PostgreSQL优化
```ini
# /etc/postgresql/15/main/conf.d/performance.conf
shared_buffers = 64MB
effective_cache_size = 256MB
max_connections = 20
work_mem = 8MB
maintenance_work_mem = 32MB
```

#### Redis优化
```ini
# /etc/redis/redis.conf
maxmemory 64mb
maxmemory-policy allkeys-lru
```

#### Nginx优化
```nginx
worker_processes 1;
worker_connections 512;
gzip on;
gzip_types text/plain text/css application/json application/javascript;
```

### 并发能力

**1G VPS支持**:
- ✅ 10-20个同时在线用户
- ✅ ~100-200 UV/天
- ✅ 数据库大小 < 1GB
- ✅ AI生成请求: 20次/15分钟（免费用户）

---

## 🌐 生产环境配置

### 当前域名配置

- **前端**: https://promptvalar.com
- **API**: https://api.promptvalar.com
- **SSL**: Let's Encrypt 自动续期

### Nginx配置

主配置文件: `/etc/nginx/sites-available/promptvalar`

```nginx
# 前端配置
server {
    listen 80;
    server_name promptvalar.com www.promptvalar.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name promptvalar.com www.promptvalar.com;

    ssl_certificate /etc/letsencrypt/live/promptvalar.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/promptvalar.com/privkey.pem;

    root /var/www/promptvalar/frontend/dist;
    index index.html;

    # 禁用index.html缓存
    location = /index.html {
        add_header Cache-Control "no-store, no-cache, must-revalidate";
        expires off;
    }

    # 静态资源长期缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}

# API配置
server {
    listen 80;
    server_name api.promptvalar.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.promptvalar.com;

    ssl_certificate /etc/letsencrypt/live/promptvalar.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/promptvalar.com/privkey.pem;

    location / {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### PM2配置

文件: `deployment/ecosystem.config.js`

```javascript
module.exports = {
  apps: [{
    name: 'promptvalar-backend',
    script: 'dist/index.js',
    cwd: '/var/www/promptvalar/backend',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 5000,
      DATABASE_URL: 'postgresql://promptvalar:password@localhost:5432/promptvalar',
      JWT_SECRET: 'your-jwt-secret',
      JWT_REFRESH_SECRET: 'your-refresh-secret',
      OPENROUTER_API_KEY: 'sk-or-v1-xxxxx',
      CORS_ORIGIN: 'https://promptvalar.com',
      STRIPE_TEST_MODE: 'true',
      STRIPE_SECRET_KEY: 'sk_test_placeholder',
      STRIPE_WEBHOOK_SECRET: 'whsec_test_placeholder',
      STRIPE_PRO_PRICE_ID: 'price_test_pro',
    },
    max_memory_restart: '250M',
    node_args: '--max-old-space-size=256',
  }]
};
```

---

## 🔐 域名和SSL配置

### SSL证书配置

```bash
# 1. 安装Certbot
sudo apt install -y certbot python3-certbot-nginx

# 2. 获取SSL证书
sudo certbot --nginx -d promptvalar.com -d www.promptvalar.com -d api.promptvalar.com

# 3. 自动续期测试
sudo certbot renew --dry-run
```

### 自动续期

Certbot会自动配置cron任务，证书会在到期前自动续期。

手动续期命令:
```bash
sudo certbot renew
```

---

## 🔄 日常维护

### 代码更新

```bash
cd /var/www/promptvalar
git pull origin main

# 使用更新脚本
./deployment/update.sh
```

更新脚本自动完成:
1. 拉取最新代码
2. 安装新依赖
3. 构建前后端
4. 执行数据库迁移
5. 重启服务

### 手动备份

```bash
cd /var/www/promptvalar/deployment
./backup.sh
```

备份包含:
- 数据库完整导出
- 上传文件
- 环境变量配置

备份位置: `/var/backups/promptvalar/`

### 恢复数据

```bash
# 查看可用备份
ls -lh /var/backups/promptvalar/

# 恢复数据库
gunzip < /var/backups/promptvalar/db_20250129_020000.sql.gz | \
  sudo -u postgres psql promptvalar

# 恢复文件
tar -xzf /var/backups/promptvalar/uploads_*.tar.gz -C /
```

### 日志管理

```bash
# 查看应用日志
pm2 logs

# 查看最近100行
pm2 logs --lines 100

# 只看错误日志
pm2 logs --err

# 清空日志
pm2 flush

# Nginx日志
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

---

## 🐛 故障排查

### 应用无法启动

```bash
# 1. 检查PM2状态
pm2 status

# 2. 查看错误日志
pm2 logs --err --lines 50

# 3. 检查端口占用
lsof -i :5000

# 4. 尝试手动启动
cd /var/www/promptvalar/backend
node dist/index.js
```

### 数据库连接失败

```bash
# 1. 检查PostgreSQL状态
systemctl status postgresql

# 2. 测试连接
sudo -u postgres psql -d promptvalar -c "SELECT 1;"

# 3. 检查连接数
sudo -u postgres psql -c "SELECT count(*) FROM pg_stat_activity;"

# 4. 重启数据库
sudo systemctl restart postgresql
```

### Nginx 502错误

```bash
# 1. 检查后端是否运行
pm2 status

# 2. 检查端口
curl http://localhost:5000/health

# 3. 查看Nginx日志
tail -f /var/log/nginx/error.log

# 4. 重启服务
pm2 restart all
sudo systemctl restart nginx
```

### SSL证书过期

```bash
# 1. 检查证书有效期
certbot certificates

# 2. 手动续期
certbot renew

# 3. 重启Nginx
sudo systemctl restart nginx
```

---

## 🔄 升级迁移

### 何时需要升级

出现以下情况时考虑升级:

⚠️ **性能指标**:
- 内存使用率持续 > 85%
- CPU负载持续 > 1.0
- 响应时间 > 2秒
- 数据库查询变慢

⚠️ **业务指标**:
- 日活用户 > 50人
- 日UV > 500
- 数据库大小 > 1GB
- 频繁出现503错误

### 升级路径

```
阶段1: 1G VPS (MVP)
  ↓ 100-500 UV/天
  
阶段2: 2G VPS (成长期)
  ↓ 500-2000 UV/天
  
阶段3: 4G VPS或云服务 (扩展期)
  ↓ 2000+ UV/天
  
阶段4: 多服务器集群 (成熟期)
```

### 原地升级（最简单）

```bash
# 1. 联系VPS提供商升级配置
# 例如: 1G → 2G

# 2. 升级后优化配置
cd /var/www/promptvalar/deployment

# 修改PostgreSQL配置（2G内存）
sudo nano /etc/postgresql/15/main/conf.d/performance.conf

# 改为:
shared_buffers = 512MB
effective_cache_size = 1GB
max_connections = 50

# 3. 重启服务
sudo systemctl restart postgresql
pm2 restart all
```

---

## 📊 监控和维护

### 系统监控

```bash
# 运行完整监控报告
cd /var/www/promptvalar/deployment
./monitor.sh
```

监控内容:
- ✓ 内存使用率（警告阈值: 85%）
- ✓ 磁盘使用率（警告阈值: 85%）
- ✓ CPU负载
- ✓ PM2进程状态
- ✓ 数据库连接数
- ✓ Redis内存使用
- ✓ Nginx运行状态

### 关键指标

| 指标 | 正常范围 | 警告阈值 | 危险阈值 |
|------|---------|---------|---------|
| 内存使用率 | < 70% | 70-85% | > 85% |
| CPU负载 | < 0.7 | 0.7-1.0 | > 1.0 |
| 磁盘使用率 | < 70% | 70-85% | > 85% |
| 响应时间 | < 500ms | 500ms-2s | > 2s |

---

## 📞 常用命令速查

### 服务管理

```bash
# PM2
pm2 status                      # 查看状态
pm2 restart all                 # 重启所有
pm2 logs                        # 查看日志
pm2 monit                       # 实时监控

# Nginx
sudo systemctl status nginx     # 查看状态
sudo systemctl restart nginx    # 重启
sudo nginx -t                   # 测试配置

# PostgreSQL
sudo systemctl status postgresql
sudo -u postgres psql -d promptvalar

# Redis
sudo systemctl status redis-server
redis-cli ping
```

### 监控命令

```bash
# 系统监控
./deployment/monitor.sh         # 完整报告
htop                           # 资源监控
free -h                        # 内存使用
df -h                          # 磁盘使用
uptime                         # 系统负载

# 日志查看
pm2 logs                       # 应用日志
tail -f /var/log/nginx/error.log  # Nginx日志
```

### 维护命令

```bash
# 更新代码
./deployment/update.sh

# 手动备份
./deployment/backup.sh

# 恢复数据
gunzip < backup.sql.gz | sudo -u postgres psql promptvalar

# 清理日志
pm2 flush
```

---

## ✅ 部署检查清单

### 初始部署后

- [ ] Swap分区已创建（2GB）
- [ ] PostgreSQL运行正常
- [ ] Redis运行正常
- [ ] PM2应用运行正常
- [ ] Nginx运行正常
- [ ] SSL证书已配置
- [ ] 防火墙已配置
- [ ] 自动备份已设置
- [ ] 域名解析正确
- [ ] 健康检查API响应正常
- [ ] 用户可以注册登录
- [ ] AI生成功能正常

### 日常维护

- [ ] 定期查看监控报告
- [ ] 定期检查备份
- [ ] 定期更新系统安全补丁
- [ ] 定期检查磁盘空间
- [ ] 定期查看应用日志

---

## 💰 成本估算

### 方案1: 纯VPS部署

| 项目 | 成本 | 备注 |
|------|------|------|
| 1G VPS | $5-10/月 | DigitalOcean/Vultr/Linode |
| 域名 | $12/年 | .com域名 |
| OpenRouter API | $5-20/月 | 按使用量付费 |
| **总计** | **~$10-15/月** | MVP阶段 |

### 方案2: 混合部署（推荐成长期）

| 项目 | 成本 | 备注 |
|------|------|------|
| 2G VPS | $12/月 | 升级配置 |
| Cloudflare CDN | 免费 | 加速静态资源 |
| Supabase数据库 | 免费 | 500MB限额 |
| OpenRouter API | $10-30/月 | 按使用量 |
| **总计** | **~$22-42/月** | 成长期 |

---

## 📚 相关文档

- [快速开始指南](./QUICK_START.md) - 本地开发环境搭建
- [订阅系统指南](./SUBSCRIPTION.md) - Stripe订阅系统配置
- [管理员指南](./ADMIN.md) - 管理员后台使用
- [测试指南](./TESTING_GUIDE.md) - 测试流程和规范

---

**部署成功标志**:
- ✅ 访问 https://promptvalar.com 正常
- ✅ 访问 https://api.promptvalar.com/health 返回成功
- ✅ 用户可以注册登录
- ✅ AI生成功能正常工作

**祝部署顺利！** 🚀

