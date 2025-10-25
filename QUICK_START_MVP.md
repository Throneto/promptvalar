# 🚀 MVP优化系统 - 5分钟快速启动

## 步骤 1: 数据库迁移（2分钟）

```bash
cd /root/promptvalar/backend

# 方式A: 使用Drizzle Kit (推荐)
npx drizzle-kit push:pg

# 方式B: 手动SQL
psql $DATABASE_URL -f migrations/add_generation_logs.sql
```

## 步骤 2: 重启服务（1分钟）

```bash
# 终端 1: 后端
cd /root/promptvalar/backend
npm run dev

# 终端 2: 前端
cd /root/promptvalar/frontend
npm run dev
```

## 步骤 3: 测试功能（2分钟）

1. 访问: http://localhost:3000/studio
2. 生成一个提示词
3. 看到评分组件并打分
4. 查看数据库确认记录

```bash
# 查看日志数据
psql $DATABASE_URL -c "SELECT id, user_rating, created_at FROM prompt_generation_logs ORDER BY created_at DESC LIMIT 5;"
```

## ✅ 完成！

现在系统开始收集数据了。1-2周后查看 `MVP_OPTIMIZATION_COMPLETED.md` 了解如何分析数据。

## 📊 快速查看数据

```bash
# 查看评分统计
psql $DATABASE_URL -c "
SELECT 
  COUNT(*) as total,
  ROUND(AVG(user_rating), 2) as avg_rating,
  COUNT(CASE WHEN user_rating >= 4 THEN 1 END) as good_count
FROM prompt_generation_logs 
WHERE user_rating IS NOT NULL;"
```

---
**问题？** 查看 `MVP_OPTIMIZATION_COMPLETED.md` 的故障排查部分
