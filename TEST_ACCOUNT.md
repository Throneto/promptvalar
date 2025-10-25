# 🔑 测试账号信息

## 快速登录

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌐 域名: http://tablevision.top
📧 邮箱: test@tablevision.top
🔑 密码: Test123456
👤 用户名: testuser
━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## 🚀 快速测试步骤

1. **登录：** http://tablevision.top/login
2. **进入 Studio：** 点击导航栏 "Studio"
3. **生成提示词：** 输入想法 → 点击 "Generate"
4. **保存提示词：** 点击绿色 "💾 保存提示词" 按钮
5. **验证保存：** 检查是否跳转到详情页

## 📖 详细测试指南

请查看：`PRODUCTION_TEST_GUIDE.md`

## ⚠️ 注意事项

- 这是测试账号，请勿在生产环境使用
- 密码包含：大写字母 + 小写字母 + 数字
- 如需创建新测试账号，运行脚本：
  ```bash
  cd /root/promptvalar/backend
  DATABASE_URL="postgresql://promptvalar:promptvalar_dev_password@localhost:5432/promptvalar" \
  npx tsx src/scripts/create-test-user.ts
  ```

## 🔧 如需重置密码

如果需要重置测试账号密码，可以运行：

```bash
cd /root/promptvalar/backend
psql -h localhost -U promptvalar -d promptvalar -c \
"UPDATE users SET password_hash = '\$2b\$10\$...' WHERE email = 'test@tablevision.top';"
```

或者删除后重新创建：

```bash
cd /root/promptvalar/backend
psql -h localhost -U promptvalar -d promptvalar -c \
"DELETE FROM users WHERE email = 'test@tablevision.top';"

# 然后重新运行创建脚本
DATABASE_URL="postgresql://promptvalar:promptvalar_dev_password@localhost:5432/promptvalar" \
npx tsx src/scripts/create-test-user.ts
```

---

**创建时间：** 2025-10-25  
**用户ID：** 8f1fb68c-9817-49cc-9fed-7838f310581f

