# PromptValar 订阅系统指南

## 📋 目录

1. [系统概述](#系统概述)
2. [功能特性](#功能特性)
3. [技术架构](#技术架构)
4. [开发测试模式](#开发测试模式)
5. [生产环境配置](#生产环境配置)
6. [API 端点](#api-端点)
7. [前端集成](#前端集成)
8. [测试指南](#测试指南)
9. [常见问题](#常见问题)

---

## 系统概述

PromptValar 的订阅系统提供两种订阅层级：

### Free 计划
- ✅ 每月 20 次 AI 生成
- ✅ 访问基础提示词库
- ✅ 基础模型支持
- ✅ 社区支持

### Pro 计划 (¥19.99/月)
- ✅ 无限次 AI 生成
- ✅ 访问所有高级提示词
- ✅ 所有 AI 模型支持
- ✅ 优先客户支持
- ✅ 高级编辑器功能
- ✅ 提示词历史记录
- ✅ API 访问权限

---

## 功能特性

### 已实现功能

#### 后端
- ✅ Stripe 支付集成
- ✅ 订阅创建和管理
- ✅ Webhook 事件处理
- ✅ 订阅验证中间件
- ✅ 功能访问控制
- ✅ 开发测试模式

#### 前端
- ✅ 定价页面
- ✅ 订阅管理界面
- ✅ Stripe Checkout 集成
- ✅ 订阅状态展示
- ✅ 取消/恢复订阅
- ✅ 测试模式支持

---

## 技术架构

### 后端架构

```
backend/src/
├── services/
│   └── subscription.service.ts      # 订阅业务逻辑
├── controllers/
│   └── subscription.controller.ts   # API 端点控制器
├── middleware/
│   └── subscription.middleware.ts   # 订阅验证中间件
└── routes/
    └── subscription.routes.ts       # 路由配置
```

### 前端架构

```
frontend/src/
├── pages/
│   ├── PricingPage.tsx              # 定价页面
│   └── SubscriptionManagementPage.tsx  # 订阅管理
└── services/
    └── subscription.ts              # API 服务
```

### 数据库 Schema

```sql
-- users 表添加字段
ALTER TABLE users ADD COLUMN stripe_customer_id VARCHAR(255);

-- subscriptions 表
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  plan_type VARCHAR(20),
  status VARCHAR(20),
  stripe_subscription_id VARCHAR(255),
  stripe_customer_id VARCHAR(255),
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  cancel_at_period_end BOOLEAN,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

---

## 开发测试模式

### 配置测试模式

在后端 `.env` 文件中设置：

```bash
# 启用测试模式
STRIPE_TEST_MODE=true

# 这些键可以为空或使用占位符
STRIPE_SECRET_KEY=sk_test_placeholder
STRIPE_WEBHOOK_SECRET=whsec_test_placeholder
STRIPE_PRO_PRICE_ID=price_test_pro
```

### 测试模式特性

1. **无需真实 Stripe 账号**
   - 跳过 Stripe API 调用
   - 使用模拟数据

2. **一键激活订阅**
   ```bash
   POST /api/v1/subscriptions/test/activate
   ```

3. **模拟支付流程**
   - 创建 Checkout Session 返回本地 URL
   - 直接激活订阅，无需支付

4. **完整功能测试**
   - 订阅创建/取消/恢复
   - 功能访问控制
   - 订阅状态管理

### 使用测试模式

#### 1. 启动后端（测试模式）

```bash
cd backend
# 确保 .env 中 STRIPE_TEST_MODE=true
npm run dev
```

#### 2. 启动前端

```bash
cd frontend
npm run dev
```

#### 3. 测试流程

1. 注册/登录账号
2. 访问 `/pricing` 定价页面
3. 点击"升级到 Pro"
4. 系统自动激活 Pro 订阅（测试模式）
5. 访问 `/dashboard/subscription` 管理订阅

#### 4. 使用测试脚本

```bash
# 运行自动化测试
node test-subscription.js
```

测试脚本会自动测试所有订阅相关的 API 端点。

---

## 生产环境配置

### 1. 创建 Stripe 账号

访问 [stripe.com](https://stripe.com) 注册账号

### 2. 获取 API 密钥

在 Stripe Dashboard：
- 开发者 → API 密钥
- 复制 Secret key 和 Publishable key

### 3. 创建产品和价格

```bash
# 在 Stripe Dashboard 中：
1. 产品 → 添加产品
2. 名称: PromptValar Pro
3. 价格: ¥19.99/月 (或 $19.99)
4. 复制 Price ID (price_xxx)
```

### 4. 配置 Webhook

```bash
# 在 Stripe Dashboard 中：
1. 开发者 → Webhooks → 添加端点
2. URL: https://your-domain.com/api/v1/subscriptions/webhook
3. 选择事件:
   - checkout.session.completed
   - customer.subscription.created
   - customer.subscription.updated
   - customer.subscription.deleted
   - invoice.payment_succeeded
   - invoice.payment_failed
4. 复制 Webhook 签名密钥
```

### 5. 后端环境变量

```bash
# .env (生产环境)
STRIPE_TEST_MODE=false
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_PRO_PRICE_ID=price_xxx
```

### 6. 前端环境变量

```bash
# .env (生产环境)
VITE_API_BASE_URL=https://api.your-domain.com
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
```

---

## API 端点

### 公开端点

#### 获取订阅计划
```http
GET /api/v1/subscriptions/plans
```

**响应:**
```json
{
  "success": true,
  "plans": {
    "free": { ... },
    "pro": { ... }
  }
}
```

### 需要认证的端点

#### 获取当前订阅
```http
GET /api/v1/subscriptions/current
Authorization: Bearer {token}
```

#### 创建 Checkout Session
```http
POST /api/v1/subscriptions/checkout
Authorization: Bearer {token}
Content-Type: application/json

{
  "priceId": "price_xxx"
}
```

**响应:**
```json
{
  "success": true,
  "sessionId": "cs_xxx",
  "url": "https://checkout.stripe.com/...",
  "testMode": false
}
```

#### 创建 Portal Session
```http
POST /api/v1/subscriptions/portal
Authorization: Bearer {token}
```

#### 取消订阅
```http
POST /api/v1/subscriptions/cancel
Authorization: Bearer {token}
Content-Type: application/json

{
  "immediate": false
}
```

#### 恢复订阅
```http
POST /api/v1/subscriptions/resume
Authorization: Bearer {token}
```

#### 检查功能访问
```http
GET /api/v1/subscriptions/check-access?feature=premium-prompts
Authorization: Bearer {token}
```

### Webhook 端点

```http
POST /api/v1/subscriptions/webhook
Stripe-Signature: {signature}
```

### 测试模式端点

```http
POST /api/v1/subscriptions/test/activate
Authorization: Bearer {token}
```

---

## 前端集成

### 1. 使用订阅 API 服务

```typescript
import {
  getSubscriptionPlans,
  getCurrentSubscription,
  createCheckoutSession,
} from '../services/subscription';

// 获取计划
const plans = await getSubscriptionPlans();

// 创建订阅
const { url } = await createCheckoutSession(token, priceId);
window.location.href = url;
```

### 2. 保护 Pro 功能

```typescript
import { checkFeatureAccess } from '../services/subscription';

const hasAccess = await checkFeatureAccess(token, 'premium-prompts');

if (!hasAccess) {
  navigate('/pricing');
}
```

### 3. 显示订阅状态

```typescript
const subscription = await getCurrentSubscription(token);

if (subscription?.status === 'active') {
  // 显示 Pro 功能
}
```

---

## 测试指南

### 自动化测试

```bash
# 运行完整测试套件
node test-subscription.js

# 设置自定义 API URL
API_BASE_URL=http://localhost:3001 node test-subscription.js
```

### 手动测试清单

#### 测试模式
- [ ] 访问定价页面 `/pricing`
- [ ] 点击"升级到 Pro"
- [ ] 确认订阅自动激活
- [ ] 访问订阅管理页面
- [ ] 测试取消订阅
- [ ] 测试恢复订阅
- [ ] 验证 Pro 功能访问

#### 生产模式测试（使用 Stripe 测试卡）
- [ ] 使用测试卡号: `4242 4242 4242 4242`
- [ ] 任意未来日期和 CVC
- [ ] 完成支付流程
- [ ] 验证 Webhook 接收
- [ ] 验证订阅激活
- [ ] 测试订阅管理

### Stripe 测试卡

```
成功支付: 4242 4242 4242 4242
需要 3D 验证: 4000 0025 0000 3155
支付失败: 4000 0000 0000 9995
```

---

## 中间件使用

### 保护 Pro 端点

```typescript
import { requireProSubscription } from '../middleware/subscription.middleware';

router.get(
  '/premium-prompts',
  authenticate,
  requireProSubscription,
  controller.getPremiumPrompts
);
```

### 功能访问控制

```typescript
import { requireFeatureAccess } from '../middleware/subscription.middleware';

router.post(
  '/advanced-generation',
  authenticate,
  requireFeatureAccess('advanced-models'),
  controller.advancedGenerate
);
```

### 附加订阅信息

```typescript
import { attachSubscriptionInfo } from '../middleware/subscription.middleware';

router.get(
  '/dashboard',
  authenticate,
  attachSubscriptionInfo,
  controller.getDashboard
);

// 在控制器中访问
const isPro = req.subscription?.isPro;
```

---

## 常见问题

### Q: 如何在没有 Stripe 账号的情况下测试？

**A:** 启用测试模式：
1. 设置 `STRIPE_TEST_MODE=true`
2. 使用测试端点激活订阅
3. 所有功能都可以本地测试

### Q: 测试模式和生产模式有什么区别？

**A:** 测试模式：
- 跳过 Stripe API 调用
- 使用模拟数据
- 一键激活订阅
- 适合开发和演示

生产模式：
- 真实 Stripe 集成
- 真实支付处理
- Webhook 事件
- 适合线上运营

### Q: 如何切换到生产环境？

**A:** 
1. 获取 Stripe 生产密钥
2. 设置 `STRIPE_TEST_MODE=false`
3. 配置真实的 Price ID 和 Webhook
4. 更新前端环境变量
5. 测试支付流程

### Q: Webhook 如何测试？

**A:** 
1. 使用 Stripe CLI:
```bash
stripe listen --forward-to localhost:3001/api/v1/subscriptions/webhook
```
2. 或使用测试模式跳过 Webhook

### Q: 如何处理订阅升级/降级？

**A:** 
- 升级: 用户通过 Checkout 购买 Pro
- 降级: 在当前周期结束后自动降级
- Stripe 自动处理按比例退款

### Q: 订阅数据存储在哪里？

**A:** 
- 数据库: 基本订阅信息
- Stripe: 完整支付和订阅历史
- 使用 Webhook 保持同步

---

## 后续开发计划

### Phase 1 (已完成)
- ✅ 基础订阅系统
- ✅ Stripe 集成
- ✅ 测试模式
- ✅ 前端界面

### Phase 2 (计划中)
- [ ] 年付折扣
- [ ] 优惠券系统
- [ ] 团队订阅
- [ ] 订阅分析仪表板

### Phase 3 (未来)
- [ ] 多币种支持
- [ ] 地区定价
- [ ] 企业计划
- [ ] API 额度管理

---

## 支持与联系

如有问题或需要帮助，请：
1. 查看本文档
2. 运行测试脚本诊断
3. 检查日志输出
4. 联系技术支持

---

**最后更新**: 2025-10-26
**版本**: 1.0.0

