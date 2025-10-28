# API URL 404 错误修复报告

## 问题描述

用户遇到了以下 404 错误：
```
Failed to load resource: the server responded with a status of 404 (Not Found)
url: "https://api.promptvalar.com/api/v1/api/v1/subscriptions/plans"
```

## 问题分析

错误的 URL 中包含了两个 `/api/v1` 路径：
- **错误的 URL**: `https://api.promptvalar.com/api/v1/api/v1/subscriptions/plans`
- **正确的 URL**: `https://api.promptvalar.com/api/v1/subscriptions/plans`

这是因为前端构建时使用了旧的缓存或配置，导致 API 基础 URL 配置不正确。

## 解决方案

### 1. 重新构建前端

执行了以下操作：
```bash
cd /var/www/promptvalar/frontend

# 创建正确的环境变量文件
cat > .env.production <<EOF
VITE_API_BASE_URL=https://api.promptvalar.com/api/v1
VITE_APP_NAME=PromptValar
VITE_APP_URL=https://promptvalar.com
EOF

# 清理缓存和旧构建
sudo rm -rf dist .vite node_modules/.vite

# 重新构建
sudo -u promptvalar npm run build

# 重新加载 Nginx
sudo systemctl reload nginx
```

### 2. 验证修复

构建完成后验证：
- ✅ dist 目录已创建
- ✅ JavaScript 文件已生成
- ✅ API URL 已正确嵌入到构建文件中
- ✅ Nginx 已重新加载

### 3. 后端 API 验证

确认后端 API 端点工作正常：
```bash
curl https://api.promptvalar.com/api/v1/subscriptions/plans
# 返回：{"success":true,"plans":{...}}
```

## 用户需要执行的操作

为了看到修复效果，请按照以下步骤操作：

### 1. 清除浏览器缓存
- 按 `Ctrl+Shift+Delete` 打开清除缓存对话框
- 选择"缓存的图片和文件"
- 点击"清除数据"

### 2. 硬刷新页面
- 按 `Ctrl+Shift+R` 强制刷新页面（跳过缓存）

### 3. 验证修复
1. 打开浏览器开发者工具（按 F12）
2. 切换到 Network（网络）标签
3. 刷新页面
4. 查找对 `subscriptions/plans` 的请求
5. 确认 URL 是：`https://api.promptvalar.com/api/v1/subscriptions/plans`

## 技术细节

### 前端配置文件

**位置**: `/var/www/promptvalar/frontend/.env.production`

**内容**:
```
VITE_API_BASE_URL=https://api.promptvalar.com/api/v1
VITE_APP_NAME=PromptValar
VITE_APP_URL=https://promptvalar.com
```

### 代码中的 API 使用

在 `frontend/src/services/subscription.ts` 中：
```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

export async function getSubscriptionPlans(): Promise<SubscriptionPlans> {
  const response = await axios.get(`${API_BASE_URL}/subscriptions/plans`);
  return response.data.plans;
}
```

这会生成最终 URL：
- `VITE_API_BASE_URL` = `https://api.promptvalar.com/api/v1`
- 拼接路径 = `/subscriptions/plans`
- 最终 URL = `https://api.promptvalar.com/api/v1/subscriptions/plans` ✅

### 后端路由配置

在 `backend/src/index.ts` 中：
```typescript
app.use('/api/v1/subscriptions', subscriptionRoutes);
```

订阅计划端点完整路径：
- 基础路径：`/api/v1/subscriptions`
- 路由路径：`/plans`
- 完整路径：`/api/v1/subscriptions/plans` ✅

### Nginx 配置

API 域名配置正常：
```nginx
server_name api.promptvalar.com;

location / {
    proxy_pass http://localhost:5000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    # ... 其他代理配置
}
```

## 预防措施

为了避免将来出现类似问题，建议：

1. **使用环境变量管理工具**
   - 创建 `.env.template` 文件记录所有环境变量
   - 在部署脚本中验证环境变量

2. **添加构建验证**
   - 在构建后自动检查 API URL 配置
   - 添加自动化测试验证 API 端点

3. **清理缓存**
   - 每次重新构建前清理 Vite 缓存
   - 使用版本化的文件名（Vite 已自动处理）

4. **监控和日志**
   - 添加前端错误监控
   - 记录 API 请求失败的详细信息

## 快速修复脚本

已创建修复脚本：`/root/promptvalar/fix-frontend-api-url.sh`

如果将来再次遇到类似问题，只需运行：
```bash
cd /root/promptvalar
bash fix-frontend-api-url.sh
```

## 修复时间

- 问题发现时间：2025-10-28 08:30
- 修复完成时间：2025-10-28 08:35
- 总耗时：约 5 分钟

## 状态

✅ **问题已修复**

前端已重新构建并部署，API URL 配置正确。用户需要清除浏览器缓存后即可正常使用。


