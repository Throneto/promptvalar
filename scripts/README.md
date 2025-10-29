# PromptValar 脚本使用指南

本目录包含了 PromptValar 项目的所有管理和运维脚本，按功能分类整理。

## 📁 目录结构

```
scripts/
├── dev/          # 开发环境管理脚本
├── test/         # 测试脚本
├── deploy/       # 生产部署脚本
├── config/       # 配置管理脚本
└── README.md     # 本文档
```

---

## 🔧 开发环境脚本 (`dev/`)

### `start-dev.sh` ⭐️ 推荐
**功能**: 启动完整的开发环境（后端 + 前端）  
**用法**:
```bash
./scripts/dev/start-dev.sh
```
**说明**: 
- 自动停止旧进程
- 启动后端服务（端口 5000）
- 启动前端服务（端口 3000）
- 包含健康检查和日志输出

### `stop-dev.sh`
**功能**: 停止所有开发环境服务  
**用法**:
```bash
./scripts/dev/stop-dev.sh
```
**说明**: 清理所有相关进程（tsx、vite等）

### `quick-start.sh`
**功能**: 快速启动服务（轻量版）  
**用法**:
```bash
./scripts/dev/quick-start.sh
```
**说明**: 简化版启动脚本，适合快速测试

### `check-dev-status.sh`
**功能**: 检查开发环境运行状态  
**用法**:
```bash
./scripts/dev/check-dev-status.sh
```
**说明**: 
- 检查后端和前端服务状态
- 验证数据库连接
- 检查环境变量配置
- 测试生产环境连接

### `start-subscription-backend.sh`
**功能**: 单独启动订阅系统后端（测试模式）  
**用法**:
```bash
./scripts/dev/start-subscription-backend.sh
```
**说明**: 使用测试环境变量，端口 5001

---

## 🧪 测试脚本 (`test/`)

### `test-login.sh`
**功能**: 测试登录API功能  
**用法**:
```bash
./scripts/test/test-login.sh
```
**说明**: 
- 测试本地和生产环境的登录API
- 验证多个测试账号
- 依赖 `jq` 工具

### `test-subscription-complete.sh`
**功能**: 测试订阅系统部署  
**用法**:
```bash
./scripts/test/test-subscription-complete.sh
```
**说明**: 验证订阅API、缓存配置等

### `verify-frontend.sh`
**功能**: 验证前端更新状态  
**用法**:
```bash
./scripts/test/verify-frontend.sh
```
**说明**: 
- 检查源文件修改
- 验证前端服务运行状态
- 检查构建结果

### `快速测试.sh`
**功能**: 快速测试脚本（中文版）  
**用法**:
```bash
./scripts/test/快速测试.sh
```

---

## 🚀 部署脚本 (`deploy/`)

### `deploy-to-production.sh` ⭐️ 主部署脚本
**功能**: 完整的生产环境部署流程  
**用法**:
```bash
cd /var/www/promptvalar  # 在生产服务器上
./scripts/deploy/deploy-to-production.sh
```
**说明**: 
- 自动创建备份
- 拉取最新代码
- 更新依赖和构建
- 数据库迁移
- 重启服务
- 部署验证

### `update.sh`
**功能**: 快速更新脚本  
**用法**:
```bash
./scripts/deploy/update.sh
```
**说明**: 简化的更新流程

### `fix-production-deploy.sh`
**功能**: 修复生产部署问题  
**用法**:
```bash
./scripts/deploy/fix-production-deploy.sh
```

### `backup.sh`
**功能**: 数据库和文件备份  
**用法**:
```bash
./scripts/deploy/backup.sh
```
**说明**: 
- 备份PostgreSQL数据库
- 备份上传文件
- 备份配置文件
- 自动清理过期备份（7天）
- 建议添加到crontab定时任务

**定时备份配置**:
```bash
# 每天凌晨2点自动备份
0 2 * * * /var/www/promptvalar/scripts/deploy/backup.sh
```

### `monitor.sh`
**功能**: 系统监控脚本  
**用法**:
```bash
./scripts/deploy/monitor.sh
```
**说明**: 
- 检查内存、磁盘、CPU使用率
- PM2进程状态
- 数据库连接数
- Redis内存使用
- Nginx状态
- 应用日志

### `vps-1g-setup.sh`
**功能**: 1GB VPS服务器初始化配置  
**用法**:
```bash
./scripts/deploy/vps-1g-setup.sh
```
**说明**: 首次部署时使用，配置基础环境

### `PRODUCTION_DEPLOY_COMMANDS.sh`
**功能**: 生产部署命令集合  
**说明**: 包含完整的部署步骤说明

---

## ⚙️ 配置脚本 (`config/`)

### `set-admin.sh`
**功能**: 设置用户为管理员  
**用法**:
```bash
./scripts/config/set-admin.sh user@example.com
```
**说明**: 
- 将指定用户设置为管理员角色
- 直接操作数据库
- 验证操作结果

### `setup-ssl-certificates.sh` ⭐️
**功能**: 配置SSL证书（Let's Encrypt）  
**用法**:
```bash
sudo ./scripts/config/setup-ssl-certificates.sh
```
**说明**: 
- 检查DNS配置
- 自动获取SSL证书
- 配置HTTPS重定向
- 需要root权限

### `update-nginx-config.sh`
**功能**: 更新Nginx配置  
**用法**:
```bash
sudo ./scripts/config/update-nginx-config.sh
```

### `fix-frontend-api-url.sh`
**功能**: 修复前端API URL配置  
**用法**:
```bash
./scripts/config/fix-frontend-api-url.sh
```
**说明**: 
- 重新配置前端API地址
- 重新构建前端
- 清除缓存

---

## 📂 后端专用脚本 (`../backend/`)

### `setup-database.sh`
**功能**: 数据库初始化向导  
**位置**: `/root/promptvalar/backend/setup-database.sh`  
**用法**:
```bash
cd backend
./setup-database.sh
```
**说明**: 
- 交互式配置DATABASE_URL
- 测试数据库连接
- 执行数据库迁移

### `start-backend.sh`
**功能**: 单独启动后端服务  
**位置**: `/root/promptvalar/backend/start-backend.sh`  
**用法**:
```bash
cd backend
./start-backend.sh
```

---

## 🔄 常见使用场景

### 本地开发
```bash
# 启动开发环境
./scripts/dev/start-dev.sh

# 检查服务状态
./scripts/dev/check-dev-status.sh

# 停止开发环境
./scripts/dev/stop-dev.sh
```

### 测试功能
```bash
# 测试登录功能
./scripts/test/test-login.sh

# 验证前端更新
./scripts/test/verify-frontend.sh
```

### 生产部署
```bash
# 完整部署流程（推荐）
cd /var/www/promptvalar
./scripts/deploy/deploy-to-production.sh

# 或分步执行
git pull origin main
./scripts/deploy/backup.sh        # 先备份
./scripts/deploy/update.sh         # 更新服务
```

### 系统维护
```bash
# 监控系统状态
./scripts/deploy/monitor.sh

# 设置管理员
./scripts/config/set-admin.sh admin@example.com

# 手动备份
./scripts/deploy/backup.sh
```

---

## ⚠️ 注意事项

1. **权限问题**: 某些脚本需要sudo权限（SSL配置、Nginx操作等）
2. **环境变量**: 确保.env文件配置正确
3. **数据库**: 部署前确认数据库连接正常
4. **DNS配置**: 配置SSL前确保DNS已生效
5. **备份**: 生产环境操作前务必备份

---

## 📝 依赖工具

运行这些脚本需要以下工具：
- `bash` - Shell环境
- `curl` - API测试
- `jq` - JSON解析（测试脚本）
- `lsof` - 端口检查
- `psql` - 数据库操作
- `pm2` - 进程管理（生产环境）
- `nginx` - Web服务器（生产环境）
- `certbot` - SSL证书（生产环境）

---

## 🆘 故障排查

### 服务启动失败
```bash
# 检查端口占用
lsof -i :5000
lsof -i :3000

# 查看日志
tail -f backend/backend.log
tail -f frontend/frontend.log
```

### 数据库连接问题
```bash
# 测试连接
psql -U promptvalar -d promptvalar -c "SELECT 1"

# 检查数据库状态
sudo systemctl status postgresql
```

### 前端构建问题
```bash
# 清除缓存重新构建
cd frontend
rm -rf node_modules/.vite dist
npm run build
```

---

## 📚 相关文档

- [项目文档](../docs/)
- [快速开始](../QUICK_START.md)
- [部署指南](../deployment/README.md)

---

**更新时间**: 2025-10-29  
**维护者**: PromptValar Team

