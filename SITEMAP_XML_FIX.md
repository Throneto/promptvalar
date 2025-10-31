# Sitemap.xml 修复指南

## 问题描述

Google Search Console 显示 sitemap.xml 为 HTML 网页，而不是 XML 格式。这是因为 Nginx 的 SPA 路由配置将所有请求回退到 `index.html`。

## 解决方案

已更新 Nginx 配置，在 SPA 路由之前添加了 XML 文件的特定处理规则。

## 修复步骤

### 方法 1：使用修复脚本（推荐）

```bash
# 1. 进入项目目录
cd /var/www/promptvalar

# 2. 运行修复脚本
sudo bash deployment/fix-sitemap-xml.sh
```

### 方法 2：手动更新 Nginx 配置

1. **编辑 Nginx 配置文件**：
   ```bash
   sudo nano /etc/nginx/sites-available/promptvalar
   ```

2. **在前端服务器块中，在 SPA 路由（`location /`）之前添加以下配置**：
   ```nginx
   # XML 文件（sitemap.xml 等）- 必须在 SPA 路由之前
   location ~* \.(xml)$ {
       try_files $uri =404;
       add_header Content-Type "application/xml; charset=utf-8";
       expires 1d;
       add_header Cache-Control "public";
       access_log off;
   }
   
   # sitemap.xml - 显式处理，确保返回 XML
   location = /sitemap.xml {
       try_files $uri =404;
       add_header Content-Type "application/xml; charset=utf-8";
       expires 1d;
       add_header Cache-Control "public";
       access_log off;
   }
   
   # robots.txt - 确保正确 Content-Type
   location = /robots.txt {
       try_files $uri =404;
       add_header Content-Type "text/plain; charset=utf-8";
       expires 1d;
       add_header Cache-Control "public";
       access_log off;
       log_not_found off;
   }
   ```

3. **确保 SPA 路由在最后**：
   ```nginx
   # SPA 路由支持 - 放在最后，作为回退
   location / {
       try_files $uri $uri/ /index.html;
   }
   ```

4. **测试配置**：
   ```bash
   sudo nginx -t
   ```

5. **重新加载 Nginx**：
   ```bash
   sudo systemctl reload nginx
   ```

### 方法 3：复制项目配置模板

如果使用项目中的配置模板：

```bash
# 复制更新后的配置模板到 Nginx
sudo cp /var/www/promptvalar/nginx-config/promptvalar-nginx.conf /etc/nginx/sites-available/promptvalar

# 测试并重新加载
sudo nginx -t && sudo systemctl reload nginx
```

## 验证修复

### 1. 检查 sitemap.xml 响应头

```bash
curl -I https://promptvalar.com/sitemap.xml
```

应该看到：
```
Content-Type: application/xml; charset=utf-8
```

而不是：
```
Content-Type: text/html
```

### 2. 检查 sitemap.xml 内容

```bash
curl https://promptvalar.com/sitemap.xml
```

应该返回 XML 内容，而不是 HTML。

### 3. 在浏览器中验证

访问 `https://promptvalar.com/sitemap.xml`，应该显示 XML 内容。

### 4. 使用 Google Search Console 工具验证

1. 登录 Google Search Console
2. 进入 Sitemaps 部分
3. 测试 sitemap.xml URL
4. 应该显示为有效的 XML 格式

## 确保文件存在

确保 `sitemap.xml` 在构建目录中：

```bash
# 检查文件是否存在
ls -la /var/www/promptvalar/frontend/dist/sitemap.xml

# 如果不存在，从前端 public 目录复制
cp /var/www/promptvalar/frontend/public/sitemap.xml /var/www/promptvalar/frontend/dist/sitemap.xml

# 设置正确的权限
sudo chown promptvalar:promptvalar /var/www/promptvalar/frontend/dist/sitemap.xml
```

## Vite 构建说明

Vite 会自动将 `public/` 目录中的文件复制到 `dist/` 目录。确保：

1. `sitemap.xml` 存在于 `frontend/public/sitemap.xml`
2. 运行 `npm run build` 后，文件会自动复制到 `dist/sitemap.xml`

## 常见问题

### Q: 修复后仍然显示 HTML？

**A:** 检查以下几点：
1. Nginx 配置是否已重新加载：`sudo systemctl reload nginx`
2. 浏览器缓存：清除缓存或使用无痕模式
3. CDN/代理缓存：如果使用了 Cloudflare 等 CDN，清除其缓存
4. 文件是否存在：确认 `dist/sitemap.xml` 文件存在

### Q: 404 错误？

**A:** 确保 `sitemap.xml` 文件在构建目录中：
```bash
# 检查文件
ls -la /var/www/promptvalar/frontend/dist/sitemap.xml

# 如果不存在，重新构建前端
cd /var/www/promptvalar/frontend
sudo -u promptvalar npm run build
```

### Q: Content-Type 仍然不正确？

**A:** 检查 Nginx 配置中 location 块的顺序。XML 文件的处理必须在 SPA 路由之前。

## 完成后的操作

修复完成后：

1. ✅ 验证 sitemap.xml 返回正确的 Content-Type
2. ✅ 在 Google Search Console 中重新提交 sitemap
3. ✅ 等待 Google 重新抓取（可能需要几天）
4. ✅ 定期更新 sitemap.xml 中的 `lastmod` 日期

## 参考

- [Google Search Console Sitemap 指南](https://support.google.com/webmasters/answer/156184)
- [Nginx Location 优先级](https://nginx.org/en/docs/http/ngx_http_core_module.html#location)

