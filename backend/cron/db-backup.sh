#!/bin/bash

DATE=$(date +\%F)
mysqldump "${MYSQL_DATABASE}" > /db-backup/backup_$DATE.sql
echo "$(date +"%Y-%m-%d %H:%M:%S") Database backup done"
