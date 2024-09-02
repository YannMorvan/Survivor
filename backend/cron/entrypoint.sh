#!/bin/bash

LOG_DIR=/var/log/cron
LOG_FILE=$LOG_DIR/cron.log

if [ ! -d $LOG_DIR ]; then
    mkdir -p $LOG_DIR
    echo "$(date +"%Y-%m-%d %H:%M:%S") [Entrypoint]: Created log directory $LOG_DIR"
fi

if [ -f $LOG_FILE ]; then
    DATETIME=$(head -n 1 $LOG_FILE)
    mv $LOG_FILE $LOG_DIR/cron_$DATETIME.log
    echo "$(date +"%Y-%m-%d %H:%M:%S") [Entrypoint]: Moved last log file to $LOG_DIR/cron_$DATETIME.log"
fi

touch $LOG_FILE
echo "$(date +"%Y-%m-%d %H:%M:%S") [Entrypoint]: Created log file $LOG_FILE"

echo $(date +"%Y_%m_%d_%H_%M_%S") > $LOG_FILE

rm -f /root/.my.cnf
echo "[client]" > /root/.my.cnf
echo "host=db" >> /root/.my.cnf
echo "user=root" >> /root/.my.cnf
echo "password=$MYSQL_ROOT_PASSWORD" >> /root/.my.cnf

echo "$(date +"%Y-%m-%d %H:%M:%S") [Entrypoint]: Created MySQL configuration file"

echo "$(date +"%Y-%m-%d %H:%M:%S") [Entrypoint]: Starting cron service"
exec cron -f
