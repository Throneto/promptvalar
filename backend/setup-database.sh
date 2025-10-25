#!/bin/bash

# 数据库设置辅助脚本
# 用于配置环境变量和执行数据库迁移

echo "🗄️  PromptValar 数据库设置向导"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 检查 .env 文件
if [ ! -f ".env" ]; then
    echo "❌ 找不到 .env 文件"
    echo "正在从 .env.example 创建..."
    cp .env.example .env
    echo "✅ 已创建 .env 文件"
    echo ""
fi

# 检查 DATABASE_URL
DATABASE_URL=$(grep "^DATABASE_URL=" .env | cut -d '=' -f2-)

if [ -z "$DATABASE_URL" ] || [[ "$DATABASE_URL" == *"user:password"* ]]; then
    echo "⚠️  DATABASE_URL 未配置或使用默认值"
    echo ""
    echo "请输入您的数据库连接信息："
    echo ""
    
    read -p "数据库用户名 [默认: postgres]: " DB_USER
    DB_USER=${DB_USER:-postgres}
    
    read -sp "数据库密码: " DB_PASSWORD
    echo ""
    
    read -p "数据库主机 [默认: localhost]: " DB_HOST
    DB_HOST=${DB_HOST:-localhost}
    
    read -p "数据库端口 [默认: 5432]: " DB_PORT
    DB_PORT=${DB_PORT:-5432}
    
    read -p "数据库名称 [默认: promptvalar]: " DB_NAME
    DB_NAME=${DB_NAME:-promptvalar}
    
    # 构建连接字符串
    NEW_DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}"
    
    # 更新 .env 文件
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s|^DATABASE_URL=.*|DATABASE_URL=${NEW_DATABASE_URL}|" .env
    else
        # Linux
        sed -i "s|^DATABASE_URL=.*|DATABASE_URL=${NEW_DATABASE_URL}|" .env
    fi
    
    echo ""
    echo "✅ DATABASE_URL 已更新"
    DATABASE_URL=$NEW_DATABASE_URL
else
    echo "✅ 找到数据库配置"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 测试数据库连接
echo "🔍 测试数据库连接..."

if command -v psql &> /dev/null; then
    if psql "$DATABASE_URL" -c "SELECT 1;" &> /dev/null; then
        echo "✅ 数据库连接成功！"
        echo ""
        
        # 询问是否执行迁移
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo "执行数据库迁移？"
        echo ""
        echo "1) 使用 Drizzle Kit (推荐)"
        echo "2) 直接执行 SQL 脚本"
        echo "3) 跳过迁移"
        echo ""
        read -p "请选择 [1-3]: " CHOICE
        
        case $CHOICE in
            1)
                echo ""
                echo "正在执行 Drizzle Kit push..."
                npx drizzle-kit push:pg
                ;;
            2)
                echo ""
                echo "正在执行 SQL 迁移..."
                psql "$DATABASE_URL" -f migrations/add_generation_logs.sql
                ;;
            3)
                echo ""
                echo "已跳过迁移"
                ;;
            *)
                echo ""
                echo "无效的选择"
                ;;
        esac
    else
        echo "❌ 数据库连接失败！"
        echo ""
        echo "请检查："
        echo "  1. 数据库服务是否运行"
        echo "  2. 连接信息是否正确"
        echo "  3. 用户是否有权限"
        echo ""
        echo "当前连接字符串："
        echo "  ${DATABASE_URL//:*@/:***@}"  # 隐藏密码
    fi
else
    echo "⚠️  psql 命令未找到，无法测试连接"
    echo "请手动测试数据库连接"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ 设置完成！"
echo ""
echo "下一步："
echo "  npm run dev  # 启动后端服务"
echo ""

