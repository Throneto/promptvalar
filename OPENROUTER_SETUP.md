# OpenRouter API 配置指南

## 🔍 问题诊断

### 症状
- 登录成功后访问 `/studio` 页面
- 控制台显示 `500 Internal Server Error`
- API 请求到 `/api/v1/ai/generate-prompt` 失败
- 错误消息：`"Failed to generate prompt. Please try again."`

### 根本原因
**缺少有效的 OpenRouter API Key**

后端服务需要 OpenRouter API 来调用 Claude 3.5 Sonnet 模型生成提示词，但 `.env` 文件中的 `OPENROUTER_API_KEY` 是占位符值。

---

## ✅ 解决方案

### 第 1 步：获取 OpenRouter API Key

1. 访问 [https://openrouter.ai/](https://openrouter.ai/)
2. 点击右上角 **Sign In** 或 **Sign Up**
3. 登录后，点击左侧菜单的 **Keys**
4. 点击 **Create Key** 按钮
5. 输入 Key 名称（例如：`PromptValar Development`）
6. 复制生成的 API Key（格式：`sk-or-v1-xxxxxxxxxxxxxxxx`）
7. **重要**：充值至少 $5-10 用于测试（Credits 页面）

### 第 2 步：配置环境变量

#### 方法 A：手动编辑
```bash
nano /root/promptvalar/backend/.env
```

找到这一行：
```
OPENROUTER_API_KEY=sk-or-v1-your-key-here
```

替换为你的真实 API Key：
```
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxxxxx
```

保存并退出（Ctrl+X, Y, Enter）

#### 方法 B：命令行替换
```bash
cd /root/promptvalar/backend
sed -i 's/sk-or-v1-your-key-here/sk-or-v1-YOUR_ACTUAL_KEY_HERE/' .env
```

#### 方法 C：完全重写 .env 文件
```bash
cd /root/promptvalar/backend
cat > .env << 'EOF'
# Environment Configuration
NODE_ENV=development
PORT=5000

# Database
DATABASE_URL=postgresql://promptvalar:throne999000@localhost:5432/promptvalar

# JWT Secrets
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-2024
JWT_REFRESH_SECRET=your-super-secret-jwt-refresh-key-change-this-in-production-2024

# OpenRouter API
OPENROUTER_API_KEY=sk-or-v1-YOUR_ACTUAL_KEY_HERE
OPENROUTER_SITE_URL=https://promptvalar.com
OPENROUTER_APP_NAME=PromptValar

# CORS
CORS_ORIGIN=http://localhost:3000,https://promptvalar.com
EOF
```

### 第 3 步：重启后端服务

```bash
# 1. 停止所有后端进程
pkill -f "tsx watch src/index.ts"

# 2. 确认进程已停止
ps aux | grep "tsx watch" | grep -v grep

# 3. 重新启动后端
cd /root/promptvalar/backend
npm run dev > backend.log 2>&1 &

# 4. 查看启动日志
tail -f backend.log
# 看到 "🚀 Server running on http://localhost:5000" 表示成功
# 按 Ctrl+C 退出日志查看
```

### 第 4 步：验证配置

#### 测试 API
```bash
curl -X POST http://localhost:5000/api/v1/ai/generate-prompt \
  -H "Content-Type: application/json" \
  -d '{
    "idea": "一只猫在阳光下散步",
    "model": "sora",
    "style": "cinematic"
  }'
```

**预期结果**：
```json
{
  "success": true,
  "data": {
    "prompt": "...",
    "structured": { ... },
    "logId": "..."
  }
}
```

**如果仍然失败**，检查：
1. API Key 是否正确（没有多余空格）
2. OpenRouter 账户是否有余额
3. 查看后端日志：`tail -n 50 /root/promptvalar/backend/backend.log`

---

## 🎯 使用的模型

PromptValar 使用以下 OpenRouter 模型：

| 用途 | 模型 | 说明 |
|------|------|------|
| 提示词生成 | `anthropic/claude-3.5-sonnet` | 主力模型，生成高质量提示词 |
| 提示词解析 | `anthropic/claude-3-haiku` | 更快更便宜，用于解析和建议 |

**预计成本**：
- 生成一次提示词：约 $0.003 - $0.01
- $5 可以生成约 500-1000 次

---

## 🔒 安全提示

⚠️ **不要将 API Key 提交到 Git**

检查 `.gitignore` 是否包含：
```bash
grep ".env" /root/promptvalar/.gitignore
```

如果没有，添加：
```bash
echo ".env" >> /root/promptvalar/.gitignore
echo "backend/.env" >> /root/promptvalar/.gitignore
```

---

## 📊 监控使用情况

定期检查 OpenRouter 使用情况：
1. 访问 [https://openrouter.ai/activity](https://openrouter.ai/activity)
2. 查看请求历史和费用
3. 设置预算提醒（Settings → Limits）

---

## 🐛 故障排查

### 问题 1：仍然收到 500 错误

**检查清单**：
```bash
# 检查 .env 文件
cat /root/promptvalar/backend/.env | grep OPENROUTER

# 检查后端日志
tail -n 100 /root/promptvalar/backend/backend.log | grep -i error

# 检查环境变量是否加载
cd /root/promptvalar/backend
node -e "require('dotenv').config(); console.log(process.env.OPENROUTER_API_KEY)"
```

### 问题 2：API Key 无效

**症状**：`401 Unauthorized` 或 `Invalid API key`

**解决**：
1. 重新复制 API Key（确保完整）
2. 检查 OpenRouter 账户状态
3. 重新生成新的 API Key

### 问题 3：余额不足

**症状**：`402 Payment Required` 或 `Insufficient credits`

**解决**：
1. 访问 [https://openrouter.ai/credits](https://openrouter.ai/credits)
2. 充值至少 $5
3. 等待几分钟后重试

---

## 📞 获取帮助

如果问题仍然存在：

1. **查看完整日志**：
   ```bash
   tail -n 200 /root/promptvalar/backend/backend.log
   ```

2. **检查网络连接**：
   ```bash
   curl https://openrouter.ai/api/v1/models
   ```

3. **测试 API Key**：
   ```bash
   curl https://openrouter.ai/api/v1/auth/key \
     -H "Authorization: Bearer YOUR_API_KEY"
   ```

---

**最后更新**：2025-10-28

