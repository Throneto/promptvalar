#!/bin/bash

echo "========================================"
echo "PromptValar 登录功能测试脚本"
echo "========================================"
echo ""

# 检查后端服务是否运行
echo "1. 检查后端服务状态..."
if lsof -i :5000 > /dev/null 2>&1; then
  echo "✅ 后端服务正在运行（端口 5000）"
else
  echo "❌ 后端服务未运行"
  echo "请先启动后端服务："
  echo "  cd /root/promptvalar/backend"
  echo "  npm run dev"
  exit 1
fi

echo ""
echo "2. 测试本地登录 API..."
echo "----------------------------------------"

# 测试账号 1
echo "测试账号: test@example.com"
response1=$(curl -s -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123456"}')

if echo "$response1" | jq -e '.success == true' > /dev/null 2>&1; then
  echo "✅ test@example.com 登录成功"
  echo "用户角色: $(echo $response1 | jq -r '.data.user.role')"
  echo "订阅级别: $(echo $response1 | jq -r '.data.user.subscriptionTier')"
else
  echo "❌ test@example.com 登录失败"
  echo "$response1" | jq .
fi

echo ""

# 测试账号 2
echo "测试账号: test@tablevision.top"
response2=$(curl -s -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@tablevision.top","password":"Test123456"}')

if echo "$response2" | jq -e '.success == true' > /dev/null 2>&1; then
  echo "✅ test@tablevision.top 登录成功"
  echo "用户角色: $(echo $response2 | jq -r '.data.user.role')"
  echo "订阅级别: $(echo $response2 | jq -r '.data.user.subscriptionTier')"
else
  echo "❌ test@tablevision.top 登录失败"
  echo "$response2" | jq .
fi

echo ""
echo "3. 测试生产环境 API..."
echo "----------------------------------------"

# 测试生产环境
echo "测试: https://api.promptvalar.com/api/v1/auth/login"
response3=$(curl -s -k -X POST https://api.promptvalar.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@tablevision.top","password":"Test123456"}')

if echo "$response3" | jq -e '.success == true' > /dev/null 2>&1; then
  echo "✅ 生产环境 API 正常工作"
  echo "用户: $(echo $response3 | jq -r '.data.user.email')"
else
  echo "❌ 生产环境 API 失败"
  echo "$response3" | jq .
fi

echo ""
echo "========================================"
echo "测试完成！"
echo "========================================"
echo ""
echo "测试账号信息："
echo "  1. test@example.com / Test123456 (普通用户)"
echo "  2. test@tablevision.top / Test123456 (管理员)"
echo ""

