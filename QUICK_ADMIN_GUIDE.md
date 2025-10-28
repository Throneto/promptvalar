# 🚀 管理员后台快速指南

## ✅ 管理员账户已创建

**账户信息:**
- **邮箱**: test@promptvalar.com
- **用户名**: testuser
- **角色**: admin ✅
- **密码**: (注册时设置的密码)

---

## 📍 访问管理后台

### 1. 登录系统

#### 开发环境
访问: http://localhost:3000/login
```
邮箱: test@promptvalar.com
密码: [你注册时设置的密码]
```

#### 生产环境
访问: https://promptvalar.com/login
```
邮箱: test@promptvalar.com
密码: [你注册时设置的密码]
```

### 2. 访问管理后台

登录成功后，访问以下地址：

#### 开发环境
- **仪表板**: http://localhost:3000/admin
- **用户管理**: http://localhost:3000/admin/users
- **提示词管理**: http://localhost:3000/admin/prompts

#### 生产环境
- **仪表板**: https://promptvalar.com/admin
- **用户管理**: https://promptvalar.com/admin/users
- **提示词管理**: https://promptvalar.com/admin/prompts

---

## 🔧 管理功能

### 📊 仪表板 (`/admin`)
- 查看系统统计数据
- 用户增长趋势
- 热门提示词排行
- 实时活跃数据

### 👥 用户管理 (`/admin/users`)
- 查看所有用户列表
- 搜索用户
- 编辑用户信息
- 重置用户密码
- 启用/禁用用户
- 删除用户
- 设置用户角色和订阅等级

### 📝 提示词管理 (`/admin/prompts`)
- 查看所有提示词
- 搜索和筛选
- 编辑提示词
- 发布/取消发布
- 设置高级提示词
- 删除提示词

---

## 🆕 创建更多管理员

如需创建更多管理员账户：

### 步骤 1: 注册新账户
访问 `/register` 页面注册新用户

### 步骤 2: 设置管理员权限
```bash
cd /root/promptvalar
./set-admin.sh new-admin@example.com
```

---

## 🔍 验证管理员权限

### 方法 1: 通过界面
1. 登录账户
2. 尝试访问 `/admin`
3. 如果能访问，说明有管理员权限

### 方法 2: 通过数据库
```bash
sudo -u postgres psql -d promptvalar -c "SELECT username, email, role FROM users WHERE email = 'test@promptvalar.com';"
```

应该看到 `role` 字段为 `admin`

### 方法 3: 查看所有管理员
```bash
sudo -u postgres psql -d promptvalar -c "SELECT username, email, role FROM users WHERE role = 'admin';"
```

---

## ⚠️ 常见问题

### Q: 登录后访问 /admin 被重定向到首页？

**原因**: 浏览器中缓存的用户信息还是旧的（role: user）

**解决方案**:
1. 退出登录
2. 清除浏览器缓存或打开无痕模式
3. 重新登录

或在浏览器控制台执行：
```javascript
localStorage.clear();
location.reload();
```

### Q: 如何取消管理员权限？

```bash
sudo -u postgres psql -d promptvalar -c "UPDATE users SET role = 'user' WHERE email = 'user@example.com';"
```

### Q: 忘记管理员账户密码？

**方法 1: 使用重置密码脚本**
```bash
# 需要先实现密码重置功能
```

**方法 2: 直接在数据库中更新密码哈希**
```bash
# 先生成新密码的hash，然后更新数据库
# 建议使用应用的密码重置功能
```

**方法 3: 创建新的管理员账户**
```bash
# 注册新账户，然后设置为管理员
./set-admin.sh new-admin@example.com
```

---

## 🔐 安全建议

1. **使用强密码**
   - 至少8个字符
   - 包含大小写字母、数字和特殊字符

2. **定期更换密码**
   - 建议每3-6个月更换一次

3. **限制管理员数量**
   - 只给必要的人员管理员权限
   - 定期审查管理员列表

4. **操作日志**
   - 记录所有管理员操作
   - 定期检查异常操作

5. **不要在公共场所登录**
   - 避免在不安全的网络环境下登录管理后台

---

## 📚 相关文档

- **完整管理员文档**: `ADMIN_ACCESS.md`
- **开发环境配置**: `DEV_ENVIRONMENT.md`
- **API文档**: 查看后端路由文件

---

## 🎯 快速命令参考

```bash
# 查看所有管理员
sudo -u postgres psql -d promptvalar -c "SELECT username, email, role FROM users WHERE role = 'admin';"

# 设置用户为管理员
./set-admin.sh user@example.com

# 取消管理员权限
sudo -u postgres psql -d promptvalar -c "UPDATE users SET role = 'user' WHERE email = 'user@example.com';"

# 查看用户详情
sudo -u postgres psql -d promptvalar -c "SELECT * FROM users WHERE email = 'user@example.com';"

# 查看所有用户
sudo -u postgres psql -d promptvalar -c "SELECT username, email, role, subscription_tier, is_active FROM users;"
```

---

## 🎉 开始使用

现在您可以：

1. ✅ 使用 test@promptvalar.com 登录
2. ✅ 访问 /admin 查看管理后台
3. ✅ 管理用户和提示词
4. ✅ 查看系统统计数据

**祝您使用愉快！** 🚀

---

**创建时间**: 2025-10-26  
**最后更新**: 2025-10-26

