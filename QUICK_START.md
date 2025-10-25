# 🚀 PromptValar 快速启动指南

## 📋 前置要求

确保已安装以下软件：
- **Node.js** 18 或更高版本
- **PostgreSQL** 15 或更高版本
- **npm** 或 **yarn**
- **Git**

可选：
- **Redis**（用于速率限制和缓存）
- **Docker**（用于容器化部署）

---

## ⚙️ 第一步：克隆和安装

### 1. 克隆项目（如果还没有）
```bash
git clone <your-repo-url>
cd promptvalar
```

### 2. 安装依赖

#### 后端
```bash
cd backend
npm install
```

#### 前端
```bash
cd ../frontend
npm install
```

---

## 🗄️ 第二步：数据库设置

### 1. 创建 PostgreSQL 数据库
```bash
# 使用 psql 或图形化工具创建数据库
createdb promptvalar

# 或使用 psql
psql -U postgres
CREATE DATABASE promptvalar;
\q
```

### 2. 配置后端环境变量
```bash
cd backend
cp .env.example .env
```

编辑 `.env` 文件：
```env
# 数据库连接
DATABASE_URL=postgresql://username:password@localhost:5432/promptvalar

# JWT 密钥（生成随机字符串）
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this

# OpenRouter API（必需）
OPENROUTER_API_KEY=sk-or-v1-your-api-key-here

# CORS
CORS_ORIGIN=http://localhost:3000

# 可选：Redis
REDIS_URL=redis://localhost:6379
```

### 3. 运行数据库迁移
```bash
npm run db:migrate
```

---

## 🎨 第三步：前端配置

### 配置前端环境变量
```bash
cd ../frontend
cp .env.example .env
```

编辑 `.env` 文件：
```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

---

## 🔑 第四步：获取 OpenRouter API Key

1. 访问 [OpenRouter](https://openrouter.ai/)
2. 注册账号
3. 在账户设置中生成 API Key
4. 将 API Key 添加到后端 `.env` 文件

**推荐充值**: $5-10 足够测试使用

---

## 🚀 第五步：启动应用

### 1. 启动后端（终端 1）
```bash
cd backend
npm run dev
```

看到以下输出表示成功：
```
🚀 Server running on http://localhost:5000
📝 Environment: development
```

### 2. 启动前端（终端 2）
```bash
cd frontend
npm run dev
```

看到以下输出表示成功：
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
```

---

## 🎯 第六步：访问应用

打开浏览器访问以下页面：

1. **首页**: http://localhost:3000/
2. **Prompt Studio**: http://localhost:3000/studio
   - 在这里测试 AI 提示词生成功能！
3. **Prompt Library**: http://localhost:3000/library
   - 浏览提示词库
4. **登录**: http://localhost:3000/login
5. **注册**: http://localhost:3000/register

---

## 🧪 测试功能

### 测试 Prompt Studio

1. 访问 http://localhost:3000/studio
2. 在文本框中输入想法，例如：
   ```
   A majestic dragon flying over a medieval castle at sunset, 
   with golden light reflecting on its scales
   ```
3. 选择模型（如 Sora）和风格（如 Cinematic）
4. 点击 "Generate Prompt" 按钮
5. 查看 AI 生成的专业提示词
6. 在结构化编辑器中调整细节
7. 复制最终提示词

### 测试 Prompt Library

1. 访问 http://localhost:3000/library
2. 使用搜索框搜索提示词
3. 使用过滤器按模型或风格过滤
4. 点击复制按钮复制提示词

---

## 🐛 常见问题

### 问题 1: 数据库连接失败
**错误**: `Error: connect ECONNREFUSED`

**解决方案**:
1. 确认 PostgreSQL 正在运行
2. 检查 `DATABASE_URL` 格式是否正确
3. 确认数据库已创建

```bash
# 检查 PostgreSQL 状态
sudo systemctl status postgresql

# 或
pg_isready
```

### 问题 2: OpenRouter API 错误
**错误**: `Failed to generate prompt`

**解决方案**:
1. 确认 API Key 正确配置
2. 检查 OpenRouter 账户余额
3. 查看后端日志获取详细错误

### 问题 3: 端口已被占用
**错误**: `Port 5000 is already in use`

**解决方案**:
```bash
# 查找占用端口的进程
lsof -i :5000

# 终止进程
kill -9 <PID>

# 或修改端口
# 在 backend/.env 中设置
PORT=5001
```

### 问题 4: 前端无法连接后端
**错误**: `Network Error` 或 CORS 错误

**解决方案**:
1. 确认后端正在运行
2. 检查前端 `.env` 中的 `VITE_API_BASE_URL`
3. 检查后端 CORS 配置

---

## 📦 使用 Docker（可选）

### 使用 Docker Compose 启动整个应用

```bash
# 在项目根目录
docker-compose up -d
```

这将启动：
- PostgreSQL 数据库
- Redis
- 后端 API
- 前端应用

访问 http://localhost:3000

---

## 🔧 开发工具

### 推荐的 VSCode 扩展
- ESLint
- Prettier
- TypeScript Vue Plugin (Volar)
- Tailwind CSS IntelliSense
- GitLens

### 有用的命令

#### 后端
```bash
# 开发模式（热重载）
npm run dev

# 构建
npm run build

# 启动生产版本
npm start

# 代码检查
npm run lint

# 数据库相关
npm run db:generate  # 生成迁移
npm run db:migrate   # 运行迁移
npm run db:studio    # 打开数据库管理界面
```

#### 前端
```bash
# 开发模式
npm run dev

# 构建
npm run build

# 预览生产构建
npm run preview

# 代码检查
npm run lint
```

---

## 📚 下一步

现在你已经成功运行了 PromptValar！接下来可以：

1. **探索代码**
   - 查看 `frontend/src/pages/PromptStudioPage.tsx`
   - 查看 `backend/src/services/openrouter.service.ts`

2. **自定义配置**
   - 修改 AI 模型
   - 调整样式和主题
   - 添加新的提示词类别

3. **继续开发**
   - 实现提示词详情页
   - 添加用户仪表板
   - 集成支付系统

4. **阅读文档**
   - `PROGRESS_REPORT.md` - 项目进展
   - `PHASE_COMPLETION_SUMMARY.md` - 完成总结
   - `technical-implementation-plan.md` - 技术计划

---

## 🆘 需要帮助？

- 查看项目 Issues
- 阅读技术文档
- 检查控制台日志
- 使用浏览器开发者工具

---

## 🎉 享受开发！

现在你已准备好开始使用 PromptValar 了！

**记住**:
- 保持代码整洁
- 编写测试
- 及时提交
- 享受 AI 的魔力！✨
