# PromptValar 订阅系统指南

**最后更新**: 2025-10-29  
**版本**: v1.0.0  
**状态**: ✅ 生产就绪

---

## 📋 目录

1. [系统概述](#系统概述)
2. [快速开始](#快速开始)
3. [技术架构](#技术架构)
4. [开发测试模式](#开发测试模式)
5. [生产环境配置](#生产环境配置)
6. [API端点](#api端点)
7. [前端集成](#前端集成)
8. [中间件使用](#中间件使用)
9. [测试指南](#测试指南)
10. [常见问题](#常见问题)

---

## 🎯 系统概述

PromptValar的订阅系统提供两种订阅层级，支持测试模式和生产模式。

### 订阅计划

#### Free计划（免费）
- ✅ 每月20次AI生成
- ✅ 访问基础提示词库
- ✅ 基础模型支持
- ✅ 社区支持

#### Pro计划（¥19.99/月）
- ✅ 无限次AI生成
- ✅ 访问所有高级提示词
- ✅ 所有AI模型支持
- ✅ 优先客户支持
- ✅ 高级编辑器功能
- ✅ 提示词历史记录
- ✅ API访问权限

### 已实现功能

#### 后端
- ✅ Stripe支付集成
- ✅ 订阅创建和管理
- ✅ Webhook事件处理
- ✅ 订阅验证中间件
- ✅ 功能访问控制
- ✅ 开发测试模式

#### 前端
- ✅ 定价页面
- ✅ 订阅管理界面
- ✅ Stripe Checkout集成
- ✅ 订阅状态展示
- ✅ 取消/恢复订阅
- ✅ 测试模式支持

---

## 🚀 快速开始

### 5分钟快速启动

#### 1. 安装依赖

```bash
# 后端
cd backend
npm install

# 前端
cd ../frontend
npm install
```

#### 2. 配置环境变量（测试模式）

后端 `backend/.env`:
```bash
# 启用测试模式
STRIPE_TEST_MODE=true

# 这些可以使用占位符
STRIPE_SECRET_KEY=sk_test_placeholder
STRIPE_WEBHOOK_SECRET=whsec_test_placeholder
STRIPE_PRO_PRICE_ID=price_test_pro
```

前端 `frontend/.env`:
```bash
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

#### 3. 运行数据库迁移

```bash
cd backend
npm run db:migrate
```

#### 4. 启动服务

```bash
# 终端1 - 后端
cd backend
npm run dev

# 终端2 - 前端
cd frontend
npm run dev
```

#### 5. 测试订阅功能

**通过网页界面**:
1. 访问 `http://localhost:3000/pricing`
2. 点击"升级到Pro"
3. 系统自动激活Pro订阅（测试模式）
4. 访问 `/dashboard/subscription` 查看订阅

**通过测试脚本**:
```bash
node test-subscription.js
```

---

## 🏗️ 技术架构

### 后端架构

```
backend/src/
├── services/
│   └── subscription.service.ts      # 订阅业务逻辑
├── controllers/
│   └── subscription.controller.ts   # API端点控制器
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
    └── subscription.ts              # API服务
```

### 数据库Schema

```sql
-- users表添加字段
ALTER TABLE users ADD COLUMN stripe_customer_id VARCHAR(255);

-- subscriptions表
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

## 🧪 开发测试模式

### 为什么需要测试模式？

测试模式允许你**无需Stripe账号**即可测试完整的订阅功能：

✅ 一键激活Pro订阅  
✅ 完整的订阅生命周期  
✅ 取消/恢复订阅  
✅ 功能访问控制  
✅ 适合开发和演示

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

1. **无需真实Stripe账号**
   - 跳过Stripe API调用
   - 使用模拟数据

2. **一键激活订阅**
   ```bash
   POST /api/v1/subscriptions/test/activate
   ```

3. **模拟支付流程**
   - 创建Checkout Session返回本地URL
   - 直接激活订阅，无需支付

4. **完整功能测试**
   - 订阅创建/取消/恢复
   - 功能访问控制
   - 订阅状态管理

### 使用测试脚本

```bash
# 运行自动化测试
node test-subscription.js
```

测试脚本会自动测试所有订阅相关的API端点。

---

## 🌐 生产环境配置

### 1. 创建Stripe账号

访问 [stripe.com](https://stripe.com) 注册账号

### 2. 获取API密钥

在Stripe Dashboard：
- 开发者 → API密钥
- 复制Secret key和Publishable key

### 3. 创建产品和价格

```bash
# 在Stripe Dashboard中：
1. 产品 → 添加产品
2. 名称: PromptValar Pro
3. 价格: ¥19.99/月 (或 $19.99)
4. 复制Price ID (price_xxx)
```

### 4. 配置Webhook

```bash
# 在Stripe Dashboard中：
1. 开发者 → Webhooks → 添加端点
2. URL: https://your-domain.com/api/v1/subscriptions/webhook
3. 选择事件:
   - checkout.session.completed
   - customer.subscription.created
   - customer.subscription.updated
   - customer.subscription.deleted
   - invoice.payment_succeeded
   - invoice.payment_failed
4. 复制Webhook签名密钥
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
VITE_API_BASE_URL=https://api.your-domain.com/api/v1
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
```

---

## 📡 API端点

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
    "free": {
      "name": "Free",
      "price": 0,
      "features": [...],
      "limits": {...}
    },
    "pro": {
      "name": "Pro",
      "price": 19.99,
      "priceId": "price_xxx",
      "features": [...],
      "limits": {...}
    }
  }
}
```

### 需要认证的端点

#### 获取当前订阅
```http
GET /api/v1/subscriptions/current
Authorization: Bearer {token}
```

#### 创建Checkout Session
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

#### 创建Portal Session
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

### Webhook端点

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

## 💻 前端集成

### 1. 使用订阅API服务

```typescript
import {
  getSubscriptionPlans,
  getCurrentSubscription,
  createCheckoutSession,
} from '../services/subscription';

// 获取计划
const plans = await getSubscriptionPlans();

// 创建订阅
const { url, testMode } = await createCheckoutSession(token, priceId);

if (testMode) {
  // 测试模式：订阅已自动激活
  alert('Pro订阅已激活！');
} else {
  // 生产模式：跳转到Stripe
  window.location.href = url;
}
```

### 2. 保护Pro功能

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
  // 显示Pro功能
}
```

---

## 🛡️ 中间件使用

### 保护Pro端点

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

## 🧪 测试指南

### 自动化测试

```bash
# 运行完整测试套件
node test-subscription.js

# 设置自定义API URL
API_BASE_URL=http://localhost:3001 node test-subscription.js
```

### 手动测试清单

#### 测试模式
- [ ] 访问定价页面 `/pricing`
- [ ] 点击"升级到Pro"
- [ ] 确认订阅自动激活
- [ ] 访问订阅管理页面
- [ ] 测试取消订阅
- [ ] 测试恢复订阅
- [ ] 验证Pro功能访问

#### 生产模式测试（使用Stripe测试卡）
- [ ] 使用测试卡号: `4242 4242 4242 4242`
- [ ] 任意未来日期和CVC
- [ ] 完成支付流程
- [ ] 验证Webhook接收
- [ ] 验证订阅激活
- [ ] 测试订阅管理

### Stripe测试卡

```
成功支付: 4242 4242 4242 4242
需要3D验证: 4000 0025 0000 3155
支付失败: 4000 0000 0000 9995
```

---

## ❓ 常见问题

### Q: 如何在没有Stripe账号的情况下测试？

**A:** 启用测试模式：
1. 设置 `STRIPE_TEST_MODE=true`
2. 使用测试端点激活订阅
3. 所有功能都可以本地测试

### Q: 测试模式和生产模式有什么区别？

**A:** 
- **测试模式**: 跳过Stripe API，使用模拟数据，一键激活订阅
- **生产模式**: 真实Stripe集成，真实支付处理，Webhook事件

### Q: 如何切换到生产环境？

**A:** 
1. 获取Stripe生产密钥
2. 设置 `STRIPE_TEST_MODE=false`
3. 配置真实的Price ID和Webhook
4. 更新前端环境变量
5. 测试支付流程

### Q: Webhook如何测试？

**A:** 
1. 使用Stripe CLI:
```bash
stripe listen --forward-to localhost:3001/api/v1/subscriptions/webhook
```
2. 或使用测试模式跳过Webhook

### Q: 如何处理订阅升级/降级？

**A:** 
- 升级: 用户通过Checkout购买Pro
- 降级: 在当前周期结束后自动降级
- Stripe自动处理按比例退款

### Q: 订阅数据存储在哪里？

**A:** 
- 数据库: 基本订阅信息
- Stripe: 完整支付和订阅历史
- 使用Webhook保持同步

---

## 🔄 后续开发计划

### Phase 1（已完成）
- ✅ 基础订阅系统
- ✅ Stripe集成
- ✅ 测试模式
- ✅ 前端界面

### Phase 2（计划中）
- [ ] 年付折扣
- [ ] 优惠券系统
- [ ] 团队订阅
- [ ] 订阅分析仪表板

### Phase 3（未来）
- [ ] 多币种支持
- [ ] 地区定价
- [ ] 企业计划
- [ ] API额度管理

---

## 📝 快速命令参考

```bash
# 测试订阅功能
node test-subscription.js

# 查看订阅状态
psql $DATABASE_URL -c "SELECT * FROM subscriptions;"

# 激活测试订阅
curl -X POST http://localhost:5000/api/v1/subscriptions/test/activate \
  -H "Authorization: Bearer $TOKEN"

# 查看订阅计划
curl http://localhost:5000/api/v1/subscriptions/plans
```

---

## 📚 相关文档

- [部署指南](./DEPLOYMENT.md) - 生产环境部署
- [管理员指南](./ADMIN.md) - 管理员后台使用
- [测试指南](./TESTING_GUIDE.md) - 测试流程和规范

---

**订阅系统状态**: ✅ 生产就绪  
**测试模式**: ✅ 完全支持  
**Stripe集成**: ✅ 完整实现  

**享受订阅系统！** 💳

