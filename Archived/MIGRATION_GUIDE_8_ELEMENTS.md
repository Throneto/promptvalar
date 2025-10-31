# 8要素框架数据库迁移指南

## 概述

本次迁移为 `structured_prompts` 表添加了5个新字段，以支持完整的8要素框架视频提示词优化理论。

## 新增字段

| 字段名 | 类型 | 说明 | 对应要素 |
|--------|------|------|----------|
| `camera_movement` | varchar(100) | 镜头运动方式 | 要素4b: Camera Movement |
| `style` | text | 视觉风格描述 | 要素5: Style |
| `audio` | text | 音频元素描述 | 要素6: Audio |
| `timeline` | jsonb | 时间轴数据 | 要素7: Timeline |
| `constraints` | text | 约束条件 | 要素8: Constraints |

## 8要素框架映射

完整的8要素框架在数据库中的映射关系：

1. **Subject（主题）** → `subject` 字段（已存在）
2. **Setting（环境）** → `setting` 字段（已存在）
3. **Action（动作）** → `action` 字段（已存在）
4. **Camera（摄影）** → `shot_type` + `camera_movement` 字段
5. **Style（视觉风格）** → `style` + `lighting` 字段
6. **Audio（音效）** → `audio` 字段（新增）⭐
7. **Timeline（时间轴）** → `timeline` 字段（新增）⭐
8. **Constraints（约束）** → `constraints` 字段（新增）⭐

## 执行迁移

### 方法1：使用Drizzle Kit（推荐）

如果需要重新生成迁移：

\`\`\`bash
cd backend

# 生成新的迁移文件
npx drizzle-kit generate:pg

# 应用迁移
npm run migrate
\`\`\`

### 方法2：直接执行SQL

如果手动迁移已提供的SQL文件：

\`\`\`bash
cd backend

# 执行迁移脚本
psql $DATABASE_URL -f drizzle/0003_add_8_elements_framework.sql

# 或使用Node.js迁移工具
npm run migrate
\`\`\`

### 方法3：开发环境自动迁移

如果你的开发环境配置了自动迁移，只需重启服务：

\`\`\`bash
cd backend
npm run dev
\`\`\`

## 验证迁移

迁移成功后，验证新字段是否存在：

\`\`\`sql
-- 查看 structured_prompts 表结构
\\d structured_prompts

-- 检查新字段
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'structured_prompts' 
AND column_name IN ('camera_movement', 'style', 'audio', 'timeline', 'constraints');
\`\`\`

预期输出应包含所有5个新字段。

## 数据兼容性

### 向后兼容

- 所有新字段都允许为 `NULL`
- 现有数据不会受到影响
- 旧版提示词仍可正常读取和显示

### Timeline字段格式

\`timeline\` 字段存储JSON格式的时间轴数据：

\`\`\`json
[
  {
    "start": 0,
    "end": 3,
    "description": "Wide aerial shot of Bentley racing down mountain road"
  },
  {
    "start": 3,
    "end": 6,
    "description": "Close-up of driver's intense expression"
  },
  {
    "start": 6,
    "end": 8,
    "description": "Rear view as avalanche closes in"
  }
]
\`\`\`

## 影响范围

### 后端变更

- ✅ `backend/src/db/schema.ts` - Schema定义已更新
- ✅ `backend/src/services/openrouter.service.ts` - 类型定义已更新
- ✅ `backend/src/services/prompt.service.ts` - 数据插入逻辑已更新
- ✅ `backend/src/validators/prompt.validator.ts` - 验证规则已更新
- ✅ `backend/src/config/modelPromptStrategies.ts` - 新增模型策略配置

### 前端变更

- ✅ `frontend/src/types/prompt.ts` - TypeScript类型已更新

### 文档变更

- ✅ `PROJECT_RULES.md` - AI集成规则已更新

## 回滚方案

如需回滚此迁移，执行以下SQL：

\`\`\`sql
-- 警告：此操作将删除新字段的所有数据
ALTER TABLE "structured_prompts" DROP COLUMN IF EXISTS "camera_movement";
ALTER TABLE "structured_prompts" DROP COLUMN IF EXISTS "style";
ALTER TABLE "structured_prompts" DROP COLUMN IF EXISTS "audio";
ALTER TABLE "structured_prompts" DROP COLUMN IF EXISTS "timeline";
ALTER TABLE "structured_prompts" DROP COLUMN IF EXISTS "constraints";
\`\`\`

## 测试建议

迁移后建议测试以下功能：

1. **提示词生成测试**
   \`\`\`bash
   # 使用Sora模型生成提示词
   curl -X POST http://localhost:5001/api/generate \\
     -H "Content-Type: application/json" \\
     -d '{
       "idea": "一辆跑车在雪山上逃离雪崩",
       "model": "sora",
       "style": "cinematic"
     }'
   \`\`\`

2. **提示词保存测试**
   - 验证新字段能否正确保存到数据库
   - 检查timeline JSON格式是否正确存储

3. **提示词查询测试**
   - 验证包含新字段的提示词能否正确读取
   - 检查NULL字段不影响旧数据

## 性能影响

- 新增5个字段对性能影响极小
- `timeline` JSONB字段支持高效查询
- 无需添加新索引（当前查询模式不需要）

## 问题排查

### 迁移失败

如果迁移失败，检查：

1. 数据库连接是否正常：\`echo $DATABASE_URL\`
2. 是否有足够的权限执行ALTER TABLE
3. 是否有其他进程锁定了表

### 字段未出现

如果迁移成功但字段未出现：

1. 检查是否连接到正确的数据库
2. 刷新数据库连接或重启应用
3. 验证schema.ts与数据库是否同步

## 后续步骤

迁移完成后：

1. ✅ 测试AI生成功能是否包含8要素
2. ✅ 验证前端显示是否正常
3. ✅ 更新API文档（如有）
4. ✅ 通知团队成员Schema变更

## 联系支持

如遇到迁移问题，请查阅：
- 项目文档：`PROJECT_RULES.md`
- 技术细节：`backend/src/config/modelPromptStrategies.ts`

