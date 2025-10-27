# 8要素框架视频提示词优化 - 快速启动指南

## 🚀 5分钟快速部署

### 第1步：执行数据库迁移

```bash
cd /root/promptvalar/backend

# 确认数据库连接
echo $DATABASE_URL

# 执行迁移
npm run migrate

# 或直接执行SQL
psql $DATABASE_URL -f drizzle/0003_add_8_elements_framework.sql
```

**预期输出**:
```
🔄 Running database migrations...
✅ Migrations completed successfully
```

### 第2步：验证迁移成功

```bash
# 连接数据库验证
psql $DATABASE_URL -c "SELECT column_name FROM information_schema.columns WHERE table_name = 'structured_prompts' AND column_name IN ('camera_movement', 'style', 'audio', 'timeline', 'constraints');"
```

**预期输出**: 应显示5个新字段

### 第3步：重启服务

```bash
# 开发环境
cd /root/promptvalar
./start-dev.sh

# 或单独重启后端
cd backend
npm run dev
```

### 第4步：测试新功能

#### 测试Sora视频生成（8要素完整）

```bash
curl -X POST http://localhost:5001/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "idea": "一辆黑色跑车在雪山公路上逃离雪崩",
    "model": "sora",
    "style": "cinematic"
  }'
```

**预期响应包含8要素**:
```json
{
  "success": true,
  "data": {
    "prompt": "A glossy black sports car racing down...",
    "structured": {
      "subject": "A glossy black sports car",
      "setting": "Narrow mountain road at dusk",
      "action": "Racing down as avalanche cascades",
      "shotType": "Wide drone shot",
      "cameraMovement": "Tracking shot",        // ✅ 新增
      "style": "Ultra-realistic, cinematic",     // ✅ 新增
      "lighting": "Cold blue tones",
      "audio": "Engine roar, snow impacts",      // ✅ 新增
      "timeline": null,                          // ✅ 新增
      "constraints": "Realistic physics...",     // ✅ 新增
      "composition": "Dynamic composition",
      "mood": ["intense", "dramatic"],
      "parameters": "8 seconds, 16:9, 4K"
    }
  }
}
```

#### 测试Veo视频+音频生成

```bash
curl -X POST http://localhost:5001/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "idea": "一只橙色小猫在温馨厨房里探索神秘发光球",
    "model": "veo",
    "style": "photorealistic"
  }'
```

**关键验证点**: 响应的 `audio` 字段应包含详细的音频描述（对话/音效/配乐）

## 📊 功能验证清单

### ✅ 数据库层
- [ ] 5个新字段已添加到 `structured_prompts` 表
- [ ] 字段注释正确显示（中文说明）
- [ ] 现有数据不受影响

### ✅ 后端功能
- [ ] Sora生成包含完整8要素（特别是constraints）
- [ ] Veo生成包含详细audio描述
- [ ] nano banana生成使用摄影师视角
- [ ] 生成的prompt是流畅段落而非关键词罗列

### ✅ 数据验证
- [ ] timeline字段可以存储JSON数组
- [ ] 新字段允许为NULL（向后兼容）
- [ ] 验证器接受新的字段结构

## 🎯 快速测试场景

### 场景1：单场景视频（Sora）

**输入**: "一个宇航员在月球表面漫步"

**验证点**:
- ✅ `subject`: 宇航员的详细描述
- ✅ `setting`: 月球表面环境
- ✅ `cameraMovement`: 镜头运动方式
- ✅ `constraints`: 物理真实性要求（月球重力）

### 场景2：多场景视频（Sora + Timeline）

**输入**: "制作一个8秒的产品广告：手机从盒子中升起，旋转展示，最后定格在logo"

**验证点**:
- ✅ `timeline`: 应包含3个场景的时间规划
- ✅ 每个场景有start, end, description

### 场景3：音频重点视频（Veo）

**输入**: "音乐会现场，钢琴家在演奏肖邦夜曲"

**验证点**:
- ✅ `audio`: 详细的音频描述（钢琴音乐、观众呼吸声、大厅回声等）
- ✅ 音频描述占比较大

### 场景4：摄影风格图像（nano banana）

**输入**: "一杯咖啡在木桌上，清晨阳光照射"

**验证点**:
- ✅ `style`: 包含相机型号、镜头信息
- ✅ `lighting`: 详细的光线描述
- ✅ prompt是场景描述而非关键词

## 🔍 问题排查

### 问题1: 迁移失败

**症状**: 执行迁移时报错

**解决方案**:
```bash
# 检查数据库连接
psql $DATABASE_URL -c "SELECT version();"

# 检查表是否存在
psql $DATABASE_URL -c "\d structured_prompts"

# 手动执行迁移
psql $DATABASE_URL < backend/drizzle/0003_add_8_elements_framework.sql
```

### 问题2: 生成的structured数据缺少新字段

**症状**: 响应中的structured对象没有新增的字段

**可能原因**:
1. 服务未重启（缓存了旧的类型定义）
2. 迁移未成功执行

**解决方案**:
```bash
# 重启服务
pkill -f "node.*backend"
cd /root/promptvalar/backend
npm run dev

# 验证schema是否更新
grep -A 10 "cameraMovement" backend/src/db/schema.ts
```

### 问题3: AI生成的prompt质量未提升

**症状**: 生成的提示词仍然是简单的关键词堆砌

**可能原因**: OpenRouter API密钥未配置或模型选择错误

**解决方案**:
```bash
# 检查环境变量
grep OPENROUTER backend/.env

# 查看生成日志
tail -f backend/backend.log | grep "OpenRouter"

# 测试API连接
curl -X POST https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer $OPENROUTER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model": "anthropic/claude-3.5-sonnet", "messages": [{"role": "user", "content": "test"}]}'
```

## 📖 深入学习

### 1. 理解8要素框架

详细阅读:
- `PROJECT_RULES.md` - AI Model Integration Rules章节
- `backend/src/config/modelPromptStrategies.ts` - 查看完整的System Prompt

### 2. 自定义模型策略

编辑 `modelPromptStrategies.ts` 来调整:
- System Prompt的措辞
- Temperature和max_tokens参数
- Few-shot示例

### 3. 扩展合成逻辑

编辑 `promptComposer.service.ts` 来:
- 调整不同模型的合成模板
- 修改连接词和叙事风格
- 优化字符限制策略

## 🎨 优化前后对比

### 优化前 (7要素)
```json
{
  "subject": "a car",
  "action": "driving fast",
  "setting": "mountain road",
  "shotType": "wide shot",
  "lighting": "sunset",
  "composition": "dynamic",
  "mood": ["exciting"]
}
```

**生成的Prompt**: 
"A car driving fast on a mountain road. Wide shot. Sunset lighting. Exciting."

### 优化后 (8要素 + 导演式)
```json
{
  "subject": "A glossy black Bentley Continental Supersports",
  "action": "Racing down as a roaring avalanche cascades behind it",
  "setting": "Narrow alpine mountain road at dusk, dark storm clouds",
  "shotType": "Wide drone shot",
  "cameraMovement": "Tracking shot transitioning to low bumper cam",
  "style": "Ultra-realistic, cinematic",
  "lighting": "Cold blue tones with warm headlight glow",
  "audio": "Thunderous engine growl, snow impacts",
  "constraints": "Enforce realistic physics, natural gravity",
  "composition": "Dynamic with car in foreground",
  "mood": ["intense", "dramatic", "survival"]
}
```

**生成的Prompt**:
"A glossy black Bentley Continental Supersports racing down a narrow alpine mountain road at dusk as a roaring avalanche cascades behind it. Wide drone tracking shot transitioning to low bumper cam. Cold blue tones with warm headlight glow cutting through snow spray. Ultra-realistic with cinematic motion blur. Engine growls and snow impacts create visceral atmosphere. Enforce realistic physics, natural gravity, and clean reflections."

## 🎯 性能指标

### 预期改进

| 指标 | 优化前 | 优化后 | 提升 |
|------|--------|--------|------|
| 提示词平均长度 | ~100字符 | ~300-400字符 | +300% |
| 结构化字段数 | 7个 | 12个 | +71% |
| 模型专用策略 | 1个通用 | 4个专用 | +400% |
| 物理真实性描述 | 缺失 | 标准包含 | ✅ |
| 音频描述（Veo） | 简单 | 详细 | ✅ |

## 📞 获取帮助

### 文档资源
- 📄 `VIDEO_PROMPT_OPTIMIZATION_SUMMARY.md` - 完整优化总结
- 📄 `MIGRATION_GUIDE_8_ELEMENTS.md` - 详细迁移指南
- 📄 `PROJECT_RULES.md` - 项目规则和最佳实践

### 代码参考
- 🔧 `backend/src/config/modelPromptStrategies.ts` - 策略配置
- 🔧 `backend/src/services/promptComposer.service.ts` - 合成逻辑
- 🔧 `backend/src/services/openrouter.service.ts` - 生成函数

### 日志查看
```bash
# 后端日志
tail -f /root/promptvalar/backend/backend.log

# 数据库查询日志
tail -f /var/log/postgresql/postgresql-*.log
```

---

**祝使用愉快！** 🎬✨

如果遇到任何问题，请参考上述文档或检查日志文件。

