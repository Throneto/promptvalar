# 生产环境部署状态与更新指南

## 🔍 当前状态分析

### 环境对比

| 项目 | 开发环境 | 生产环境 | 状态 |
|------|---------|---------|------|
| **位置** | `/root/promptvalar` | `/var/www/promptvalar` | ✅ |
| **域名** | `localhost:3000` | `tablevision.top` | ✅ |
| **最新提交** | bedb0a7 (11分钟前) | c20fab6 (79分钟前) | ⚠️ **不同步** |
| **前端构建** | 2025-10-25 22:59 | 2025-10-25 22:31 | ⚠️ **需要更新** |
| **后端状态** | 开发模式 | PM2运行中 | ✅ |
| **页面语言** | 英文 ✅ | 中文 ⚠️ | ⚠️ **需要部署** |

### ⚠️ 重要发现

**生产环境代码还没有同步最新的英文化修改！**

- ✅ 开发环境已完成英文化（11分钟前提交）
- ⚠️ 生产环境仍是旧版本（79分钟前提交）
- ⚠️ 生产环境网站 `https://tablevision.top` 仍然显示中文内容

---

## 🚀 立即部署到生产环境

### 方案 1: 使用自动部署脚本（推荐）

```bash
# 1. SSH 登录到生产服务器
ssh root@your-server-ip
# 或者如果已经在服务器上，直接执行：

# 2. 进入生产环境目录
cd /var/www/promptvalar

# 3. 拉取最新代码
git pull origin main

# 4. 运行更新脚本
cd deployment
./update.sh
```

**更新脚本会自动完成**：
- ✅ 拉取最新代码
- ✅ 安装/更新依赖
- ✅ 构建前端
- ✅ 构建后端
- ✅ 运行数据库迁移
- ✅ 重启 PM2 服务

### 方案 2: 手动部署（如果脚本失败）

```bash
# 1. SSH 登录到生产服务器
ssh root@your-server-ip

# 2. 拉取最新代码
cd /var/www/promptvalar
git pull origin main

# 3. 更新后端
cd backend
npm ci --only=production
npm run build

# 检查是否有数据库迁移
npm run db:migrate

# 4. 更新前端
cd ../frontend
npm ci
npm run build

# 5. 重启后端服务
pm2 restart promptvalar-backend

# 6. 验证服务状态
pm2 status
pm2 logs promptvalar-backend --lines 50
```

### 方案 3: 从开发环境推送（如果生产环境没有 Git）

```bash
# 在开发环境执行

# 1. 确保所有更改已提交
cd /root/promptvalar
git add .
git commit -m "Update to English UI - production deployment"

# 2. 推送到远程仓库
git push origin main

# 3. 然后在生产服务器执行方案1或方案2
```

---

## 📋 部署前检查清单

在执行部署前，请确认：

- [ ] 开发环境测试通过
- [ ] 所有更改已提交到 Git
- [ ] 数据库备份已完成（重要！）
- [ ] 当前没有用户在使用系统（如果可能）
- [ ] 有回滚计划

### 创建备份（强烈推荐）

```bash
# 在生产服务器执行
cd /var/www/promptvalar/deployment
./backup.sh

# 或手动备份
# 备份数据库
sudo -u postgres pg_dump promptvalar | gzip > /tmp/db_backup_$(date +%Y%m%d_%H%M%S).sql.gz

# 备份前端构建
tar -czf /tmp/frontend_backup_$(date +%Y%m%d_%H%M%S).tar.gz /var/www/promptvalar/frontend/dist/
```

---

## 🔍 部署后验证

### 1. 检查服务状态

```bash
# 查看 PM2 状态
pm2 status

# 查看应用日志
pm2 logs promptvalar-backend --lines 50

# 查看错误日志
pm2 logs promptvalar-backend --err --lines 20
```

### 2. 验证网站访问

```bash
# 测试后端 API
curl -I https://api.tablevision.top/health

# 测试前端访问
curl -I https://tablevision.top

# 测试具体页面（需要登录）
curl -s https://tablevision.top | grep -o "<title>.*</title>"
```

### 3. 浏览器测试

**重要：清除浏览器缓存！**

1. 访问 `https://tablevision.top`
2. 按 `Ctrl + Shift + Delete` 清除缓存
3. 或使用硬刷新 `Ctrl + Shift + R`
4. 登录账户
5. 访问以下页面验证英文化：
   - My Prompts: `https://tablevision.top/dashboard/prompts`
   - My Favorites: `https://tablevision.top/dashboard/favorites`

### 4. 功能测试清单

- [ ] 首页正常显示
- [ ] 登录/注册功能正常
- [ ] My Prompts 页面显示英文
- [ ] My Favorites 页面显示英文
- [ ] 搜索功能正常
- [ ] 排序功能正常
- [ ] 删除/取消收藏功能正常
- [ ] 通知消息显示英文

---

## 🐛 常见问题排查

### 问题 1: Git pull 失败

```bash
# 查看 Git 状态
git status

# 如果有未提交的更改
git stash
git pull origin main
git stash pop

# 如果有冲突
git reset --hard origin/main
```

### 问题 2: npm install 失败

```bash
# 清除 npm 缓存
npm cache clean --force

# 删除 node_modules 重新安装
rm -rf node_modules package-lock.json
npm install
```

### 问题 3: 构建失败

```bash
# 查看构建日志
npm run build 2>&1 | tee build.log

# 检查磁盘空间
df -h

# 检查内存
free -h
```

### 问题 4: PM2 重启失败

```bash
# 停止并删除旧进程
pm2 delete promptvalar-backend

# 重新启动
cd /var/www/promptvalar/deployment
pm2 start ecosystem.config.js

# 保存 PM2 配置
pm2 save
```

### 问题 5: 页面仍然显示中文

**原因：Nginx 缓存或浏览器缓存**

```bash
# 方案1: 清除 Nginx 缓存
sudo systemctl reload nginx

# 方案2: 重启 Nginx
sudo systemctl restart nginx

# 方案3: 检查前端构建文件
ls -lh /var/www/promptvalar/frontend/dist/
cat /var/www/promptvalar/frontend/dist/index.html | head -20

# 方案4: 强制重新构建前端
cd /var/www/promptvalar/frontend
rm -rf dist node_modules/.vite
npm run build
```

---

## 📊 部署时间估算

| 步骤 | 预计时间 |
|------|---------|
| Git pull | 10-30秒 |
| 后端依赖安装 | 1-2分钟 |
| 后端构建 | 30秒-1分钟 |
| 数据库迁移 | 5-10秒 |
| 前端依赖安装 | 2-3分钟 |
| 前端构建 | 1-2分钟 |
| PM2 重启 | 5-10秒 |
| **总计** | **约 5-8 分钟** |

---

## 🔄 回滚计划

如果部署后出现问题，可以快速回滚：

```bash
# 方案1: 回滚到之前的 Git 提交
cd /var/www/promptvalar
git log --oneline -5  # 查看最近5次提交
git reset --hard c20fab6  # 回滚到之前的提交
./deployment/update.sh

# 方案2: 恢复备份
# 恢复数据库
gunzip < /tmp/db_backup_*.sql.gz | sudo -u postgres psql promptvalar

# 恢复前端
tar -xzf /tmp/frontend_backup_*.tar.gz -C /
sudo systemctl reload nginx
```

---

## 📝 部署命令速查表

```bash
# === 快速部署（推荐） ===
ssh root@your-server-ip
cd /var/www/promptvalar
git pull origin main
./deployment/update.sh

# === 验证部署 ===
pm2 status
pm2 logs --lines 50
curl -I https://tablevision.top

# === 清除缓存 ===
sudo systemctl reload nginx
pm2 flush

# === 查看日志 ===
pm2 logs promptvalar-backend
tail -f /var/log/nginx/error.log

# === 紧急回滚 ===
git reset --hard c20fab6
./deployment/update.sh
```

---

## ✅ 部署成功标志

当看到以下内容时，说明部署成功：

1. **PM2 状态**：
   ```
   ┌─────┬────────────────────┬──────┬────────┬─────────┐
   │ id  │ name               │ mode │ status │ restart │
   ├─────┼────────────────────┼──────┼────────┼─────────┤
   │ 0   │ promptvalar-backend│ fork │ online │ 0       │
   └─────┴────────────────────┴──────┴────────┴─────────┘
   ```

2. **前端文件已更新**：
   ```bash
   ls -lh /var/www/promptvalar/frontend/dist/
   # 显示最新的构建时间
   ```

3. **网站访问正常**：
   - ✅ `https://tablevision.top` 正常打开
   - ✅ My Prompts 页面显示英文
   - ✅ My Favorites 页面显示英文
   - ✅ 所有功能正常工作

4. **Git 提交同步**：
   ```bash
   cd /var/www/promptvalar
   git log -1
   # 显示最新提交：bedb0a7
   ```

---

## 🎯 下一步行动

1. **立即执行**：运行部署脚本更新生产环境
2. **验证**：访问 https://tablevision.top 确认英文化生效
3. **监控**：观察日志确保无错误
4. **通知**：如果有用户，告知已更新

---

## 📞 需要帮助？

如果部署过程中遇到问题：

1. 查看本文档的"常见问题排查"部分
2. 检查日志：`pm2 logs promptvalar-backend`
3. 查看 Nginx 日志：`tail -f /var/log/nginx/error.log`
4. 检查系统资源：`free -h` 和 `df -h`

---

**准备好了吗？开始部署到生产环境吧！** 🚀

*最后更新时间：2025-10-25 23:15*

