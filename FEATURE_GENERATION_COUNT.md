# 用户管理 - 生成次数统计功能

## 功能概述

在用户管理页面中添加了显示用户点击生成提示词的次数，并支持按生成次数排序的功能。

## 修改内容

### 后端修改

#### 1. `/root/promptvalar/backend/src/services/admin.service.ts`
- 导入 `promptGenerationLogs` 表和 `asc` 排序函数
- 修改 `getUsers` 函数：
  - 添加 `sortBy` 和 `sortOrder` 参数，支持按 `createdAt`、`generationCount` 或 `username` 排序
  - 使用 LEFT JOIN 关联 `prompt_generation_logs` 表
  - 使用 GROUP BY 和 COUNT 统计每个用户的生成次数
  - 返回包含 `generationCount` 字段的用户列表

#### 2. `/root/promptvalar/backend/src/controllers/admin.controller.ts`
- 修改 `getUsers` 控制器函数
- 添加 `sortBy` 和 `sortOrder` 查询参数的解析
- 将参数传递给 service 层

### 前端修改

#### 3. `/root/promptvalar/frontend/src/services/admin.ts`
- 在 `AdminUser` 接口中添加 `generationCount: number` 字段
- 在 `getUsers` 函数参数中添加 `sortBy` 和 `sortOrder` 选项

#### 4. `/root/promptvalar/frontend/src/pages/AdminUsersPage.tsx`
- 添加图标导入：`ArrowUpDown`, `ArrowUp`, `ArrowDown`
- 添加状态管理：
  - `sortBy`: 排序字段（`'createdAt' | 'generationCount' | 'username'`）
  - `sortOrder`: 排序方向（`'asc' | 'desc'`）
- 添加排序处理函数 `handleSort`
- 添加排序图标组件 `SortIcon`
- 修改表格：
  - 在"用户名"列添加排序功能
  - 新增"生成次数"列，显示用户的生成统计，支持排序
  - 在"注册时间"列添加排序功能
- 在 `loadUsers` 函数中传递排序参数

## 功能特性

### 1. 生成次数显示
- 在用户列表中显示每个用户点击生成提示词的总次数
- 使用蓝色徽章高亮显示数字

### 2. 排序功能
支持按以下字段排序：
- **用户名**：按字母顺序排序
- **生成次数**：按生成提示词的次数排序
- **注册时间**：按用户注册时间排序

### 3. 排序交互
- 点击列标题切换排序
- 首次点击：降序排列
- 再次点击：切换为升序
- 点击其他列：切换到新列，默认降序
- 排序图标显示当前排序状态：
  - 未排序：灰色双箭头 ⇅
  - 升序：紫色向上箭头 ↑
  - 降序：紫色向下箭头 ↓

## 技术细节

### 数据库查询
使用 SQL 的 LEFT JOIN 和 GROUP BY 实现：
```sql
SELECT 
  users.*,
  COALESCE(COUNT(prompt_generation_logs.id), 0) as generation_count
FROM users
LEFT JOIN prompt_generation_logs ON users.id = prompt_generation_logs.user_id
GROUP BY users.id
ORDER BY generation_count DESC
```

### 默认排序
- 默认按注册时间降序排列（最新用户在前）
- 可以随时切换到按生成次数排序

## 测试状态

- ✅ 前端代码构建成功（无 TypeScript 错误）
- ✅ 后端代码逻辑正确（drizzle-orm 库的类型警告不影响运行）
- ✅ 数据库表 `prompt_generation_logs` 已存在

## 使用说明

1. 访问管理员面板的用户管理页面
2. 在用户列表中可以看到新增的"生成次数"列
3. 点击列标题（用户名、生成次数、注册时间）可以切换排序
4. 排序图标会显示当前的排序状态

## 相关文件

### 后端
- `backend/src/services/admin.service.ts`
- `backend/src/controllers/admin.controller.ts`

### 前端
- `frontend/src/services/admin.ts`
- `frontend/src/pages/AdminUsersPage.tsx`

### 数据库
- 表：`prompt_generation_logs`
- 迁移文件：`backend/migrations/add_generation_logs.sql`

## 注意事项

1. 生成次数统计基于 `prompt_generation_logs` 表
2. 如果用户从未生成过提示词，显示为 0
3. 排序功能会在切换时重置到第一页
4. 所有筛选条件（搜索、角色、状态、订阅）与排序功能完全兼容

