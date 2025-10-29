# PromptValar 文档中心

欢迎来到 PromptValar 项目文档中心！这里包含了项目的完整文档，帮助您快速上手和深入了解项目。

---

## 📚 文档目录

### 🚀 入门指南

| 文档 | 描述 | 适合人群 |
|------|------|---------|
| [快速开始](../QUICK_START.md) | 5分钟快速启动本地开发环境 | 开发者 |
| [项目总结](../PROJECT_SUMMARY.md) | 项目功能概述和技术栈 | 所有人 |
| [项目规范](../PROJECT_RULES.md) | 开发规范和最佳实践 | 开发者 |

### 🔧 核心功能文档

| 文档 | 描述 | 状态 |
|------|------|------|
| [部署指南](./DEPLOYMENT.md) | 完整的部署指南（VPS、Docker） | ✅ 完整 |
| [订阅系统](./SUBSCRIPTION.md) | Stripe订阅系统使用指南 | ✅ 完整 |
| [管理员指南](./ADMIN.md) | 管理员后台使用说明 | ✅ 完整 |
| [测试指南](../TESTING_GUIDE.md) | 测试流程和规范 | ✅ 完整 |
| [故障排查](./TROUBLESHOOTING.md) | 常见问题和解决方案 | ✅ 完整 |

### 📖 技术文档

| 文档 | 描述 | 路径 |
|------|------|------|
| 后端API文档 | 后端接口说明 | `backend/README.md` |
| 前端组件文档 | React组件说明 | `frontend/README.md` |
| 数据库迁移 | 数据库结构和迁移 | `backend/drizzle/` |
| 部署脚本 | 自动化部署工具 | `deployment/` |

### 🔐 配置文档

| 文档 | 描述 | 位置 |
|------|------|------|
| OpenRouter设置 | AI API配置 | `OPENROUTER_SETUP.md` |
| Nginx配置 | Web服务器配置 | `nginx-config/README.md` |
| 环境变量 | .env文件配置说明 | 各模块的README |

---

## 🗂️ 文档结构

```
promptvalar/
├── docs/                           # 📁 核心文档目录（新整理）
│   ├── README.md                   # 本文档
│   ├── DEPLOYMENT.md               # 部署指南（合并了9个文档）
│   ├── SUBSCRIPTION.md             # 订阅系统（合并了5个文档）
│   ├── ADMIN.md                    # 管理员指南（合并了3个文档）
│   └── TROUBLESHOOTING.md          # 故障排查（合并了修复报告）
│
├── README.md                       # 项目主README
├── QUICK_START.md                  # 快速开始指南
├── PROJECT_SUMMARY.md              # 项目总结
├── PROJECT_RULES.md                # 项目规范
├── TESTING_GUIDE.md                # 测试指南
├── OPENROUTER_SETUP.md             # OpenRouter配置
│
├── backend/
│   ├── README.md                   # 后端文档
│   └── drizzle/                    # 数据库迁移文件
│       └── ...
│
├── frontend/
│   └── README.md                   # 前端文档
│
├── deployment/
│   ├── README.md                   # 部署配置说明
│   └── migration-guide.md          # 迁移指南
│
├── nginx-config/
│   └── README.md                   # Nginx配置说明
│
└── Archived/                       # 归档文档
    ├── technical-implementation-plan.md
    ├── promptvalar-guide.md
    ├── promptinfomation.md
    └── UI-design.md
```

---

## 🎯 快速导航

### 我想...

#### 开始开发
👉 阅读 [快速开始](../QUICK_START.md) → 配置环境 → 启动服务

#### 部署到生产环境
👉 阅读 [部署指南](./DEPLOYMENT.md) → 选择部署方式 → 执行部署

#### 配置订阅功能
👉 阅读 [订阅系统](./SUBSCRIPTION.md) → 配置Stripe → 测试支付

#### 设置管理员权限
👉 阅读 [管理员指南](./ADMIN.md) → 创建管理员 → 访问后台

#### 解决问题
👉 阅读 [故障排查](./TROUBLESHOOTING.md) → 查找问题 → 应用解决方案

#### 运行测试
👉 阅读 [测试指南](../TESTING_GUIDE.md) → 配置测试 → 执行测试

---

## 📋 文档清理说明

**已完成的整理工作**（2025-10-29）:

### 合并的文档

1. **部署相关** (9个 → 1个)
   - ✅ 合并到 `docs/DEPLOYMENT.md`
   - 删除了重复的部署报告和成功通知

2. **订阅系统** (5个 → 1个)
   - ✅ 合并到 `docs/SUBSCRIPTION.md`
   - 删除了重复的指南和测试报告

3. **管理员** (3个 → 1个)
   - ✅ 合并到 `docs/ADMIN.md`
   - 删除了重复的访问指南

4. **修复报告** (7个 → 1个)
   - ✅ 合并到 `docs/TROUBLESHOOTING.md`
   - 删除了所有临时修复报告

5. **其他报告** (15个)
   - ✅ 删除了过时的进度报告
   - ✅ 删除了临时的功能报告
   - ✅ 保留了核心文档

### 保留的核心文档

- ✅ `README.md` - 项目主文档
- ✅ `QUICK_START.md` - 快速开始
- ✅ `PROJECT_SUMMARY.md` - 项目总结
- ✅ `PROJECT_RULES.md` - 项目规范
- ✅ `TESTING_GUIDE.md` - 测试指南
- ✅ `OPENROUTER_SETUP.md` - API配置

### 新创建的文档

- ✅ `docs/DEPLOYMENT.md` - 综合部署指南
- ✅ `docs/SUBSCRIPTION.md` - 订阅系统完整指南
- ✅ `docs/ADMIN.md` - 管理员使用手册
- ✅ `docs/TROUBLESHOOTING.md` - 故障排查手册
- ✅ `docs/README.md` - 文档中心导航（本文档）

---

## 🔍 文档维护

### 更新文档

当添加新功能或修复问题时，请更新相应文档：

1. **新增API端点** → 更新对应的功能文档
2. **修复问题** → 在 `TROUBLESHOOTING.md` 中添加解决方案
3. **部署变更** → 更新 `DEPLOYMENT.md`
4. **配置变更** → 更新相关配置文档

### 文档规范

- 使用Markdown格式
- 添加清晰的标题和目录
- 包含代码示例
- 提供实际操作步骤
- 注明最后更新时间

---

## 📞 需要帮助？

### 文档相关问题

- 📖 首先查看相关文档章节
- 🔍 使用文档搜索功能
- 📝 查看示例代码
- ❓ 查阅FAQ部分

### 技术支持

- GitHub Issues: 提交问题和建议
- 项目Wiki: 查看详细技术文档
- 社区讨论: 参与技术讨论

---

## 📈 文档统计

- **总文档数**: 10个核心文档
- **文档类型**: 指南(4) + 配置(2) + 规范(2) + 参考(2)
- **文档状态**: ✅ 全部完整
- **最后整理**: 2025-10-29

---

## 🎉 开始探索

现在您可以：

1. ✅ 从 [快速开始](../QUICK_START.md) 开始开发
2. ✅ 阅读 [部署指南](./DEPLOYMENT.md) 部署到生产环境
3. ✅ 查看 [订阅系统](./SUBSCRIPTION.md) 配置支付功能
4. ✅ 参考 [管理员指南](./ADMIN.md) 管理平台

**祝您使用愉快！** 🚀

---

**文档维护**: PromptValar Team  
**最后更新**: 2025-10-29  
**版本**: v1.0.0

