# 脚本快速索引

## ⚡ 最常用脚本

```bash
# 🔧 开发
./scripts/dev/start-dev.sh              # 启动开发环境
./scripts/dev/stop-dev.sh               # 停止开发环境
./scripts/dev/check-dev-status.sh       # 检查服务状态

# 🧪 测试
./scripts/test/test-login.sh            # 测试登录功能
./scripts/test/verify-frontend.sh       # 验证前端更新

# 🚀 部署
./scripts/deploy/deploy-to-production.sh    # 完整部署流程
./scripts/deploy/backup.sh              # 数据备份
./scripts/deploy/monitor.sh             # 系统监控

# ⚙️ 配置
sudo ./scripts/config/setup-ssl-certificates.sh    # 配置SSL
./scripts/config/set-admin.sh <email>   # 设置管理员
```

## 📋 按场景分类

### 场景1: 本地开发启动
```bash
./scripts/dev/start-dev.sh
# 访问 http://localhost:3000
```

### 场景2: 生产环境部署
```bash
cd /var/www/promptvalar
./scripts/deploy/backup.sh                      # 先备份
./scripts/deploy/deploy-to-production.sh        # 执行部署
./scripts/deploy/monitor.sh                     # 检查状态
```

### 场景3: 首次服务器配置
```bash
./scripts/deploy/vps-1g-setup.sh                # VPS初始化
sudo ./scripts/config/setup-ssl-certificates.sh # 配置SSL
./scripts/config/set-admin.sh admin@example.com # 设置管理员
```

### 场景4: 故障排查
```bash
./scripts/dev/check-dev-status.sh       # 检查服务状态
./scripts/deploy/monitor.sh             # 系统资源监控
./scripts/test/test-login.sh            # 测试API功能
```

---

**完整文档**: [README.md](./README.md)

