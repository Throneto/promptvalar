#!/bin/bash

# 设置用户为管理员的脚本
# 使用方法: ./set-admin.sh <email>

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

if [ -z "$1" ]; then
    echo -e "${RED}错误: 请提供用户邮箱${NC}"
    echo "使用方法: $0 <email>"
    echo "示例: $0 admin@example.com"
    exit 1
fi

USER_EMAIL="$1"

echo -e "${YELLOW}正在设置用户为管理员...${NC}"
echo "用户邮箱: $USER_EMAIL"

# 检查用户是否存在
USER_EXISTS=$(sudo -u postgres psql -d promptvalar -t -c "SELECT COUNT(*) FROM users WHERE email = '$USER_EMAIL';")

if [ "$USER_EXISTS" -eq 0 ]; then
    echo -e "${RED}❌ 用户不存在: $USER_EMAIL${NC}"
    echo -e "${YELLOW}提示: 请先注册该账户${NC}"
    echo ""
    echo "现有用户列表："
    sudo -u postgres psql -d promptvalar -c "SELECT username, email, role FROM users;"
    exit 1
fi

# 更新用户角色为管理员
sudo -u postgres psql -d promptvalar -c "UPDATE users SET role = 'admin' WHERE email = '$USER_EMAIL';"

# 验证更新是否成功
ROLE=$(sudo -u postgres psql -d promptvalar -t -c "SELECT role FROM users WHERE email = '$USER_EMAIL';")
ROLE=$(echo $ROLE | xargs) # 去除空格

if [ "$ROLE" = "admin" ]; then
    echo -e "${GREEN}✅ 成功！用户已设置为管理员${NC}"
    echo ""
    echo "用户信息:"
    sudo -u postgres psql -d promptvalar -c "SELECT username, email, role, created_at FROM users WHERE email = '$USER_EMAIL';"
    echo ""
    echo -e "${GREEN}🎉 现在可以使用该账户登录管理后台了！${NC}"
    echo ""
    echo "📍 管理后台地址:"
    echo "  - 本地开发: http://localhost:3000/admin"
    echo "  - 生产环境: https://promptvalar.com/admin"
    echo ""
    echo "📝 下一步操作:"
    echo "  1. 访问登录页面"
    echo "  2. 使用该邮箱和密码登录"
    echo "  3. 登录后访问 /admin 路径"
else
    echo -e "${RED}❌ 设置失败${NC}"
    exit 1
fi

