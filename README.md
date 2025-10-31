# PromptValar - AI Prompt Engineering Platform

<div align="center">

![PromptValar Logo](https://via.placeholder.com/200x200?text=PromptValar)

**Professional AI Prompt Engineering Made Easy**

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)

[Demo](https://promptvalar.com) · [Documentation](docs/) · [Report Bug](issues) · [Request Feature](issues)

</div>

---

## 📖 概述

**PromptValar** 是一个面向全球用户的英文AI提示词工程平台，帮助内容创作者、设计师和AI爱好者轻松创建高质量的AI提示词。

### ✨ 核心特性

- 🤖 **智能提示词生成** - 基于 Claude 3.5 Sonnet 的AI驱动提示词优化
- ✍️ **结构化编辑器** - 精细调整提示词的每个组件
- 📚 **提示词库** - 浏览和收藏社区优质提示词
- 🎨 **多模型支持** - 支持 Sora、Veo、Midjourney 等主流AI模型
- 💾 **草稿自动保存** - 永不丢失创作进度
- 🔐 **安全认证** - JWT token认证系统
- 📱 **响应式设计** - 完美支持桌面和移动设备

---

## 🚀 快速开始

### 前置要求

- **Node.js** 18+ 
- **PostgreSQL** 15+
- **npm** 或 **pnpm**
- **Redis**（可选，用于速率限制）

### 一键启动

```bash
# 1. 克隆仓库
git clone https://github.com/yourusername/promptvalar.git
cd promptvalar

# 2. 安装依赖
npm install

# 3. 配置环境变量
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
# 编辑 .env 文件，填入必要的配置

# 4. 初始化数据库
cd backend
npm run db:migrate

# 5. 启动开发服务器
cd ..
npm run dev
```

访问 `http://localhost:3000` 开始使用！

📖 **详细设置指南:** [QUICK_START.md](QUICK_START.md)

---

## 📦 项目结构

```
promptvalar/
├── frontend/              # React + Vite 前端应用
│   ├── src/
│   │   ├── components/   # React组件
│   │   ├── pages/        # 页面组件
│   │   ├── services/     # API服务
│   │   └── types/        # TypeScript类型
│   └── package.json
├── backend/              # Node.js + Express 后端API
│   ├── src/
│   │   ├── controllers/  # 控制器
│   │   ├── services/     # 业务逻辑
│   │   ├── routes/       # 路由
│   │   ├── middleware/   # 中间件
│   │   └── db/          # 数据库配置
│   └── package.json
├── deployment/           # 部署脚本和配置
├── docs/                # 文档
└── README.md
```

---

## 💻 技术栈

### 前端
- **React 18** + TypeScript
- **Vite** - 极速构建工具
- **Tailwind CSS** - 实用优先的CSS框架
- **Framer Motion** - 流畅动画
- **Zustand** - 轻量级状态管理
- **React Router** - 路由管理

### 后端
- **Node.js 18** + Express
- **TypeScript** - 类型安全
- **PostgreSQL** - 主数据库
- **Redis** - 缓存和速率限制
- **Drizzle ORM** - 类型安全的ORM
- **JWT** - 认证系统
- **OpenRouter** - AI模型集成

### DevOps
- **Docker** - 容器化
- **GitHub Actions** - CI/CD
- **ESLint + Prettier** - 代码质量

---

## 📚 核心功能

### 1. Prompt Studio（提示词工作室）

三步式提示词创作流程：

1. **输入想法** - 用自然语言描述你的创意
2. **AI优化** - 获得专业优化的提示词
3. **精细调整** - 通过结构化编辑器完善细节

### 2. Prompt Library（提示词库）

- 浏览社区优质提示词
- 按模型和风格筛选
- 一键复制和收藏
- 搜索和标签系统

### 3. 用户 Dashboard

- 管理我的提示词
- 查看收藏列表
- 编辑和删除功能
- 使用统计

---

## 🔧 开发指南

### 可用命令

```bash
# 开发环境
npm run dev              # 同时启动前后端
npm run dev:frontend     # 仅启动前端
npm run dev:backend      # 仅启动后端

# 构建
npm run build            # 构建前后端
npm run build:frontend   # 构建前端
npm run build:backend    # 构建后端

# 测试
npm test                 # 运行所有测试
npm run test:frontend    # 前端测试
npm run test:backend     # 后端测试

# 代码质量
npm run lint             # 运行linter
npm run format           # 格式化代码

# 数据库
npm run db:generate      # 生成迁移
npm run db:migrate       # 运行迁移
npm run db:studio        # 打开数据库管理界面
```

### 环境变量配置

#### 后端 (`backend/.env`)

```bash
# 服务器
NODE_ENV=development
PORT=5000

# 数据库
DATABASE_URL=postgresql://user:password@localhost:5432/promptvalar
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret

# OpenRouter API
OPENROUTER_API_KEY=sk-or-v1-your-key-here

# CORS
CORS_ORIGIN=http://localhost:3000
```

#### 前端 (`frontend/.env`)

```bash
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_APP_NAME=PromptValar
```

---

## 🧪 测试

```bash
# 运行所有测试
npm test

# 运行特定测试
npm test -- --grep "auth"

# 测试覆盖率
npm run test:coverage
```

📖 **完整测试指南:** [TESTING_GUIDE.md](TESTING_GUIDE.md)

---

## 🚢 部署

### 使用 Docker

```bash
# 构建镜像
docker-compose build

# 启动服务
docker-compose up -d

# 查看日志
docker-compose logs -f
```

### 手动部署

参考详细部署指南：
- [部署指南](docs/DEPLOYMENT.md) - 完整部署指南
- [故障排查](docs/TROUBLESHOOTING.md) - 常见问题解决方案

---

## 📖 文档

- [快速开始](QUICK_START.md) - 本地开发环境搭建
- [项目总结](PROJECT_SUMMARY.md) - 项目功能和技术栈概览
- [项目规范](PROJECT_RULES.md) - 开发规范和最佳实践
- [测试指南](TESTING_GUIDE.md) - 测试流程和规范
- [OpenRouter配置](OPENROUTER_SETUP.md) - AI API配置指南
- [文档中心](docs/README.md) - 完整的项目文档导航

---

## 🤝 贡献指南

我们欢迎所有形式的贡献！请查看 [贡献指南](CONTRIBUTING.md) 了解详情。

### 开发流程

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

---

## 📝 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

---

## 📞 联系方式

- **项目主页:** [https://promptvalar.com](https://promptvalar.com)
- **问题反馈:** [GitHub Issues](https://github.com/yourusername/promptvalar/issues)
- **邮箱:** contact@promptvalar.com

---

## 🌟 Star History

如果觉得这个项目对你有帮助，请给我们一个 ⭐️！

---

## 📊 项目状态

- ✅ **Phase 1: Foundation** - 基础架构 (100%)
- ✅ **Phase 2: Core Features** - 核心功能 (100%)
- ✅ **Phase 3: User System** - 用户系统 (100%)
- ✅ **Phase 4: Subscription** - 订阅系统 (100%)
- ✅ **Phase 5: Admin Panel & Optimization** - 管理后台和优化 (100%)

详细进展请查看 [项目总结](PROJECT_SUMMARY.md)

---

## 🎯 路线图

### 近期计划 (Q1 2025)
- [x] Prompt Studio 核心功能
- [x] 用户认证系统
- [x] 提示词保存和管理
- [ ] 提示词详情页
- [ ] 搜索和筛选优化
- [ ] 收藏功能完善

### 中期计划 (Q2 2025)
- [ ] 用户个人主页
- [ ] 社区功能
- [ ] 提示词评论和评分
- [ ] Stripe 支付集成
- [ ] Pro 订阅系统

### 长期计划 (Q3+ 2025)
- [ ] AI 模型更新和扩展
- [ ] 多语言支持
- [ ] 移动端 App
- [ ] API 开放平台
- [ ] 企业版功能

---

<div align="center">

**Made with ❤️ by the PromptValar Team**

[Website](https://promptvalar.com) · [Documentation](docs/) · [Community](https://discord.gg/promptvalar)

</div>
