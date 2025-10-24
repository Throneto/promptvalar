#!/bin/bash
# PromptValar - 数据备份脚本
# 建议添加到crontab: 0 2 * * * /var/www/promptvalar/deployment/backup.sh

set -e

BACKUP_DIR="/var/backups/promptvalar"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=7  # 保留7天的备份

mkdir -p $BACKUP_DIR

echo "开始备份 - $DATE"

# 1. 备份数据库
echo "备份数据库..."
sudo -u postgres pg_dump promptvalar | gzip > "$BACKUP_DIR/db_$DATE.sql.gz"

# 2. 备份上传的文件（如果有）
if [ -d "/var/www/promptvalar/uploads" ]; then
  echo "备份上传文件..."
  tar -czf "$BACKUP_DIR/uploads_$DATE.tar.gz" /var/www/promptvalar/uploads
fi

# 3. 备份环境变量配置
echo "备份配置文件..."
cp /var/www/promptvalar/backend/.env "$BACKUP_DIR/env_$DATE"

# 4. 删除过期备份
echo "清理过期备份..."
find $BACKUP_DIR -name "db_*.sql.gz" -mtime +$RETENTION_DAYS -delete
find $BACKUP_DIR -name "uploads_*.tar.gz" -mtime +$RETENTION_DAYS -delete
find $BACKUP_DIR -name "env_*" -mtime +$RETENTION_DAYS -delete

# 5. 备份大小统计
BACKUP_SIZE=$(du -sh $BACKUP_DIR | cut -f1)
echo "备份完成！总大小: $BACKUP_SIZE"

# 6. 可选：上传到远程存储（S3/Cloudflare R2等）
# aws s3 sync $BACKUP_DIR s3://your-backup-bucket/promptvalar/

