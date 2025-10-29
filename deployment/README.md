# Deployment - 部署目录

> ⚠️ **重要通知**: 本目录的脚本已迁移至 `/root/promptvalar/scripts/` 目录

## 📂 新的脚本位置

所有脚本已按功能重新整理到以下目录：

```
/root/promptvalar/scripts/
├── dev/          # 开发环境管理脚本
├── test/         # 测试脚本
├── deploy/       # 生产部署脚本（包含原deployment目录的脚本）
├── config/       # 配置管理脚本
└── README.md     # 完整的脚本使用指南
```

## 🔗 快速访问

请查看新的脚本文档：
```bash
cat /root/promptvalar/scripts/README.md
```

或访问相关脚本：
- 生产部署: `scripts/deploy/`
- 系统监控: `scripts/deploy/monitor.sh`
- 数据备份: `scripts/deploy/backup.sh`
- 更多...

## 📝 迁移说明

| 旧位置 | 新位置 |
|--------|--------|
| `deployment/backup.sh` | `scripts/deploy/backup.sh` |
| `deployment/monitor.sh` | `scripts/deploy/monitor.sh` |
| `deployment/update.sh` | `scripts/deploy/update.sh` |
| `deployment/ssl-setup.sh` | `scripts/config/setup-ssl-certificates.sh` |
| `deployment/vps-1g-setup.sh` | `scripts/deploy/vps-1g-setup.sh` |
| `deployment/fix-api-url.sh` | `scripts/config/fix-frontend-api-url.sh` |

## 📚 其他文档

- **PM2配置**: `ecosystem.config.js` (保留在此目录)
- **迁移指南**: `migration-guide.md`
- **新脚本文档**: `../scripts/README.md`

---

本目录将保留一段时间以便平滑过渡，未来可能会被移除。
