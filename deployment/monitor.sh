#!/bin/bash
# PromptValar - 系统监控脚本
# 检查系统资源使用情况

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "========================================"
echo "   PromptValar 系统监控报告"
echo "========================================"
echo ""

# 1. 内存使用情况
echo -e "${YELLOW}内存使用情况:${NC}"
free -h
echo ""

MEMORY_USAGE=$(free | grep Mem | awk '{print ($3/$2) * 100.0}')
MEMORY_PERCENT=$(printf "%.0f" $MEMORY_USAGE)

if [ $MEMORY_PERCENT -gt 85 ]; then
  echo -e "${RED}⚠️  内存使用率过高: ${MEMORY_PERCENT}%${NC}"
elif [ $MEMORY_PERCENT -gt 70 ]; then
  echo -e "${YELLOW}⚠️  内存使用率较高: ${MEMORY_PERCENT}%${NC}"
else
  echo -e "${GREEN}✓ 内存使用率正常: ${MEMORY_PERCENT}%${NC}"
fi
echo ""

# 2. 磁盘使用情况
echo -e "${YELLOW}磁盘使用情况:${NC}"
df -h / | tail -n 1
echo ""

DISK_USAGE=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt 85 ]; then
  echo -e "${RED}⚠️  磁盘使用率过高: ${DISK_USAGE}%${NC}"
elif [ $DISK_USAGE -gt 70 ]; then
  echo -e "${YELLOW}⚠️  磁盘使用率较高: ${DISK_USAGE}%${NC}"
else
  echo -e "${GREEN}✓ 磁盘使用率正常: ${DISK_USAGE}%${NC}"
fi
echo ""

# 3. CPU负载
echo -e "${YELLOW}CPU负载:${NC}"
uptime
echo ""

# 4. PM2进程状态
echo -e "${YELLOW}PM2进程状态:${NC}"
pm2 list
echo ""

# 5. 数据库连接数
echo -e "${YELLOW}数据库连接数:${NC}"
sudo -u postgres psql -d promptvalar -c "SELECT count(*) as connections FROM pg_stat_activity;" -t
echo ""

# 6. Redis内存使用
echo -e "${YELLOW}Redis内存使用:${NC}"
redis-cli info memory | grep used_memory_human
echo ""

# 7. Nginx状态
echo -e "${YELLOW}Nginx状态:${NC}"
systemctl is-active nginx
if systemctl is-active --quiet nginx; then
  echo -e "${GREEN}✓ Nginx运行正常${NC}"
else
  echo -e "${RED}✗ Nginx未运行${NC}"
fi
echo ""

# 8. 最近的应用日志（最后10行）
echo -e "${YELLOW}最近的应用日志:${NC}"
pm2 logs promptvalar-backend --nostream --lines 10
echo ""

# 9. 系统更新检查
echo -e "${YELLOW}系统更新检查:${NC}"
apt list --upgradable 2>/dev/null | grep -v "Listing" | head -5

echo ""
echo "========================================"
echo "监控报告完成"
echo "========================================"

