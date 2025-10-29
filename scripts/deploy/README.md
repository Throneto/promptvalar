# PromptValar 部署文档

完整的生产环境部署和维护指南。

---

## 📁 文件说明

| 文件 | 用途 | 执行频率 |
|------|------|---------|
| `vps-1g-setup.sh` | 初始部署脚本 | 一次 |
| `update.sh` | 代码更新部署 | 每次发布 |
| `backup.sh` | 数据备份 | 每天 |
| `monitor.sh` | 系统监控 | 随时 |
| `ssl-setup.sh` | SSL证书配置 | 一次 |
| `ecosystem.config.js` | PM2配置文件 | 需要时 |
| `migration-guide.md` | 升级迁移指南 | 需要时 |

---

## 🚀 快速开始

### 1. 初始部署（全新VPS）

```bash
# 1. SSH登录到VPS
ssh root@your-server-ip

# 2. 下载部署脚本
wget https://raw.githubusercontent.com/your-username/promptvalar/main/deployment/vps-1g-setup.sh

# 3. 添加执行权限
chmod +x vps-1g-setup.sh

# 4. 运行部署脚本
./vps-1g-setup.sh

# 按提示输入配置信息：
# - 域名
# - 数据库密码
# - GitHub仓库URL
# - OpenRouter API Key
```

部署完成后：

```bash
# 5. 配置SSL证书
cd /var/www/promptvalar/deployment
chmod +x ssl-setup.sh
./ssl-setup.sh

# 6. 设置定时备份
crontab -e
# 添加: 0 2 * * * /var/www/promptvalar/deployment/backup.sh
```

### 2. 代码更新

```bash
# 在VPS上执行
cd /var/www/promptvalar/deployment
./update.sh
```

### 3. 日常监控

```bash
# 查看系统状态
./monitor.sh

# 查看应用日志
pm2 logs

# 查看资源使用
htop
```

---

## 🔧 详细配置

### 系统要求

- **最低配置**: 1核1G内存20G硬盘
- **推荐配置**: 2核2G内存40G硬盘
- **操作系统**: Ubuntu 20.04/22.04, Debian 11/12
- **网络**: 固定公网IP，开放80/443端口

### 软件版本

- Node.js 18+
- PostgreSQL 15
- Redis 7
- Nginx 1.18+
- PM2 Latest

### 端口使用

| 端口 | 服务 | 说明 |
|------|------|------|
| 22 | SSH | 服务器管理 |
| 80 | HTTP | Web访问（自动重定向到443） |
| 443 | HTTPS | 安全Web访问 |
| 5000 | Backend | Node.js应用（仅内网） |
| 5432 | PostgreSQL | 数据库（仅内网） |
| 6379 | Redis | 缓存（仅内网） |

---

## 📊 性能优化

### 1G VPS优化配置

```bash
# PostgreSQL
shared_buffers = 64MB
effective_cache_size = 256MB
max_connections = 20

# Redis
maxmemory 64mb
maxmemory-policy allkeys-lru

# Node.js
--max-old-space-size=256

# Nginx
worker_processes 1
worker_connections 512
```

### 缓存策略

```typescript
// 使用Redis缓存热点数据
// 提示词列表缓存5分钟
await redis.setex('prompts:featured', 300, JSON.stringify(prompts));

// 用户信息缓存15分钟
await redis.setex(`user:${userId}`, 900, JSON.stringify(user));
```

---

## 🔐 安全配置

### 防火墙

```bash
# UFW配置
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

### SSH安全

```bash
# 禁用密码登录，只允许密钥认证
sudo nano /etc/ssh/sshd_config

# 修改：
PasswordAuthentication no
PubkeyAuthentication yes
PermitRootLogin no

# 重启SSH
sudo systemctl restart sshd
```

### Fail2ban（防暴力破解）

```bash
# 安装
apt install fail2ban

# 配置
cat > /etc/fail2ban/jail.local <<EOF
[sshd]
enabled = true
port = 22
filter = sshd
logpath = /var/log/auth.log
maxretry = 3
bantime = 3600

[nginx-limit-req]
enabled = true
filter = nginx-limit-req
logpath = /var/log/nginx/error.log
maxretry = 5
EOF

systemctl restart fail2ban
```

---

## 📈 监控和告警

### PM2监控

```bash
# 实时监控
pm2 monit

# 内存使用超限自动重启
pm2 start ecosystem.config.js --max-memory-restart 250M

# 查看详细信息
pm2 show promptvalar-backend
```

### 日志管理

```bash
# 查看实时日志
pm2 logs --lines 100

# 清空日志
pm2 flush

# 日志轮转
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

### 系统监控脚本

```bash
# 每小时检查一次系统状态
crontab -e
# 添加: 0 * * * * /var/www/promptvalar/deployment/monitor.sh >> /var/log/monitor.log
```

### 告警通知（可选）

```bash
# 使用Telegram Bot发送告警
# 在monitor.sh中添加
if [ $MEMORY_PERCENT -gt 90 ]; then
  curl -X POST "https://api.telegram.org/bot${BOT_TOKEN}/sendMessage" \
    -d "chat_id=${CHAT_ID}" \
    -d "text=⚠️ PromptValar内存使用率: ${MEMORY_PERCENT}%"
fi
```

---

## 🗄️ 备份和恢复

### 自动备份

```bash
# 设置每天凌晨2点自动备份
crontab -e
# 添加: 0 2 * * * /var/www/promptvalar/deployment/backup.sh
```

### 手动备份

```bash
cd /var/www/promptvalar/deployment
./backup.sh
```

### 恢复数据

```bash
# 1. 查看可用备份
ls -lh /var/backups/promptvalar/

# 2. 恢复数据库
gunzip < /var/backups/promptvalar/db_20250124_020000.sql.gz | \
  sudo -u postgres psql promptvalar

# 3. 恢复文件
tar -xzf /var/backups/promptvalar/uploads_20250124_020000.tar.gz -C /
```

---

## 🔄 更新策略

### 滚动更新（零停机）

```bash
# 1. 在测试分支验证
git checkout develop
./update.sh

# 2. 确认无误后合并到main
git checkout main
git merge develop

# 3. 生产环境更新
./update.sh

# PM2会自动重启，保持服务可用
```

### 版本回滚

```bash
# 1. 查看Git历史
git log --oneline

# 2. 回滚到指定版本
git reset --hard <commit-hash>

# 3. 重新部署
./update.sh

# 4. 如需恢复数据库
gunzip < /var/backups/promptvalar/db_latest.sql.gz | \
  sudo -u postgres psql promptvalar
```

---

## 🐛 故障排查

### 应用无法启动

```bash
# 检查PM2状态
pm2 status

# 查看错误日志
pm2 logs promptvalar-backend --err --lines 50

# 检查端口占用
lsof -i :5000

# 手动启动测试
cd /var/www/promptvalar/backend
node dist/index.js
```

### 数据库连接失败

```bash
# 检查PostgreSQL状态
systemctl status postgresql

# 测试数据库连接
sudo -u postgres psql -d promptvalar -c "SELECT 1;"

# 查看数据库日志
tail -f /var/log/postgresql/postgresql-15-main.log

# 检查连接数
sudo -u postgres psql -c "SELECT count(*) FROM pg_stat_activity;"
```

### Nginx配置错误

```bash
# 测试配置文件
nginx -t

# 查看错误日志
tail -f /var/log/nginx/error.log

# 重启Nginx
systemctl restart nginx
```

### 内存不足

```bash
# 检查内存使用
free -h
ps aux --sort=-%mem | head -10

# 清理缓存
sync; echo 3 > /proc/sys/vm/drop_caches

# 重启占用内存高的服务
pm2 restart promptvalar-backend
systemctl restart postgresql
```

---

## 📞 获取帮助

### 常用命令速查

```bash
# 系统状态
./monitor.sh                    # 完整监控报告
pm2 status                      # PM2进程状态
systemctl status nginx          # Nginx状态
systemctl status postgresql     # 数据库状态

# 日志查看
pm2 logs                        # 应用日志
tail -f /var/log/nginx/error.log # Nginx错误日志
journalctl -u nginx -f          # Nginx系统日志

# 服务重启
pm2 restart all                 # 重启应用
systemctl restart nginx         # 重启Nginx
systemctl restart postgresql    # 重启数据库

# 更新和维护
./update.sh                     # 更新代码
./backup.sh                     # 手动备份
```

### 文档链接

- [项目规范](../PROJECT_RULES.md)
- [技术方案](../Archived/technical-implementation-plan.md)
- [升级指南](./migration-guide.md)
- [API文档](../backend/README.md)

---

## ✅ 部署检查清单

初始部署后检查：

- [ ] 服务器已添加Swap分区
- [ ] PostgreSQL正常运行
- [ ] Redis正常运行
- [ ] PM2应用正常运行
- [ ] Nginx正常运行
- [ ] SSL证书已配置
- [ ] 防火墙已配置
- [ ] 自动备份已设置
- [ ] 监控脚本已设置
- [ ] 域名解析正确
- [ ] 健康检查API响应正常
- [ ] 用户可以注册和登录
- [ ] AI生成功能正常

---

**部署愉快！如有问题，请参考故障排查部分或查看日志。** 🚀

