# PromptValar 订阅系统 - 快速开始指南

## 🚀 5 分钟快速开始

### 前置条件
- Node.js 18+
- PostgreSQL 数据库已运行
- Redis 已运行（可选）

---

## 📦 安装步骤

### 1. 安装依赖

```bash
# 后端
cd backend
npm install

# 前端
cd ../frontend
npm install
```

### 2. 配置环境变量

#### 后端 `.env`

```bash
# 复制示例文件（如果存在）
cp .env.example .env

# 或手动添加以下配置：
NODE_ENV=development
PORT=3001

# 数据库
DATABASE_URL=postgresql://user:password@localhost:5432/promptvalar

# JWT
JWT_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-refresh-secret

# 测试模式（重要！）
STRIPE_TEST_MODE=true
STRIPE_SECRET_KEY=sk_test_placeholder
STRIPE_WEBHOOK_SECRET=whsec_test_placeholder
STRIPE_PRO_PRICE_ID=price_test_pro
```

#### 前端 `.env`

```bash
VITE_API_BASE_URL=http://localhost:3001
```

### 3. 运行数据库迁移

```bash
cd backend
npm run db:generate  # 已完成
npm run db:migrate   # 应用迁移
```

### 4. 启动服务

```bash
# 终端 1 - 后端
cd backend
npm run dev

# 终端 2 - 前端
cd frontend
npm run dev
```

---

## 🧪 测试订阅系统

### 方法 1: 通过前端界面

1. 打开浏览器访问 `http://localhost:5173`
2. 注册/登录账号
3. 访问定价页面 `/pricing`
4. 点击"升级到 Pro"
5. 系统自动激活（测试模式）
6. 访问 `/dashboard/subscription` 查看订阅

### 方法 2: 运行测试脚本

```bash
# 确保后端正在运行
cd /root/promptvalar
node test-subscription.js
```

测试脚本会自动：
- 创建测试用户
- 获取订阅计划
- 激活 Pro 订阅
- 测试所有 API 端点
- 显示详细测试结果

---

## 📊 功能检查清单

完成这些步骤以验证系统正常工作：

### 基础功能
- [ ] 后端服务正常启动（端口 3001）
- [ ] 前端服务正常启动（端口 5173）
- [ ] 数据库连接成功
- [ ] 可以注册/登录账号

### 订阅功能
- [ ] 访问 `/pricing` 显示定价页面
- [ ] 显示 Free 和 Pro 计划
- [ ] 显示"测试模式"提示
- [ ] 点击升级按钮能激活订阅
- [ ] 访问 `/dashboard/subscription` 显示订阅信息
- [ ] 可以看到当前计划和状态
- [ ] 可以取消订阅
- [ ] 可以恢复订阅

### API 测试
- [ ] `GET /api/v1/subscriptions/plans` 返回计划
- [ ] `GET /api/v1/subscriptions/current` 返回订阅
- [ ] `POST /api/v1/subscriptions/test/activate` 激活订阅
- [ ] `POST /api/v1/subscriptions/cancel` 取消订阅
- [ ] `POST /api/v1/subscriptions/resume` 恢复订阅

---

## 🎯 关键文件说明

### 后端

```
backend/src/
├── services/subscription.service.ts
│   └── 订阅业务逻辑、Stripe 集成、测试模式
│
├── controllers/subscription.controller.ts
│   └── API 端点处理
│
├── middleware/subscription.middleware.ts
│   └── 订阅验证、功能访问控制
│
└── routes/subscription.routes.ts
    └── 路由定义
```

### 前端

```
frontend/src/
├── pages/
│   ├── PricingPage.tsx              # 定价页面
│   └── SubscriptionManagementPage.tsx  # 订阅管理
│
└── services/subscription.ts         # API 调用
```

### 数据库

- `users` 表添加了 `stripe_customer_id` 字段
- `subscriptions` 表存储订阅信息

---

## 🔍 常见问题排查

### 问题：测试模式端点返回 404

**解决方案：**
```bash
# 确认 .env 中设置了
STRIPE_TEST_MODE=true

# 重启后端服务
```

### 问题：数据库连接失败

**解决方案：**
```bash
# 检查 PostgreSQL 是否运行
pg_isready

# 检查数据库 URL 是否正确
echo $DATABASE_URL

# 手动连接测试
psql $DATABASE_URL
```

### 问题：前端无法连接后端

**解决方案：**
```bash
# 检查后端是否运行
curl http://localhost:3001/health

# 检查 CORS 设置
# backend/src/index.ts 中的 CORS_ORIGIN

# 检查前端环境变量
cat frontend/.env
```

### 问题：订阅激活后没有变化

**解决方案：**
```bash
# 1. 检查数据库
psql $DATABASE_URL -c "SELECT * FROM subscriptions;"
psql $DATABASE_URL -c "SELECT id, username, subscription_tier FROM users;"

# 2. 检查后端日志
# 查看是否有错误信息

# 3. 清除浏览器缓存
# 重新登录刷新 token
```

---

## 🎨 自定义配置

### 修改 Pro 计划价格

编辑 `backend/src/services/subscription.service.ts`:

```typescript
export const SUBSCRIPTION_PLANS = {
  pro: {
    name: 'Pro',
    price: 29.99,  // 修改价格
    features: [
      // 添加或修改功能列表
    ],
  },
};
```

### 添加新的订阅层级

1. 更新 `SUBSCRIPTION_PLANS`
2. 更新数据库 schema
3. 更新前端定价页面
4. 添加相应的访问控制

### 修改功能访问规则

编辑 `backend/src/middleware/subscription.middleware.ts`:

```typescript
const featureRules: Record<string, (tier: string) => boolean> = {
  'your-feature': (tier) => tier === 'pro',
  // 添加更多规则
};
```

---

## 📈 监控和日志

### 查看订阅相关日志

```bash
# 后端日志会显示：
# - 订阅创建/更新
# - Webhook 事件
# - 错误信息

# 过滤订阅相关日志
npm run dev | grep -i subscription
```

### 数据库查询

```sql
-- 查看所有订阅
SELECT u.username, u.subscription_tier, s.status, s.plan_type
FROM users u
LEFT JOIN subscriptions s ON u.id = s.user_id;

-- 查看活跃的 Pro 订阅
SELECT COUNT(*) as pro_users
FROM users
WHERE subscription_tier = 'pro';

-- 查看订阅状态分布
SELECT status, COUNT(*) as count
FROM subscriptions
GROUP BY status;
```

---

## 🚀 部署到生产环境

### 切换到生产模式

1. **获取 Stripe 密钥**
   - 访问 https://stripe.com
   - 获取生产环境密钥

2. **更新后端 .env**
   ```bash
   STRIPE_TEST_MODE=false
   STRIPE_SECRET_KEY=sk_live_xxx
   STRIPE_WEBHOOK_SECRET=whsec_xxx
   STRIPE_PRO_PRICE_ID=price_xxx
   ```

3. **配置 Webhook**
   - Stripe Dashboard → Webhooks
   - 添加端点: `https://your-domain.com/api/v1/subscriptions/webhook`
   - 选择事件类型

4. **更新前端 .env**
   ```bash
   VITE_API_BASE_URL=https://api.your-domain.com
   ```

5. **测试生产环境**
   - 使用 Stripe 测试卡
   - 验证支付流程
   - 检查 Webhook 接收

详细部署指南请参考 `SUBSCRIPTION_GUIDE.md`

---

## 📚 相关文档

- **SUBSCRIPTION_GUIDE.md** - 完整的订阅系统指南
- **technical-implementation-plan.md** - 技术实现计划
- **test-subscription.js** - 自动化测试脚本

---

## ✅ 完成！

你现在已经拥有一个功能完整的订阅系统！

**测试模式特点：**
- ✅ 无需真实 Stripe 账号
- ✅ 一键激活 Pro 订阅
- ✅ 完整功能测试
- ✅ 快速开发迭代

**准备好上线时：**
- 📝 配置 Stripe 生产密钥
- 📝 设置 Webhook
- 📝 测试支付流程
- 📝 监控订阅状态

有问题？查看 `SUBSCRIPTION_GUIDE.md` 的常见问题部分！

