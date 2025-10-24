# PromptValar - 1G VPS 部署指南

完整的单核1G20G VPS优化部署方案，并为后期升级做好准备。

---

## 📋 目录

1. [快速部署](#快速部署)
2. [性能优化](#性能优化)
3. [日常维护](#日常维护)
4. [监控告警](#监控告警)
5. [升级迁移](#升级迁移)
6. [故障排查](#故障排查)

---

## 🚀 快速部署

### 前置准备

**VPS要求:**
- CPU: 1核
- 内存: 1GB
- 硬盘: 20GB
- 系统: Ubuntu 20.04/22.04 或 Debian 11/12
- 网络: 固定公网IP

**需要准备的信息:**
- 域名（已解析到VPS IP）
- GitHub仓库URL
- OpenRouter API Key
- 数据库密码（自己设定）

### 一键部署脚本

```bash
# 1. SSH登录到VPS
ssh root@your-vps-ip

# 2. 下载项目（如果还没有）
git clone https://github.com/your-username/promptvalar.git
cd promptvalar

# 3. 执行部署脚本
cd deployment
chmod +x *.sh
./vps-1g-setup.sh

# 按提示输入：
# - 域名: promptvalar.com
# - API域名: api.promptvalar.com  
# - 数据库密码: (设置一个强密码)
# - JWT Secret: (留空自动生成)
# - GitHub仓库URL: https://github.com/your-username/promptvalar.git
# - OpenRouter API Key: sk-or-v1-...
```

### 部署脚本会自动完成

✅ 系统更新和软件安装
✅ 创建2GB Swap分区
✅ 安装Node.js 18, PostgreSQL 15, Redis 7, Nginx
✅ 优化所有服务配置（针对1G内存）
✅ 克隆代码并构建
✅ 执行数据库迁移
✅ 配置PM2自动重启
✅ 配置Nginx反向代理
✅ 配置防火墙

**部署时间**: 约10-15分钟

### 配置SSL证书

```bash
cd /var/www/promptvalar/deployment
./ssl-setup.sh

# 输入:
# - 前端域名: promptvalar.com
# - API域名: api.promptvalar.com
# - 邮箱: your@email.com
```

### 设置自动备份

```bash
# 编辑crontab
crontab -e

# 添加以下行（每天凌晨2点备份）
0 2 * * * /var/www/promptvalar/deployment/backup.sh
```

### 验证部署

```bash
# 1. 检查服务状态
pm2 status
systemctl status nginx
systemctl status postgresql

# 2. 访问健康检查API
curl https://api.promptvalar.com/health

# 预期响应:
# {"status":"ok","timestamp":"..."}

# 3. 在浏览器访问
# https://promptvalar.com
```

---

## ⚡ 性能优化

### 1G内存优化配置

#### PostgreSQL优化 (已自动配置)

```ini
# /etc/postgresql/15/main/conf.d/performance.conf
shared_buffers = 64MB          # 内存缓冲区
effective_cache_size = 256MB   # 系统缓存
max_connections = 20           # 最大连接数（减少资源占用）
work_mem = 8MB                 # 查询内存
maintenance_work_mem = 32MB    # 维护内存
```

#### Redis优化 (已自动配置)

```ini
# /etc/redis/redis.conf
maxmemory 64mb                 # 最大内存限制
maxmemory-policy allkeys-lru   # 内存满时删除策略
```

#### Node.js优化 (已自动配置)

```javascript
// PM2配置
max_memory_restart: '250M'     // 超过250MB自动重启
node_args: '--max-old-space-size=256'  // 限制堆内存
```

#### Nginx优化 (已自动配置)

```nginx
worker_processes 1;            # 单核CPU
worker_connections 512;        # 减少连接数
gzip on;                       # 启用压缩
```

### 资源使用监控

```bash
# 实时监控
./monitor.sh

# 查看内存
free -h

# 查看进程
htop

# PM2监控
pm2 monit
```

### 并发能力

**1G VPS理论上支持:**
- ✅ 10-20个同时在线用户
- ✅ ~100-200 UV/天
- ✅ 数据库大小 < 1GB
- ✅ AI生成请求: 20次/15分钟（免费用户）

**超出限制的解决方案:**
→ 参考[升级迁移](#升级迁移)章节

---

## 🔄 日常维护

### 代码更新

每次从GitHub推送新代码后，在VPS上执行:

```bash
cd /var/www/promptvalar/deployment
./update.sh
```

更新脚本会自动:
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
- 上传文件（如果有）
- 环境变量配置

备份位置: `/var/backups/promptvalar/`

### 恢复数据

```bash
# 查看可用备份
ls -lh /var/backups/promptvalar/

# 恢复数据库
gunzip < /var/backups/promptvalar/db_20250124_020000.sql.gz | \
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

## 📊 监控告警

### 系统监控

```bash
# 运行完整监控报告
cd /var/www/promptvalar/deployment
./monitor.sh
```

监控内容包括:
- ✓ 内存使用率（警告阈值: 85%）
- ✓ 磁盘使用率（警告阈值: 85%）
- ✓ CPU负载
- ✓ PM2进程状态
- ✓ 数据库连接数
- ✓ Redis内存使用
- ✓ Nginx运行状态
- ✓ 最近日志

### 自动监控

```bash
# 每小时自动检查
crontab -e

# 添加:
0 * * * * /var/www/promptvalar/deployment/monitor.sh >> /var/log/monitor.log
```

### 告警通知（可选）

可以集成Telegram Bot或邮件通知:

```bash
# 在monitor.sh中添加
if [ $MEMORY_PERCENT -gt 90 ]; then
  # 发送Telegram消息
  curl -X POST "https://api.telegram.org/bot${BOT_TOKEN}/sendMessage" \
    -d "chat_id=${CHAT_ID}" \
    -d "text=⚠️ PromptValar内存使用率: ${MEMORY_PERCENT}%"
fi
```

### 关键指标

**需要关注的指标:**

| 指标 | 正常范围 | 警告阈值 | 危险阈值 |
|------|---------|---------|---------|
| 内存使用率 | < 70% | 70-85% | > 85% |
| CPU负载 | < 0.7 | 0.7-1.0 | > 1.0 |
| 磁盘使用率 | < 70% | 70-85% | > 85% |
| 响应时间 | < 500ms | 500ms-2s | > 2s |

**达到警告阈值时的处理:**
→ 参考[升级迁移](#升级迁移)章节

---

## 🔄 升级迁移

### 何时需要升级？

出现以下情况时考虑升级:

⚠️ **性能指标:**
- 内存使用率持续 > 85%
- CPU负载持续 > 1.0
- 响应时间 > 2秒
- 数据库查询变慢

⚠️ **业务指标:**
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

### 升级方案

#### 方案A: 原地升级（最简单）

```bash
# 1. 联系VPS提供商升级配置
# 例如: 1G → 2G (通常2-5分钟停机)

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

#### 方案B: 迁移到新服务器（零停机）

详细步骤请参考: `deployment/migration-guide.md`

要点:
1. 在新服务器部署并测试
2. 备份数据并传输
3. 切换DNS指向
4. 监控新服务器
5. 24小时后关闭旧服务器

#### 方案C: 迁移到云平台

推荐平台:
- **Railway** (~$20/月) - 最简单，一键部署
- **Render** (~$25/月) - 自动SSL，全球CDN
- **Fly.io** (~$15/月) - 边缘计算，全球部署

Railway部署示例:

```bash
# 安装CLI
npm install -g @railway/cli

# 登录
railway login

# 部署
cd backend
railway up
```

### 渐进式优化

**不升级VPS的优化方案:**

1. **启用CDN** (立即可做)
   - 使用Cloudflare (免费)
   - 节省30-50%带宽

2. **数据库外部化** (500+ UV/天)
   - 迁移到Supabase (免费500MB)
   - 或Railway ($5/月起)

3. **图片存储外部化** (有图片上传时)
   - 使用Cloudflare R2 (免费10GB)
   - 或AWS S3

4. **前端CDN部署** (2000+ UV/天)
   - 前端部署到Vercel (免费)
   - 后端保留在VPS

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

### 内存不足

```bash
# 1. 查看内存使用
free -h
ps aux --sort=-%mem | head -10

# 2. 清理缓存
sync; echo 3 > /proc/sys/vm/drop_caches

# 3. 重启占用高的服务
pm2 restart all
sudo systemctl restart postgresql

# 4. 检查是否有内存泄漏
pm2 monit  # 观察内存是否持续增长
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
journalctl -u nginx -f         # 系统日志
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

### 方案3: 全云平台（扩展期）

| 项目 | 成本 | 备注 |
|------|------|------|
| Railway全托管 | $20/月 | 后端+数据库 |
| Vercel前端 | 免费 | CDN加速 |
| Cloudflare R2 | $5/月 | 图片存储 |
| OpenRouter API | $30-50/月 | 高流量 |
| **总计** | **~$55-75/月** | 扩展期 |

---

## 📚 相关文档

- [完整部署文档](./deployment/README.md)
- [升级迁移指南](./deployment/migration-guide.md)
- [项目开发规范](./PROJECT_RULES.md)
- [技术实施计划](./Archived/technical-implementation-plan.md)

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

## 🎯 下一步

1. **立即执行**: 将代码推送到GitHub
2. **准备VPS**: 购买VPS并配置域名解析
3. **运行部署**: 执行 `vps-1g-setup.sh`
4. **配置SSL**: 执行 `ssl-setup.sh`
5. **测试功能**: 验证所有功能正常
6. **设置监控**: 配置自动备份和监控

---

**祝部署顺利！** 🚀

如有问题，请参考[故障排查](#故障排查)或查看详细文档。

