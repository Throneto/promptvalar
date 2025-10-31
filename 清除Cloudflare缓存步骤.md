# 清除 Cloudflare 缓存步骤

## 🚨 重要提示
**必须清除 Cloudflare 缓存，用户才能看到最新版本的网站！**

---

## 方法 1：通过 Cloudflare Dashboard（最简单）

### 步骤：

1. **登录 Cloudflare**
   - 访问：https://dash.cloudflare.com
   - 使用您的 Cloudflare 账号登录

2. **选择域名**
   - 在域名列表中点击 `promptvalar.com`

3. **进入缓存设置**
   - 左侧菜单选择 **Caching** → **Configuration**

4. **清除所有缓存**
   - 找到 **Purge Cache** 部分
   - 点击 **Purge Everything** 按钮
   - 在弹出的确认框中点击 **Purge Everything** 确认

5. **等待完成**
   - 通常需要 30 秒到 2 分钟完成
   - 完成后会显示成功提示

---

## 方法 2：清除特定文件（推荐用于小更新）

如果只想清除 Pricing 页面相关的缓存：

1. 在 Cloudflare Dashboard 进入 **Caching** → **Configuration**
2. 点击 **Custom Purge**
3. 选择 **Purge by URL**
4. 输入以下 URL（每行一个）：
   ```
   https://promptvalar.com/pricing
   https://promptvalar.com/index.html
   https://promptvalar.com/assets/index-CY2xuj81.js
   https://promptvalar.com/assets/index--0a_ttpo.css
   ```
5. 点击 **Purge**

---

## 方法 3：使用 Cloudflare API（适合自动化）

### 准备工作

1. 获取 **Zone ID**：
   - 在 Cloudflare Dashboard 的域名概览页面右侧可以看到
   - 格式类似：`a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`

2. 创建 **API Token**：
   - 访问：https://dash.cloudflare.com/profile/api-tokens
   - 点击 **Create Token**
   - 使用模板：**Edit zone DNS** 或 **Custom token**
   - 权限设置：Zone → Cache Purge → Purge
   - 保存并复制 Token

### 清除所有缓存

```bash
curl -X POST "https://api.cloudflare.com/client/v4/zones/YOUR_ZONE_ID/purge_cache" \
     -H "Authorization: Bearer YOUR_API_TOKEN" \
     -H "Content-Type: application/json" \
     --data '{"purge_everything":true}'
```

### 清除特定文件

```bash
curl -X POST "https://api.cloudflare.com/client/v4/zones/YOUR_ZONE_ID/purge_cache" \
     -H "Authorization: Bearer YOUR_API_TOKEN" \
     -H "Content-Type: application/json" \
     --data '{
       "files": [
         "https://promptvalar.com/pricing",
         "https://promptvalar.com/index.html",
         "https://promptvalar.com/assets/index-CY2xuj81.js",
         "https://promptvalar.com/assets/index--0a_ttpo.css"
       ]
     }'
```

**替换参数：**
- `YOUR_ZONE_ID` → 您的 Zone ID
- `YOUR_API_TOKEN` → 您的 API Token

---

## 验证缓存已清除

### 1. 检查响应头

```bash
# 检查是否从源服务器获取（而不是缓存）
curl -I https://promptvalar.com/pricing | grep -i "cf-cache-status"
```

**期望结果：**
- `CF-Cache-Status: MISS` → 第一次请求，从源服务器获取 ✅
- `CF-Cache-Status: DYNAMIC` → 动态内容，不缓存 ✅
- `CF-Cache-Status: HIT` → 从缓存获取 ⚠️ 需要再次清除

### 2. 在浏览器中验证

1. **清除浏览器缓存**
   - Chrome/Edge：`Ctrl + Shift + Delete`
   - Firefox：`Ctrl + Shift + Delete`
   - Safari：`Cmd + Option + E`

2. **硬刷新页面**
   - Windows：`Ctrl + F5` 或 `Ctrl + Shift + R`
   - Mac：`Cmd + Shift + R`

3. **检查页面内容**
   - 访问：https://promptvalar.com/pricing
   - 应该看到英文内容（不是中文）
   - Pro 卡片应该有深紫色背景，文字清晰可读

---

## 常见问题

### Q1: 清除缓存后还是看到旧版本？

**解决方法：**
1. 确认已清除 Cloudflare 缓存（方法 1）
2. 清除浏览器缓存（`Ctrl + Shift + Delete`）
3. 使用隐私/无痕模式打开页面
4. 尝试其他浏览器或设备

### Q2: 需要多长时间生效？

**答案：**
- Cloudflare 缓存清除：30 秒 - 2 分钟
- 全球 CDN 节点更新：2 - 5 分钟
- 建议等待 5 分钟后测试

### Q3: 会影响网站性能吗？

**答案：**
- 短期：清除后第一批访问者可能稍慢（从源服务器获取）
- 长期：无影响，Cloudflare 会重新缓存热门内容
- 影响持续时间：约 5-10 分钟

### Q4: 需要多频繁清除缓存？

**答案：**
- 只在更新网站内容后清除
- 由于使用文件哈希（如 `index-CY2xuj81.js`），大多数更新会自动生效
- 主要需要清除的是 HTML 文件和动态路由

---

## 自动化建议

### 在部署脚本中添加

在 `/root/promptvalar/scripts/deploy/deploy-to-production.sh` 末尾添加：

```bash
# 清除 Cloudflare 缓存
echo ""
echo -e "${YELLOW}清除 Cloudflare 缓存...${NC}"

if [ -n "$CLOUDFLARE_ZONE_ID" ] && [ -n "$CLOUDFLARE_API_TOKEN" ]; then
    PURGE_RESPONSE=$(curl -s -X POST \
        "https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_ZONE_ID/purge_cache" \
        -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
        -H "Content-Type: application/json" \
        --data '{"purge_everything":true}')
    
    if echo "$PURGE_RESPONSE" | grep -q '"success":true'; then
        echo -e "  ${GREEN}✓ Cloudflare 缓存已清除${NC}"
    else
        echo -e "  ${RED}❌ Cloudflare 缓存清除失败${NC}"
        echo "  响应：$PURGE_RESPONSE"
    fi
else
    echo -e "  ${YELLOW}⚠️  请手动清除 Cloudflare 缓存${NC}"
    echo "  访问：https://dash.cloudflare.com"
fi
```

### 设置环境变量

在服务器上设置：

```bash
# 编辑环境变量文件
sudo nano /etc/environment

# 添加以下内容
CLOUDFLARE_ZONE_ID=your_zone_id
CLOUDFLARE_API_TOKEN=your_api_token

# 重新加载
source /etc/environment
```

---

## 快速命令（复制粘贴）

### 快速清除所有缓存（需要先设置环境变量）

```bash
curl -X POST "https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_ZONE_ID/purge_cache" \
     -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
     -H "Content-Type: application/json" \
     --data '{"purge_everything":true}'
```

### 验证清除成功

```bash
curl -I https://promptvalar.com/pricing | grep -E "(CF-Cache-Status|CF-RAY)"
```

---

## 联系支持

如果遇到问题：
- Cloudflare 支持：https://support.cloudflare.com
- Cloudflare 社区：https://community.cloudflare.com
- Cloudflare API 文档：https://developers.cloudflare.com/api

---

**最后更新：** 2025-10-30  
**相关文档：** `部署报告_Pricing页面英文优化和对比度优化_20251030.md`

