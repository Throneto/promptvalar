# Cloudflare 缓存清除完整指南

## 🔍 问题确认

服务器端已经修复完成：
- ✅ 新版本文件已部署：`index-DJGI6Mt5.js`
- ✅ 旧文件已删除：`index-Bgahyi7w.js`
- ✅ Nginx配置已优化（index.html不再缓存）
- ✅ 服务器测试通过

**但是Cloudflare CDN缓存了旧版本！**

## 🚀 清除Cloudflare缓存的正确方法

### 方法1：完全清除缓存（推荐）

1. **登录 Cloudflare 控制台**
   - 访问：https://dash.cloudflare.com
   - 选择域名：`promptvalar.com`

2. **清除所有缓存**
   - 左侧菜单 → **Caching** → **Configuration**
   - 找到 **Purge Cache** 部分
   - 点击 **Purge Everything** 按钮
   - 确认清除

3. **等待生效**
   - 通常需要 30秒 - 2分钟
   - 清除成功后会显示通知

### 方法2：清除特定文件（更精确）

如果不想清除所有缓存，可以只清除特定文件：

1. **进入 Purge Cache**
   - Cloudflare 控制台 → Caching → Configuration
   - 选择 **Custom Purge**

2. **输入要清除的URL**（逐个添加）
   ```
   https://promptvalar.com/
   https://promptvalar.com/index.html
   https://promptvalar.com/assets/index-Bgahyi7w.js
   https://promptvalar.com/assets/index-6yGQy9EI.css
   https://promptvalar.com/pricing
   ```

3. **点击 Purge** 按钮

### 方法3：使用开发模式（临时禁用缓存）

如果需要测试，可以临时禁用Cloudflare缓存：

1. **开启开发模式**
   - Cloudflare 控制台 → Caching → Configuration
   - 找到 **Development Mode**
   - 切换为 **ON**

2. **测试网站**
   - 开发模式下，Cloudflare会绕过缓存
   - 可以看到最新版本
   - 开发模式会在3小时后自动关闭

3. **确认无误后关闭开发模式**

## 🌐 完整清除步骤（确保成功）

### 第1步：清除Cloudflare缓存
按照上面的**方法1**清除所有缓存

### 第2步：清除浏览器缓存
即使Cloudflare缓存已清除，浏览器本地可能还有缓存：

**Chrome / Edge:**
1. 按 `F12` 打开开发者工具
2. 右键点击刷新按钮
3. 选择 **清空缓存并硬性重新加载**

**或者使用快捷键:**
- Windows: `Ctrl + Shift + Delete`
- Mac: `Cmd + Shift + Delete`

### 第3步：验证是否加载新版本

1. **打开开发者工具**（F12）
2. **切换到 Network（网络）标签**
3. **刷新页面**（F5）
4. **查找 index.html**
   - 查看响应头：应该包含 `Cache-Control: no-store, no-cache`
   - 查看HTML内容：应该包含 `index-DJGI6Mt5.js`（新版本）

5. **验证API请求**
   - 在Network标签查找对 `/subscriptions/plans` 的请求
   - URL应该是：`https://api.promptvalar.com/api/v1/subscriptions/plans`
   - **不应该**包含重复的 `/api/v1/api/v1/`

### 第4步：验证API功能

打开浏览器控制台（F12 → Console），应该**没有**404错误：
- ❌ 旧版本：`Failed to load resource: 404 (Not Found)`
- ✅ 新版本：订阅计划正常加载

## 🔧 如果仍然不行

### 尝试无痕模式测试

**Chrome/Edge:**
- 按 `Ctrl + Shift + N` 打开无痕窗口
- 访问 https://promptvalar.com/pricing
- 检查是否还有404错误

如果无痕模式下正常，说明是本地缓存问题。

### 检查 Cloudflare 设置

确保以下设置正确：

1. **Caching Level（缓存级别）**
   - 建议设置为 **Standard** 或 **Ignore Query String**

2. **Browser Cache TTL（浏览器缓存TTL）**
   - 建议设置为 **4 hours** 或更短
   - 这样即使缓存也会较快过期

3. **Always Online（始终在线）**
   - 如果开启，可能会提供缓存的旧版本
   - 建议暂时关闭测试

### 使用 API 清除缓存（高级）

如果有Cloudflare API Token，可以使用命令行清除：

```bash
# 需要替换以下变量
ZONE_ID="your_zone_id"
API_TOKEN="your_api_token"

curl -X POST "https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/purge_cache" \
  -H "Authorization: Bearer ${API_TOKEN}" \
  -H "Content-Type: application/json" \
  --data '{"purge_everything":true}'
```

## 📊 验证清除成功的标志

访问 https://promptvalar.com/pricing 时：

### ✅ 成功标志
- 页面正常加载
- 显示订阅计划（Free和Pro）
- 浏览器控制台**没有**404错误
- Network标签显示：
  - `index-DJGI6Mt5.js` ✅（新版本）
  - API请求：`api.promptvalar.com/api/v1/subscriptions/plans` ✅

### ❌ 失败标志
- 看到"无法加载订阅计划，请刷新页面重试"
- 浏览器控制台显示404错误
- Network标签显示：
  - `index-Bgahyi7w.js` ❌（旧版本）
  - API请求：`api.promptvalar.com/api/v1/api/v1/subscriptions/plans` ❌（路径重复）

## 🎯 快速检查清单

- [ ] Cloudflare缓存已清除
- [ ] 浏览器缓存已清除
- [ ] 硬性刷新页面（Ctrl+Shift+R）
- [ ] 打开开发者工具验证文件名
- [ ] 检查Network标签，确认API URL正确
- [ ] 订阅计划页面正常显示
- [ ] 控制台无404错误

## 💡 为什么会发生这个问题？

1. **文件部署位置错误**
   - 代码在 `/root/promptvalar/` 构建
   - 但Nginx服务的是 `/var/www/promptvalar/`
   - 已修复：现在自动同步

2. **多层缓存**
   - Cloudflare CDN缓存（1年）
   - Nginx静态文件缓存（1年）
   - 浏览器缓存（根据响应头）
   - 已修复：index.html现在不缓存

3. **路径重复问题**
   - 环境变量和代码都包含 `/api/v1`
   - 已修复：现在只在一处定义

## 📞 需要帮助？

如果按照以上步骤仍然无法解决，请提供：
1. 浏览器控制台的完整错误信息
2. Network标签的截图
3. 加载的JS文件名（index-xxx.js）
4. Cloudflare设置截图

---

**记住：清除Cloudflare缓存后，等待1-2分钟让CDN节点同步！**

