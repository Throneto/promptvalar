# PromptValar - Setup Guide
## Phase 1 Foundation Setup Complete ✅

---

## 📦 项目结构

```
promptvalar/
├── frontend/                # React + Vite 前端应用
│   ├── src/
│   │   ├── components/     # React组件
│   │   ├── pages/          # 页面组件
│   │   ├── App.tsx         # 主应用组件
│   │   └── main.tsx        # 应用入口
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── tailwind.config.js
├── backend/                # Node.js + Express 后端API
│   ├── src/
│   │   ├── controllers/    # 控制器层
│   │   ├── services/       # 业务逻辑层
│   │   ├── routes/         # 路由定义
│   │   ├── middleware/     # 中间件
│   │   ├── validators/     # 数据验证
│   │   ├── db/            # 数据库配置和Schema
│   │   └── index.ts       # 应用入口
│   ├── package.json
│   └── tsconfig.json
├── .github/
│   └── workflows/
│       └── ci.yml         # GitHub Actions CI/CD
├── package.json           # 根目录配置(monorepo)
├── docker-compose.yml     # Docker开发环境
└── .prettierrc           # 代码格式化配置
```

---

## 🚀 快速开始

### 前置要求

- Node.js 18+ 
- npm 9+ 或 pnpm
- PostgreSQL 15+ (或使用Docker)
- Redis (或使用Docker)

### 方式1: 使用Docker Compose (推荐)

```bash
# 1. 启动所有服务(PostgreSQL, Redis, Backend, Frontend)
docker-compose up -d

# 2. 查看日志
docker-compose logs -f

# 3. 访问应用
# 前端: http://localhost:3000
# 后端: http://localhost:5000
# 健康检查: http://localhost:5000/health
```

### 方式2: 本地开发

```bash
# 1. 安装根目录依赖
npm install

# 2. 安装前端依赖
cd frontend
npm install

# 3. 安装后端依赖
cd ../backend
npm install

# 4. 配置环境变量
# 复制并编辑.env文件
cp .env.example .env
# 编辑.env文件,填入必要的配置(数据库URL, JWT secrets等)

# 5. 生成数据库迁移
npm run db:generate

# 6. 执行数据库迁移
npm run db:migrate

# 7. 回到根目录,启动开发服务器
cd ..
npm run dev
# 这会同时启动前端(http://localhost:3000)和后端(http://localhost:5000)
```

---

## 📋 Phase 1 完成项

✅ **项目基础结构搭建**
- Monorepo结构(根目录 + frontend + backend)
- TypeScript配置完成
- ESLint + Prettier配置完成

✅ **前端基础设施**
- React 18 + TypeScript
- Vite构建工具
- React Router路由
- Tailwind CSS样式框架
- 基础页面组件(Home, Login, Register)
- Layout组件(Header, Footer)

✅ **后端基础设施**
- Express + TypeScript
- Drizzle ORM数据库管理
- PostgreSQL数据库Schema定义
- JWT认证系统实现
- 错误处理中间件
- API路由结构

✅ **数据库Schema**
- users表(用户信息)
- prompts表(提示词数据)
- structured_prompts表(结构化提示词)
- favorites表(收藏功能)
- subscriptions表(订阅管理)
- ai_usage_logs表(AI使用日志)

✅ **认证系统**
- 用户注册API (`POST /api/v1/auth/register`)
- 用户登录API (`POST /api/v1/auth/login`)
- Token刷新API (`POST /api/v1/auth/refresh`)
- JWT中间件认证

✅ **CI/CD配置**
- GitHub Actions workflow
- 前端构建和测试
- 后端构建和测试
- 代码质量检查

---

## 🔧 可用命令

### 根目录命令

```bash
# 同时启动前端和后端开发服务器
npm run dev

# 构建前端和后端
npm run build

# 运行所有测试
npm test

# 运行所有linter
npm run lint

# 格式化所有代码
npm run format
```

### 前端命令

```bash
cd frontend

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview

# 运行linter
npm run lint
```

### 后端命令

```bash
cd backend

# 启动开发服务器(自动重载)
npm run dev

# 构建TypeScript
npm run build

# 启动生产服务器
npm start

# 运行linter
npm run lint

# 生成数据库迁移
npm run db:generate

# 执行数据库迁移
npm run db:migrate

# 打开Drizzle Studio(数据库管理界面)
npm run db:studio
```

---

## 🔑 环境变量配置

### 后端 (`backend/.env`)

```bash
NODE_ENV=development
PORT=5000

# 数据库配置
DATABASE_URL=postgresql://promptvalar:password@localhost:5432/promptvalar
REDIS_URL=redis://localhost:6379

# JWT密钥(生产环境必须使用强随机字符串!)
JWT_SECRET=your-strong-secret-key-here
JWT_REFRESH_SECRET=your-strong-refresh-secret-key

# OpenRouter API(用于AI提示词生成)
OPENROUTER_API_KEY=sk-or-v1-your-key-here
OPENROUTER_APP_NAME=PromptValar

# CORS配置
CORS_ORIGIN=http://localhost:3000
```

### 前端 (`frontend/.env`)

```bash
VITE_API_BASE_URL=http://localhost:5000
VITE_STRIPE_PUBLIC_KEY=pk_test_your-key-here
VITE_APP_NAME=PromptValar
VITE_APP_URL=http://localhost:3000
```

---

## 🧪 测试API

### 健康检查

```bash
curl http://localhost:5000/health
```

### 用户注册

```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "Test1234"
  }'
```

### 用户登录

```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234"
  }'
```

---

## 📚 下一步 (Phase 2)

Phase 1已完成基础架构搭建,接下来需要实现:

1. **Prompt Studio UI**
   - 三卡片布局实现
   - AI提示词生成集成
   - 结构化编辑器

2. **Prompt Library**
   - 列表页面和过滤
   - 详情页面
   - 搜索功能

3. **OpenRouter集成**
   - AI模型API调用
   - 提示词生成逻辑
   - 错误处理和重试

---

## 🐛 常见问题

### 数据库连接失败

确保PostgreSQL正在运行,并且`DATABASE_URL`配置正确:

```bash
# 使用Docker启动PostgreSQL
docker-compose up -d postgres

# 检查PostgreSQL是否运行
docker-compose ps
```

### 前端无法连接后端

检查CORS配置和API base URL:
- 后端的`CORS_ORIGIN`应该设置为前端URL
- 前端的`VITE_API_BASE_URL`应该指向后端URL

### TypeScript编译错误

确保安装了所有依赖:

```bash
# 重新安装依赖
rm -rf node_modules
npm install
```

---

## 📖 更多文档

- [PROJECT_RULES.md](./PROJECT_RULES.md) - 项目开发规范和标准
- [technical-implementation-plan.md](./Archived/technical-implementation-plan.md) - 技术实施计划

---

**Phase 1 Foundation - 完成时间**: 2025-01

如有问题,请查看文档或创建Issue。

