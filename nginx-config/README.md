# Nginx 配置文件说明

## 📁 文件说明

- `promptvalar-nginx.conf` - 完整的 Nginx 配置文件
- 包含前端和API的完整配置
- 支持 HTTP 自动跳转 HTTPS
- 包含安全头部和性能优化

## 🚀 快速部署

### 方式一：自动脚本（推荐）

在生产服务器上执行：

```bash
cd /var/www/promptvalar
git pull origin main
sudo ./update-nginx-config.sh
```

### 方式二：手动部署

```bash
# 1. 备份现有配置
sudo cp /etc/nginx/sites-available/promptvalar /etc/nginx/sites-available/promptvalar.bak

# 2. 复制新配置
sudo cp nginx-config/promptvalar-nginx.conf /etc/nginx/sites-available/promptvalar

# 3. 测试配置
sudo nginx -t

# 4. 重新加载
sudo systemctl reload nginx
```

## 🔒 SSL 证书配置

配置完成后，安装 SSL 证书：

```bash
sudo certbot --nginx \
  -d promptvalar.com \
  -d www.promptvalar.com \
  -d api.promptvalar.com \
  --email your-email@example.com \
  --agree-tos \
  --non-interactive
```

## ✅ 验证配置

```bash
# 测试前端
curl -I https://promptvalar.com

# 测试API
curl -I https://api.promptvalar.com/health

# 查看 Nginx 状态
sudo systemctl status nginx

# 查看日志
sudo tail -f /var/log/nginx/error.log
```

## 📋 配置特性

### API 后端 (api.promptvalar.com)
- ✅ 反向代理到 localhost:5000
- ✅ WebSocket 支持
- ✅ 请求超时 60秒
- ✅ SSL/TLS 加密
- ✅ 安全头部

### 前端 (promptvalar.com)
- ✅ 静态文件服务
- ✅ SPA 路由支持
- ✅ Gzip 压缩
- ✅ 静态资源缓存（1年）
- ✅ SSL/TLS 加密
- ✅ www 重定向到主域名

## 🔧 故障排查

### 问题1: 配置测试失败

```bash
# 查看详细错误
sudo nginx -t

# 检查语法
sudo nginx -T | less
```

### 问题2: SSL 证书错误

```bash
# 检查证书
sudo certbot certificates

# 重新生成证书
sudo certbot --nginx -d promptvalar.com -d api.promptvalar.com --force-renewal
```

### 问题3: 无法访问

```bash
# 检查 Nginx 状态
sudo systemctl status nginx

# 检查防火墙
sudo ufw status

# 确保端口开放
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

## 📝 DNS 配置要求

确保以下 DNS 记录已配置：

```
promptvalar.com         A    [服务器IP]
www.promptvalar.com     A    [服务器IP]
api.promptvalar.com     A    [服务器IP]
```

可以使用以下命令验证 DNS：

```bash
dig promptvalar.com +short
dig api.promptvalar.com +short
```
