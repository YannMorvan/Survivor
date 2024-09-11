#!/bin/bash

echo "$(date +"%Y-%m-%d %H:%M:%S") [Database backup]: Start database backup"
DATE=$(date +\%Y_\%m_\%d_\%H_\%M_\%S)
(echo "SET FOREIGN_KEY_CHECKS=0;"; mysqldump --no-create-info "${MYSQL_DATABASE}"; echo "SET FOREIGN_KEY_CHECKS=1;") > /db-backup/backup_$DATE.sql
echo "$(date +"%Y-%m-%d %H:%M:%S") [Database backup]: Database backup done"
