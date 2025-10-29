# Docker 部署指南

## 📦 关于依赖管理

### ✅ **不需要手动添加模块到 Dockerfile**

**重要说明**：
- Dockerfile 使用 `npm ci` 命令自动安装依赖
- 所有模块（包括 Express、Stripe 等）都在 `package.json` 中定义
- Docker 构建时会自动安装 `package.json` 中的所有依赖
- **只需要确保模块已添加到 `package.json`**

### 📋 Dockerfile 工作原理

```dockerfile
# 构建阶段
COPY package*.json ./
RUN npm ci  # ← 自动安装所有依赖（包括 express、stripe 等）

# 生产阶段
COPY package*.json ./
RUN npm ci --omit=dev  # ← 只安装生产依赖
```

### ⚠️ **但需要配置环境变量**

虽然不需要手动添加模块，但新增功能需要的**环境变量**必须配置！

## 🔧 环境变量配置

### 开发环境 (`docker-compose.yml`)

```yaml
backend:
  environment:
    NODE_ENV: development
    PORT: 5000
    DATABASE_URL: postgresql://...
    REDIS_URL: redis://...
    JWT_SECRET: dev-jwt-secret
    JWT_REFRESH_SECRET: dev-refresh-secret
    CORS_ORIGIN: http://localhost:3000
    # OpenRouter API
    OPENROUTER_API_KEY: ${OPENROUTER_API_KEY:-sk-test-key}
    OPENROUTER_APP_NAME: PromptValar
    # Stripe 配置 (测试模式)
    STRIPE_TEST_MODE: true
    STRIPE_SECRET_KEY: sk_test_placeholder
    STRIPE_WEBHOOK_SECRET: whsec_test_placeholder
    STRIPE_PRO_PRICE_ID: price_test_pro
```

### 生产环境 (`docker-compose.prod.yml`)

使用 `.env` 文件管理敏感信息：

```yaml
backend:
  environment:
    NODE_ENV: production
    DATABASE_URL: postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}
    JWT_SECRET: ${JWT_SECRET}
    STRIPE_SECRET_KEY: ${STRIPE_SECRET_KEY}
    # ... 其他环境变量从 .env 读取
```

## 🚀 使用方法

### 开发环境

```bash
# 启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs -f backend

# 停止服务
docker-compose down

# 重新构建并启动
docker-compose up -d --build
```

### 生产环境

```bash
# 1. 创建 .env 文件
cp .env.example .env
nano .env  # 编辑环境变量

# 2. 启动生产环境
docker-compose -f docker-compose.prod.yml up -d

# 3. 查看状态
docker-compose -f docker-compose.prod.yml ps

# 4. 查看日志
docker-compose -f docker-compose.prod.yml logs -f backend
```

## 📝 .env 文件示例

创建 `/root/promptvalar/.env.production`:

```bash
# 数据库配置
POSTGRES_DB=promptvalar
POSTGRES_USER=promptvalar
POSTGRES_PASSWORD=your-secure-password

# JWT 密钥
JWT_SECRET=your-production-jwt-secret
JWT_REFRESH_SECRET=your-production-refresh-secret

# CORS
CORS_ORIGIN=https://promptvalar.com

# OpenRouter API
OPENROUTER_API_KEY=sk-or-v1-xxxxx

# Stripe 配置
STRIPE_TEST_MODE=false
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
STRIPE_PRO_PRICE_ID=price_xxxxx
```

## 🔄 添加新模块的流程

### 步骤 1: 安装模块（自动更新 package.json）

```bash
cd backend
npm install new-module-name
```

### 步骤 2: 如果模块需要环境变量，更新 Docker Compose

```yaml
backend:
  environment:
    # 添加新模块的环境变量
    NEW_MODULE_API_KEY: ${NEW_MODULE_API_KEY}
```

### 步骤 3: 重新构建 Docker 镜像

```bash
# 开发环境
docker-compose up -d --build backend

# 生产环境
docker-compose -f docker-compose.prod.yml up -d --build backend
```

## 📦 当前已安装的主要依赖

### 运行时依赖 (dependencies)
- ✅ **express** - Web 框架
- ✅ **stripe** - 支付处理
- ✅ **bcrypt** - 密码加密
- ✅ **jsonwebtoken** - JWT 认证
- ✅ **drizzle-orm** - ORM
- ✅ **ioredis** - Redis 客户端
- ✅ **cors** - CORS 中间件
- ✅ **helmet** - 安全头
- ✅ **zod** - 数据验证
- ✅ **openai** - OpenAI API

### 开发依赖 (devDependencies)
- TypeScript
- ESLint
- tsx
- drizzle-kit
- 类型定义文件

## 🔍 验证依赖安装

```bash
# 查看容器内安装的模块
docker exec promptvalar-backend npm list --depth=0

# 验证特定模块
docker exec promptvalar-backend npm list express
docker exec promptvalar-backend npm list stripe
```

## ⚡ 性能优化建议

### 1. 使用 .dockerignore

创建 `backend/.dockerignore`:
```
node_modules
dist
*.log
.env
.git
```

### 2. 多阶段构建（已实现）

Dockerfile 使用多阶段构建：
- 构建阶段：包含所有依赖
- 生产阶段：只包含运行时依赖

### 3. 缓存优化

```dockerfile
# 先复制 package.json，利用 Docker 缓存
COPY package*.json ./
RUN npm ci

# 后复制源代码
COPY . .
```

## 🐛 常见问题

### Q1: 添加新模块后容器报错 "Cannot find module"

**解决**：重新构建镜像
```bash
docker-compose up -d --build backend
```

### Q2: 环境变量没有生效

**解决**：
1. 检查 `.env` 文件是否存在
2. 重启容器：`docker-compose restart backend`
3. 查看环境变量：`docker exec promptvalar-backend env`

### Q3: 生产环境使用测试密钥

**解决**：
1. 更新 `.env` 文件中的真实密钥
2. 重新启动：`docker-compose -f docker-compose.prod.yml up -d`

## 📊 监控和日志

```bash
# 实时查看日志
docker-compose logs -f backend

# 查看最近 100 行日志
docker-compose logs --tail=100 backend

# 检查容器状态
docker-compose ps

# 查看资源使用
docker stats promptvalar-backend
```

## 🔐 安全建议

1. ✅ 使用 `.env` 文件管理敏感信息
2. ✅ 不要将 `.env` 提交到 Git
3. ✅ 生产环境使用强密码
4. ✅ 定期更新 Docker 镜像
5. ✅ 使用非 root 用户运行容器（考虑添加）

## 📚 相关文件

- `backend/Dockerfile` - 后端 Docker 镜像定义
- `docker-compose.yml` - 开发环境配置
- `docker-compose.prod.yml` - 生产环境配置
- `backend/package.json` - 依赖定义
- `.dockerignore` - 忽略文件列表

## 🎯 总结

### ✅ 自动处理（无需手动配置）
- 依赖安装（npm ci）
- 模块解析
- TypeScript 编译

### ⚠️ 需要手动配置
- 环境变量
- 密钥和 API Key
- 域名和 CORS 设置
- 数据库连接

---

**记住**：添加新功能时，只需要：
1. 用 npm install 安装模块
2. 在 docker-compose.yml 中添加环境变量（如需要）
3. 重新构建镜像：`docker-compose up -d --build`

