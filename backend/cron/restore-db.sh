#!/bin/bash

echo "$(date +"%Y-%m-%d %H:%M:%S") [Database restore]: Start restoring database"


BACKUP_FILES=("/db-backup/backup_*.sql")

if [ ${#BACKUP_FILES[@]} -eq 0 ]; then
  echo "No backup files found in $BACKUP_DIR"
  exit 1
fi

MOST_RECENT_FILE=$(printf "%s\n" "${BACKUP_FILES[@]}" | sort -r | head -n 1)


mysql "${MYSQL_DATABASE}" < $MOST_RECENT_FILE

echo "$(date +"%Y-%m-%d %H:%M:%S") [Database restore]: Database restored"
