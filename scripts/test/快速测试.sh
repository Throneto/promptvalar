#!/bin/bash
echo "=== PromptValar 部署验证测试 ==="
echo ""

echo "1. 测试服务器文件版本："
curl -s https://promptvalar.com/index.html | grep -o "index-[^.]*\.js" | head -1

echo ""
echo "2. 测试 index.html 缓存头："
curl -I https://promptvalar.com/index.html 2>&1 | grep -i "cache-control"

echo ""
echo "3. 测试订阅API："
curl -s https://api.promptvalar.com/api/v1/subscriptions/plans | jq -r '.success'

echo ""
echo "4. 检查部署目录的文件："
ls -lh /var/www/promptvalar/frontend/dist/assets/*.js | awk '{print $9}' | xargs basename

echo ""
echo "=== 测试完成 ==="
echo ""
echo "期望结果："
echo "  - JS文件名: index-DJGI6Mt5.js"
echo "  - 缓存头: no-store, no-cache"
echo "  - API返回: true"
echo ""
echo "如果结果正确但浏览器仍显示旧版本，请清除Cloudflare缓存！"
