# 管理员后台访问指南

## 📋 概述

PromptValar 提供了完整的管理员后台系统，用于管理用户、提示词和查看系统统计数据。

---

## 🌐 管理后台地址

### 开发环境
- **地址**: http://localhost:3000/admin
- **API**: http://localhost:5000/api/v1/admin/*

### 生产环境
- **地址**: https://promptvalar.com/admin
- **API**: https://api.promptvalar.com/api/v1/admin/*

---

## 🔐 访问权限

### 管理员权限要求
管理员后台使用 `AdminRoute` 组件保护，只有满足以下条件的用户才能访问：

1. ✅ 已登录（有效的 JWT token）
2. ✅ 用户角色为 `admin`（role = 'admin'）

如果不满足条件，将被重定向：
- 未登录 → `/login`
- 已登录但非管理员 → `/` (首页)

---

## 👤 创建管理员账户

### 方法 1: 使用设置脚本（推荐）

1. **先注册一个普通账户**
   - 访问 https://promptvalar.com/register
   - 或 http://localhost:3000/register
   - 填写用户名、邮箱和密码完成注册

2. **将账户设置为管理员**
```bash
cd /root/promptvalar
./set-admin.sh your-email@example.com
```

示例：
```bash
./set-admin.sh admin@promptvalar.com
```

脚本会自动：
- 检查用户是否存在
- 将用户角色更新为 admin
- 显示更新后的用户信息

### 方法 2: 直接修改数据库

```bash
# 使用 postgres 用户连接数据库
sudo -u postgres psql -d promptvalar

# 将用户设置为管理员
UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';

# 验证更新
SELECT id, username, email, role FROM users WHERE email = 'your-email@example.com';

# 退出
\q
```

### 方法 3: 使用 PGPASSWORD 环境变量

```bash
PGPASSWORD=throne999000 psql -U promptvalar -h localhost -d promptvalar -c "UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';"
```

---

## 🎯 管理后台功能

### 1. 仪表板 (`/admin`)
**路径**: `/admin`

功能：
- 📊 系统统计数据（总用户数、提示词数、收藏数等）
- 📈 用户增长趋势图表
- 🏆 热门提示词排行榜
- ⚡ 实时系统状态

### 2. 用户管理 (`/admin/users`)
**路径**: `/admin/users`

功能：
- 👥 查看所有用户列表
- 🔍 搜索用户（用户名、邮箱）
- ✏️ 编辑用户信息
- 🔑 重置用户密码
- 🚫 禁用/启用用户账户
- 🗑️ 删除用户
- 📄 分页浏览

### 3. 提示词管理 (`/admin/prompts`)
**路径**: `/admin/admin/prompts`

功能：
- 📝 查看所有提示词
- 🔍 搜索和筛选提示词
- ✏️ 编辑提示词内容
- 👁️ 设置提示词可见性（发布/取消发布）
- ⭐ 设置高级提示词标记
- 🗑️ 删除提示词
- 📄 分页浏览

---

## 🔍 API 端点

管理员 API 需要在请求头中包含有效的 JWT token，且用户角色必须为 admin。

### 仪表板统计
```http
GET /api/v1/admin/dashboard/stats
Authorization: Bearer <token>
```

返回：总用户数、提示词数、收藏数等统计数据

### 用户增长数据
```http
GET /api/v1/admin/dashboard/user-growth?days=30
Authorization: Bearer <token>
```

### 热门提示词
```http
GET /api/v1/admin/dashboard/top-prompts?limit=10
Authorization: Bearer <token>
```

### 用户列表
```http
GET /api/v1/admin/users?page=1&limit=20&search=keyword
Authorization: Bearer <token>
```

### 更新用户
```http
PUT /api/v1/admin/users/:userId
Authorization: Bearer <token>
Content-Type: application/json

{
  "role": "admin",
  "isActive": true,
  "subscriptionTier": "premium"
}
```

### 重置用户密码
```http
POST /api/v1/admin/users/:userId/reset-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "newPassword": "new-secure-password"
}
```

### 删除用户
```http
DELETE /api/v1/admin/users/:userId
Authorization: Bearer <token>
```

### 提示词列表
```http
GET /api/v1/admin/prompts?page=1&limit=20&search=keyword
Authorization: Bearer <token>
```

### 更新提示词
```http
PUT /api/v1/admin/prompts/:promptId
Authorization: Bearer <token>
Content-Type: application/json

{
  "isPublished": true,
  "isPremium": false
}
```

### 删除提示词
```http
DELETE /api/v1/admin/prompts/:promptId
Authorization: Bearer <token>
```

---

## 🛡️ 权限控制

### 前端路由保护
文件：`frontend/src/components/auth/AdminRoute.tsx`

```typescript
export default function AdminRoute({ children }: AdminRouteProps) {
  const isAuth = isAuthenticated();
  const isAdminUser = isAdmin();

  // 未登录，重定向到登录页
  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  // 已登录但不是管理员，重定向到首页
  if (!isAdminUser) {
    return <Navigate to="/" replace />;
  }

  // 是管理员，允许访问
  return <>{children}</>;
}
```

### 后端中间件保护
文件：`backend/src/middleware/auth.middleware.ts`

所有管理员 API 端点都受到中间件保护，会验证：
1. JWT token 有效性
2. 用户角色是否为 admin

---

## 📝 使用流程

### 完整访问流程

1. **注册账户**
   ```
   访问 /register → 填写信息 → 提交注册
   ```

2. **设置管理员权限**
   ```bash
   cd /root/promptvalar
   ./set-admin.sh your-email@example.com
   ```

3. **登录系统**
   ```
   访问 /login → 输入邮箱和密码 → 登录
   ```

4. **访问管理后台**
   ```
   访问 /admin → 查看仪表板
   访问 /admin/users → 管理用户
   访问 /admin/prompts → 管理提示词
   ```

---

## 🔧 故障排查

### 1. 无法访问管理后台（被重定向到首页）

**原因**: 账户没有管理员权限

**解决方案**:
```bash
# 检查用户角色
sudo -u postgres psql -d promptvalar -c "SELECT email, role FROM users WHERE email = 'your-email@example.com';"

# 如果 role 不是 'admin'，执行设置脚本
./set-admin.sh your-email@example.com
```

### 2. 登录后仍然无法访问

**原因**: localStorage 中的用户信息未更新

**解决方案**:
1. 清除浏览器缓存和 localStorage
2. 退出登录
3. 重新登录

或在浏览器控制台执行：
```javascript
localStorage.clear();
window.location.reload();
```

### 3. API 返回 403 Forbidden

**原因**: JWT token 中的用户角色不是 admin

**解决方案**:
1. 确认数据库中用户角色已更新为 admin
2. 退出登录并重新登录以获取新的 token
3. 新的 token 会包含更新后的用户角色信息

### 4. 数据库连接失败

如果使用脚本时出现连接错误：

```bash
# 方法 1: 使用 postgres 用户
sudo -u postgres psql -d promptvalar

# 方法 2: 指定主机（使用 TCP 连接）
PGPASSWORD=throne999000 psql -U promptvalar -h localhost -d promptvalar
```

---

## 📊 管理员页面示例

### 仪表板
```
┌─────────────────────────────────────────┐
│  📊 系统统计                             │
├─────────────────────────────────────────┤
│  👥 总用户数: 1,234                      │
│  📝 总提示词数: 5,678                    │
│  ⭐ 总收藏数: 12,345                     │
│  💎 高级用户: 123                        │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  📈 用户增长趋势 (最近30天)              │
│  [折线图]                                │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  🏆 热门提示词 TOP 10                    │
│  1. Prompt Title 1 - 1,234 views        │
│  2. Prompt Title 2 - 987 views          │
│  ...                                     │
└─────────────────────────────────────────┘
```

---

## 🔒 安全注意事项

1. **密码安全**
   - 使用强密码
   - 定期更换密码
   - 不要在公共场所登录管理后台

2. **权限管理**
   - 仅给予必要人员管理员权限
   - 定期审查管理员账户列表
   - 及时撤销离职人员的管理员权限

3. **操作日志**
   - 所有管理员操作都应该被记录
   - 定期检查操作日志

4. **数据库访问**
   - 限制数据库访问权限
   - 不要在生产环境中直接修改数据库

---

## 📞 获取帮助

如需帮助，请：
1. 查看项目文档
2. 联系开发团队
3. 提交 Issue

---

**最后更新**: 2025-10-26  
**维护者**: PromptValar 开发团队

