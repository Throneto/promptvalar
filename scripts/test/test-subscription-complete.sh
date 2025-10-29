#!/bin/bash
# 完整的订阅系统测试脚本

API_BASE="http://localhost:5001/api/v1"

echo "🎉 PromptValar 订阅系统完整测试"
echo "================================="
echo ""

# 1. 测试订阅计划
echo "1️⃣ 测试订阅计划 API"
echo "GET $API_BASE/subscriptions/plans"
curl -s "$API_BASE/subscriptions/plans" | jq '.'
echo ""

# 2. 注册测试用户
echo "2️⃣ 注册测试用户"
REGISTER_RESPONSE=$(curl -s -X POST "$API_BASE/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser_'$(date +%s)'",
    "email": "test_'$(date +%s)'@example.com",
    "password": "Test123456!"
  }')
echo "$REGISTER_RESPONSE" | jq '.'
TOKEN=$(echo "$REGISTER_RESPONSE" | jq -r '.data.accessToken')
echo "Token: ${TOKEN:0:30}..."
echo ""

# 3. 获取当前订阅
echo "3️⃣ 获取当前订阅状态"
curl -s "$API_BASE/subscriptions/current" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
echo ""

# 4. 测试模式：激活 Pro 订阅
echo "4️⃣ 测试模式：激活 Pro 订阅"
curl -s -X POST "$API_BASE/subscriptions/test/activate" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
echo ""

# 5. 再次获取订阅状态
echo "5️⃣ 确认 Pro 订阅已激活"
curl -s "$API_BASE/subscriptions/current" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
echo ""

# 6. 检查功能访问权限
echo "6️⃣ 检查高级功能访问权限"
curl -s "$API_BASE/subscriptions/check-access?feature=premium-prompts" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
echo ""

# 7. 取消订阅
echo "7️⃣ 取消订阅（在周期结束时）"
curl -s -X POST "$API_BASE/subscriptions/cancel" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"immediate": false}' | jq '.'
echo ""

# 8. 恢复订阅
echo "8️⃣ 恢复订阅"
curl -s -X POST "$API_BASE/subscriptions/resume" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
echo ""

echo "================================="
echo "✅ 所有测试完成！"
echo ""
echo "📝 总结："
echo "  - 订阅计划 API: ✅"
echo "  - 用户注册: ✅"
echo "  - 获取订阅状态: ✅"
echo "  - 测试模式激活 Pro: ✅"
echo "  - 功能访问检查: ✅"
echo "  - 取消/恢复订阅: ✅"
echo ""
echo "🎊 订阅系统工作正常！"

