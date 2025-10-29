# AI功能设置指南 (AI Feature Setup Guide)

## 问题诊断 (Problem Diagnosis)

如果您遇到 "Failed to generate prompt" 错误（500 Internal Server Error），这是因为未配置有效的OpenRouter API密钥。

## 解决方案 (Solution)

### 步骤1：获取OpenRouter API密钥

1. 访问 [OpenRouter](https://openrouter.ai/)
2. 注册账号或登录
3. 前往 [API Keys](https://openrouter.ai/keys) 页面
4. 点击 "Create Key" 创建新的API密钥
5. 复制生成的密钥（格式：`sk-or-v1-xxx...`）

**推荐充值**：$5-10 足够测试使用

### 步骤2：配置环境变量

在项目根目录创建 `.env` 文件：

```bash
# OpenRouter API配置（必需）
OPENROUTER_API_KEY=sk-or-v1-your-actual-api-key-here
```

### 步骤3：重启Docker容器

```bash
# 停止当前容器
docker compose down

# 重新启动（会加载新的环境变量）
docker compose up -d

# 查看日志确认启动成功
docker compose logs -f backend
```

## 验证配置 (Verification)

配置成功后，访问 Prompt Studio 页面并尝试生成提示词。如果仍有问题：

1. 检查API密钥是否正确复制（包括 `sk-or-v1-` 前缀）
2. 确认OpenRouter账户有足够余额
3. 查看后端日志：`docker compose logs backend`

## 环境变量说明 (Environment Variables)

| 变量名 | 必需 | 说明 |
|--------|------|------|
| `OPENROUTER_API_KEY` | ✅ 是 | OpenRouter API密钥 |
| `OPENROUTER_APP_NAME` | ❌ 否 | 应用名称（默认：PromptValar） |
| `OPENROUTER_SITE_URL` | ❌ 否 | 网站URL（默认：https://promptvalar.com） |

## 费用参考 (Cost Reference)

- Claude 3.5 Sonnet: ~$3/百万tokens（用于生成提示词）
- Claude 3 Haiku: ~$0.25/百万tokens（用于解析提示词）
- 一般每次生成消耗约 0.5-2 cents

## 故障排查 (Troubleshooting)

### 错误：500 Internal Server Error
- **原因**：API密钥无效或未设置
- **解决**：按上述步骤配置有效的API密钥

### 错误：403 Forbidden
- **原因**：API密钥无效
- **解决**：检查密钥是否正确，或重新生成新密钥

### 错误：429 Too Many Requests
- **原因**：超出速率限制
- **解决**：等待片刻后重试，或升级OpenRouter计划

### 错误：402 Payment Required
- **原因**：账户余额不足
- **解决**：在OpenRouter充值

## 更多帮助 (More Help)

- OpenRouter文档：https://openrouter.ai/docs
- 项目快速开始：[QUICK_START.md](./QUICK_START.md)
- API文档：[backend/README.md](./backend/README.md)

