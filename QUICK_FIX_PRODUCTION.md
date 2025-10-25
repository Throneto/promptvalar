# 🔧 生产环境部署快速修复

## 问题诊断

**错误信息**: `sh: 1: tsc: not found`

**原因**: 
- 部署脚本使用 `npm ci --only=production` 跳过了 devDependencies
- TypeScript (tsc) 在 devDependencies 中
- 生产环境构建需要 TypeScript 来编译代码

---

## ✅ 立即修复方案

### 方案 1: 修改后端依赖安装（推荐）

在生产服务器执行：

```bash
cd /var/www/promptvalar/backend

# 1. 安装所有依赖（包括 dev）用于构建
npm ci

# 2. 构建后端
npm run build

# 3. 构建完成后，重新安装仅生产依赖（可选，节省空间）
npm ci --omit=dev

# 4. 继续前端构建
cd ../frontend
npm ci
rm -rf node_modules/.vite
npm run build

# 5. 重启服务
pm2 restart promptvalar-backend
sudo systemctl reload nginx

# 6. 验证
pm2 status
pm2 logs promptvalar-backend --lines 20
```

### 方案 2: 使用修复后的部署脚本

我会更新部署脚本，然后您可以重新运行。

---

## 📋 执行步骤（详细版）

```bash
# 当前位置应该在 /var/www/promptvalar
cd /var/www/promptvalar/backend

# 清理之前的安装
rm -rf node_modules

# 完整安装（包括 dev 依赖用于构建）
echo "安装后端依赖..."
npm ci

# 检查 TypeScript 是否可用
echo "验证 TypeScript..."
npx tsc --version

# 构建后端
echo "构建后端..."
npm run build

# 检查构建结果
if [ -d "dist" ] && [ -f "dist/index.js" ]; then
    echo "✓ 后端构建成功"
    ls -lh dist/
else
    echo "✗ 后端构建失败"
    exit 1
fi

# 数据库迁移
echo "运行数据库迁移..."
npm run db:migrate || echo "没有新的迁移"

# 现在可以移除 dev 依赖以节省空间（可选）
# npm ci --omit=dev

# 构建前端
cd ../frontend
echo "安装前端依赖..."
npm ci

echo "构建前端..."
rm -rf node_modules/.vite dist
npm run build

# 检查前端构建
if [ -d "dist" ] && [ -f "dist/index.html" ]; then
    echo "✓ 前端构建成功"
    du -sh dist/
else
    echo "✗ 前端构建失败"
    exit 1
fi

# 重启服务
echo "重启服务..."
pm2 restart promptvalar-backend
pm2 flush
sudo systemctl reload nginx

# 验证
echo "验证服务状态..."
pm2 status
echo ""
echo "查看最新日志:"
pm2 logs promptvalar-backend --lines 20 --nostream
```

---

## 🚀 一键执行

复制以下完整命令并执行：

```bash
cd /var/www/promptvalar/backend && \
npm ci && \
npm run build && \
npm run db:migrate && \
cd ../frontend && \
npm ci && \
rm -rf node_modules/.vite dist && \
npm run build && \
pm2 restart promptvalar-backend && \
sudo systemctl reload nginx && \
pm2 status && \
echo "" && \
echo "✅ 部署完成！" && \
echo "访问 https://tablevision.top 验证"
```

---

## 🔍 验证部署成功

### 1. 检查构建文件

```bash
# 检查后端构建
ls -lh /var/www/promptvalar/backend/dist/

# 检查前端构建  
ls -lh /var/www/promptvalar/frontend/dist/
du -sh /var/www/promptvalar/frontend/dist/
```

### 2. 检查服务状态

```bash
# PM2 状态
pm2 status

# 实时日志
pm2 logs promptvalar-backend --lines 50
```

### 3. 测试访问

```bash
# 测试后端 API
curl -I https://api.tablevision.top/health

# 测试前端
curl -I https://tablevision.top
```

### 4. 浏览器测试

1. 访问 https://tablevision.top
2. **清除浏览器缓存**（Ctrl+Shift+Delete）
3. 登录账户
4. 访问 https://tablevision.top/dashboard/prompts
5. 验证页面显示 "My Prompts"（英文）

---

## 📝 为什么会出现这个问题？

**原因分析**：

1. **部署脚本设计**：
   - 使用 `npm ci --only=production` 是为了节省空间和提高安全性
   - 只安装运行时需要的依赖，不包括开发工具

2. **TypeScript 的位置**：
   - TypeScript 被放在 `devDependencies` 中
   - 这是标准做法，因为 TypeScript 只在构建时需要

3. **冲突**：
   - 生产环境需要构建代码（需要 TypeScript）
   - 但脚本跳过了 dev 依赖（没有 TypeScript）

**两种解决思路**：

1. **在生产环境构建**（当前方案）：
   - 先安装所有依赖
   - 构建完成
   - 可选：之后移除 dev 依赖

2. **在开发环境构建**（CI/CD 方案）：
   - 在开发环境或 CI 中构建
   - 只推送编译后的 dist 目录
   - 生产环境只需要运行时依赖

---

## 🔧 更新后的部署脚本

我会创建一个修复版本的部署脚本，避免这个问题。

---

## ✅ 下一步

执行上面的"一键执行"命令，完成部署。

预计时间：5-8 分钟

