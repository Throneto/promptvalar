# 域名更新完成报告

## 📋 更新内容

### ✅ 已完成的任务

#### 1. 域名配置更新
- **旧域名**: tablevision.top
- **新域名**: promptvalar.com
- **旧API域名**: api.tablevision.top
- **新API域名**: api.promptvalar.com

#### 2. 代码更新
- ✅ 后端CORS配置 (`backend/src/index.ts`)
- ✅ 测试脚本 (`backend/src/scripts/*.ts`)
- ✅ 前端生产环境配置 (`frontend/.env.production`)

#### 3. 脚本更新
- ✅ 生产部署脚本 (`deploy-to-production.sh`)
- ✅ 开发启动脚本 (`start-dev.sh`)
- ✅ 状态检查脚本 (`check-dev-status.sh`)
- ✅ 管理员设置脚本 (`set-admin.sh`)
- ✅ API URL修复脚本 (`deployment/fix-api-url.sh`)

#### 4. 文档更新
- ✅ DEV_ENVIRONMENT.md
- ✅ DEV_ENVIRONMENT_STATUS.md
- ✅ PRODUCTION_DEPLOYMENT_GUIDE.md
- ✅ ADMIN_ACCESS.md
- ✅ ADMIN_FIX_REPORT.md
- ✅ QUICK_ADMIN_GUIDE.md

#### 5. 构建完成
- ✅ 后端构建成功 (`backend/dist/`)
- ✅ 前端生产构建成功 (`frontend/dist/`)
  - 构建时间: $(date '+%Y-%m-%d %H:%M:%S')
  - 总大小: 673 KB (gzip: 174 KB)

#### 6. Git提交
- ✅ 所有更改已提交到Git
- 提交ID: $(git rev-parse --short HEAD)
- 提交信息: "更新生产环境域名：tablevision.top -> promptvalar.com"

---

## 🚀 生产环境部署步骤

### 方式一：使用自动部署脚本（推荐）

如果有SSH访问权限到生产服务器：

\`\`\`bash
# 1. SSH到生产服务器
ssh root@your-production-server

# 2. 进入生产目录
cd /var/www/promptvalar

# 3. 拉取最新代码
git pull origin main

# 4. 执行部署脚本
./deploy-to-production.sh
\`\`\`

### 方式二：手动部署

\`\`\`bash
# 1. SSH到生产服务器
ssh root@your-production-server

# 2. 拉取最新代码
cd /var/www/promptvalar
git pull origin main

# 3. 更新后端
cd backend
npm ci --only=production
npm run build
pm2 restart promptvalar-backend

# 4. 更新前端
cd ../frontend
npm ci
npm run build

# 5. 重启Nginx
sudo systemctl reload nginx
\`\`\`

---

## 🌐 DNS配置要求

### 必须完成的DNS设置：

1. **A记录 - 主域名**
   \`\`\`
   promptvalar.com  →  [服务器IP地址]
   \`\`\`

2. **A记录 - API子域名**
   \`\`\`
   api.promptvalar.com  →  [服务器IP地址]
   \`\`\`

### DNS传播时间
- DNS更改通常需要 5-30 分钟生效
- 可以使用 \`dig promptvalar.com\` 检查DNS是否生效

---

## 🔒 SSL证书配置

### 使用Let's Encrypt生成证书：

\`\`\`bash
# 在生产服务器上执行
sudo certbot --nginx -d promptvalar.com -d api.promptvalar.com --email your-email@example.com --agree-tos --non-interactive
\`\`\`

### 验证SSL证书：

\`\`\`bash
# 检查证书状态
sudo certbot certificates

# 测试自动续期
sudo certbot renew --dry-run
\`\`\`

---

## ✅ 部署后验证清单

### 1. 后端API验证
\`\`\`bash
curl -I https://api.promptvalar.com/health
# 应该返回 200 OK
\`\`\`

### 2. 前端访问验证
\`\`\`bash
curl -I https://promptvalar.com
# 应该返回 200 OK
\`\`\`

### 3. 浏览器测试
- [ ] 访问 https://promptvalar.com
- [ ] 清除浏览器缓存（Ctrl+Shift+Delete）
- [ ] 测试用户注册
- [ ] 测试用户登录
- [ ] 测试管理员后台（如果有管理员账户）

### 4. API连接测试
打开浏览器控制台（F12），查看：
- Network标签：确认API请求发送到 api.promptvalar.com
- Console标签：确认没有CORS错误

---

## 📝 Nginx配置参考

### 前端配置（promptvalar.com）

\`\`\`nginx
server {
    listen 80;
    listen [::]:80;
    server_name promptvalar.com;
    
    # 自动重定向到HTTPS（证书配置后）
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name promptvalar.com;
    
    # SSL证书路径（Let's Encrypt自动配置）
    ssl_certificate /etc/letsencrypt/live/promptvalar.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/promptvalar.com/privkey.pem;
    
    root /var/www/promptvalar/frontend/dist;
    index index.html;
    
    location / {
        try_files \$uri \$uri/ /index.html;
    }
}
\`\`\`

### API配置（api.promptvalar.com）

\`\`\`nginx
server {
    listen 80;
    listen [::]:80;
    server_name api.promptvalar.com;
    
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name api.promptvalar.com;
    
    ssl_certificate /etc/letsencrypt/live/api.promptvalar.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.promptvalar.com/privkey.pem;
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
\`\`\`

---

## 🔧 故障排查

### 问题1: DNS未解析

**症状**: 无法访问 promptvalar.com

**解决方案**:
\`\`\`bash
# 检查DNS解析
dig promptvalar.com
dig api.promptvalar.com

# 如果没有返回IP地址，请检查DNS配置
# 等待DNS传播（最多48小时，通常几分钟）
\`\`\`

### 问题2: SSL证书错误

**症状**: 浏览器显示"不安全"或证书错误

**解决方案**:
\`\`\`bash
# 重新生成证书
sudo certbot --nginx -d promptvalar.com -d api.promptvalar.com --force-renewal

# 检查Nginx配置
sudo nginx -t

# 重启Nginx
sudo systemctl restart nginx
\`\`\`

### 问题3: CORS错误

**症状**: 浏览器控制台显示跨域错误

**解决方案**:
- 确认后端 \`backend/src/index.ts\` 中的CORS配置包含新域名
- 确认后端已重新构建和重启
- 清除浏览器缓存

### 问题4: API连接失败

**症状**: 前端无法连接到后端

**检查步骤**:
\`\`\`bash
# 1. 检查后端服务状态
pm2 status

# 2. 查看后端日志
pm2 logs promptvalar-backend

# 3. 测试后端连接
curl http://localhost:5000/health

# 4. 检查Nginx代理配置
sudo nginx -t
\`\`\`

---

## 📞 支持联系

如有问题，请检查：
1. 后端日志: \`pm2 logs promptvalar-backend\`
2. Nginx日志: \`tail -f /var/log/nginx/error.log\`
3. 系统日志: \`journalctl -xe\`

---

**更新时间**: $(date '+%Y-%m-%d %H:%M:%S')  
**Git提交**: $(git rev-parse --short HEAD)
