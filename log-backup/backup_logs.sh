#!/bin/bash

LOG_DIR="/var/log/myapp"
BACKUP_DIR="/home/ubuntu/3tier-app/log-backup/backups"
DATE=$(date +%F)
ARCHIVE_NAME="myapp-logs-$DATE.tar.gz"
S3_BUCKET="s3://muthu42doc-log-backup/myapp-logs/$DATE/"

mkdir -p "$BACKUP_DIR"

if [ -d "$LOG_DIR" ] && [ "$(ls -A $LOG_DIR)" ]; then
    tar -czf "$BACKUP_DIR/$ARCHIVE_NAME" -C "$LOG_DIR" .
    aws s3 cp "$BACKUP_DIR/$ARCHIVE_NAME" "$S3_BUCKET"
    echo "$(date): Backup uploaded successfully" >> /home/ubuntu/3tier-app/log-backup/backup.log
else
    echo "$(date): No logs found to back up" >> /home/ubuntu/3tier-app/log-backup/backup.log
fi
