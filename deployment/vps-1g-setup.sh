#!/bin/bash
# PromptValar - 1G VPS 优化部署脚本
# 适用于: Ubuntu 20.04/22.04, Debian 11/12
# 硬件要求: 1核1G内存20G硬盘

set -e  # 遇到错误立即退出

echo "=================================="
echo "PromptValar 1G VPS 部署脚本"
echo "=================================="
echo ""

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查是否为root用户
if [ "$EUID" -ne 0 ]; then 
  echo -e "${RED}请使用 root 用户或 sudo 运行此脚本${NC}"
  exit 1
fi

# 获取配置信息
echo -e "${YELLOW}请输入以下配置信息:${NC}"
read -p "域名 (例如: promptvalar.com): " DOMAIN
read -p "API子域名 (例如: api.promptvalar.com): " API_DOMAIN
read -sp "数据库密码: " DB_PASSWORD
echo ""
read -sp "JWT Secret (留空自动生成): " JWT_SECRET
echo ""

# 自动生成JWT密钥
if [ -z "$JWT_SECRET" ]; then
  JWT_SECRET=$(openssl rand -hex 32)
  JWT_REFRESH_SECRET=$(openssl rand -hex 32)
  echo -e "${GREEN}已自动生成JWT密钥${NC}"
else
  read -sp "JWT Refresh Secret: " JWT_REFRESH_SECRET
  echo ""
fi

read -p "GitHub仓库URL: " REPO_URL
read -p "OpenRouter API Key: " OPENROUTER_KEY

echo ""
echo -e "${GREEN}开始部署...${NC}"
echo ""

# ============================================
# 1. 系统更新和基础软件安装
# ============================================
echo -e "${YELLOW}[1/10] 更新系统和安装基础软件...${NC}"
apt update
apt upgrade -y
apt install -y curl wget git build-essential ufw fail2ban htop

# ============================================
# 2. 创建Swap分区 (2GB)
# ============================================
echo -e "${YELLOW}[2/10] 创建Swap分区...${NC}"
if [ ! -f /swapfile ]; then
  fallocate -l 2G /swapfile
  chmod 600 /swapfile
  mkswap /swapfile
  swapon /swapfile
  echo '/swapfile none swap sw 0 0' >> /etc/fstab
  
  # 优化swap使用策略
  sysctl vm.swappiness=10
  echo 'vm.swappiness=10' >> /etc/sysctl.conf
  
  echo -e "${GREEN}Swap分区创建成功${NC}"
else
  echo -e "${GREEN}Swap分区已存在${NC}"
fi

# ============================================
# 3. 安装Node.js 18
# ============================================
echo -e "${YELLOW}[3/10] 安装Node.js 18...${NC}"
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs
npm install -g npm@latest
npm install -g pm2

echo "Node.js version: $(node -v)"
echo "npm version: $(npm -v)"

# ============================================
# 4. 安装PostgreSQL 15
# ============================================
echo -e "${YELLOW}[4/10] 安装PostgreSQL 15...${NC}"
sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add -
apt update
apt install -y postgresql-15

# 启动PostgreSQL
systemctl start postgresql
systemctl enable postgresql

# 创建数据库和用户
sudo -u postgres psql -c "CREATE USER promptvalar WITH PASSWORD '$DB_PASSWORD';"
sudo -u postgres psql -c "CREATE DATABASE promptvalar OWNER promptvalar;"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE promptvalar TO promptvalar;"

# 优化PostgreSQL配置（1G内存）
cat > /etc/postgresql/15/main/conf.d/performance.conf <<EOF
# 1G内存优化配置
shared_buffers = 64MB
effective_cache_size = 256MB
maintenance_work_mem = 32MB
work_mem = 8MB
max_connections = 20
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
random_page_cost = 1.1
effective_io_concurrency = 200
EOF

systemctl restart postgresql
echo -e "${GREEN}PostgreSQL安装完成${NC}"

# ============================================
# 5. 安装Redis
# ============================================
echo -e "${YELLOW}[5/10] 安装Redis...${NC}"
apt install -y redis-server

# 优化Redis配置（64MB内存限制）
cat >> /etc/redis/redis.conf <<EOF

# 内存优化配置
maxmemory 64mb
maxmemory-policy allkeys-lru
save 900 1
save 300 10
save 60 10000
EOF

systemctl restart redis-server
systemctl enable redis-server
echo -e "${GREEN}Redis安装完成${NC}"

# ============================================
# 6. 安装Nginx
# ============================================
echo -e "${YELLOW}[6/10] 安装Nginx...${NC}"
apt install -y nginx

# 优化Nginx配置
cat > /etc/nginx/nginx.conf <<'EOF'
user www-data;
worker_processes 1;  # 单核CPU
pid /run/nginx.pid;

events {
    worker_connections 512;  # 减少连接数
    use epoll;
}

http {
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    server_tokens off;

    # Gzip压缩
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript 
               application/json application/javascript application/xml+rss 
               application/rss+xml font/truetype font/opentype 
               application/vnd.ms-fontobject image/svg+xml;

    # 缓冲区优化
    client_body_buffer_size 10K;
    client_header_buffer_size 1k;
    client_max_body_size 8m;
    large_client_header_buffers 2 1k;

    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # 日志
    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log;

    include /etc/nginx/conf.d/*.conf;
    include /etc/nginx/sites-enabled/*;
}
EOF

systemctl restart nginx
systemctl enable nginx
echo -e "${GREEN}Nginx安装完成${NC}"

# ============================================
# 7. 配置防火墙
# ============================================
echo -e "${YELLOW}[7/10] 配置防火墙...${NC}"
ufw --force enable
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw reload
echo -e "${GREEN}防火墙配置完成${NC}"

# ============================================
# 8. 克隆项目代码
# ============================================
echo -e "${YELLOW}[8/10] 克隆项目代码...${NC}"
cd /var/www
git clone "$REPO_URL" promptvalar
cd promptvalar

# 创建部署用户
if ! id -u promptvalar > /dev/null 2>&1; then
  useradd -r -s /bin/bash -d /var/www/promptvalar -m promptvalar
fi

chown -R promptvalar:promptvalar /var/www/promptvalar

# ============================================
# 9. 安装项目依赖和构建
# ============================================
echo -e "${YELLOW}[9/10] 安装依赖和构建项目...${NC}"

# 后端配置和构建
cd /var/www/promptvalar/backend
sudo -u promptvalar npm ci --only=production

# 创建环境变量文件
cat > .env <<EOF
NODE_ENV=production
PORT=5000

DATABASE_URL=postgresql://promptvalar:${DB_PASSWORD}@localhost:5432/promptvalar
REDIS_URL=redis://localhost:6379

JWT_SECRET=${JWT_SECRET}
JWT_REFRESH_SECRET=${JWT_REFRESH_SECRET}

OPENROUTER_API_KEY=${OPENROUTER_KEY}
OPENROUTER_APP_NAME=PromptValar

CORS_ORIGIN=https://${DOMAIN}
APP_URL=https://${DOMAIN}
API_URL=https://${API_DOMAIN}
EOF

chown promptvalar:promptvalar .env
chmod 600 .env

# 构建后端
sudo -u promptvalar npm run build

# 执行数据库迁移
sudo -u promptvalar npm run db:migrate

# 前端构建
cd /var/www/promptvalar/frontend
sudo -u promptvalar npm ci

# 创建前端环境变量
cat > .env.production <<EOF
VITE_API_BASE_URL=https://${API_DOMAIN}/api/v1
VITE_APP_NAME=PromptValar
VITE_APP_URL=https://${DOMAIN}
EOF

sudo -u promptvalar npm run build

echo -e "${GREEN}项目构建完成${NC}"

# ============================================
# 10. 配置PM2和Nginx
# ============================================
echo -e "${YELLOW}[10/10] 配置服务...${NC}"

# 配置PM2
cd /var/www/promptvalar/backend
sudo -u promptvalar pm2 start dist/index.js \
  --name promptvalar-backend \
  --max-memory-restart 250M \
  --node-args="--max-old-space-size=256" \
  --time

# 保存PM2配置
sudo -u promptvalar pm2 save
pm2 startup systemd -u promptvalar --hp /var/www/promptvalar

# 配置Nginx站点
cat > /etc/nginx/sites-available/promptvalar <<EOF
# 后端API
server {
    listen 80;
    server_name ${API_DOMAIN};

    # 速率限制
    limit_req_zone \$binary_remote_addr zone=api_limit:10m rate=30r/m;
    limit_req zone=api_limit burst=10 nodelay;

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
        
        # 超时设置
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}

# 前端
server {
    listen 80;
    server_name ${DOMAIN};
    root /var/www/promptvalar/frontend/dist;
    index index.html;

    # Gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript;

    # 缓存静态资源
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA路由
    location / {
        try_files \$uri \$uri/ /index.html;
    }
}
EOF

ln -sf /etc/nginx/sites-available/promptvalar /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# 测试Nginx配置
nginx -t

# 重启Nginx
systemctl restart nginx

echo ""
echo -e "${GREEN}=================================="
echo "部署完成！"
echo "==================================${NC}"
echo ""
echo "下一步："
echo "1. 配置SSL证书（推荐使用Certbot）："
echo "   apt install certbot python3-certbot-nginx"
echo "   certbot --nginx -d ${DOMAIN} -d ${API_DOMAIN}"
echo ""
echo "2. 访问您的网站："
echo "   前端: http://${DOMAIN}"
echo "   API: http://${API_DOMAIN}/health"
echo ""
echo "3. 监控命令："
echo "   pm2 monit              # 查看进程状态"
echo "   pm2 logs               # 查看日志"
echo "   htop                   # 系统资源监控"
echo "   free -h                # 内存使用"
echo ""
echo -e "${YELLOW}重要提示：请保存以下信息${NC}"
echo "数据库密码: ${DB_PASSWORD}"
echo "JWT Secret已保存在 /var/www/promptvalar/backend/.env"
echo ""

