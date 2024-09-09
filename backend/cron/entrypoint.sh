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


sed -i "s/^variables_order.*/variables_order = "EGPCS"/" /etc/php/8.1/cli/php.ini || echo "variables_order = \"EGPCS\"" >> /etc/php/8.1/cli/php.ini
echo "$(date +"%Y-%m-%d %H:%M:%S") [Entrypoint]: Set PHP variables_order"


CRON_TAB_FILE=/etc/cron.d/cronjobs
echo "MYSQL_ROOT_PASSWORD"=$MYSQL_ROOT_PASSWORD > $CRON_TAB_FILE
echo "MYSQL_DATABASE"=$MYSQL_DATABASE >> $CRON_TAB_FILE
echo "MYSQL_HOST"=$MYSQL_HOST >> $CRON_TAB_FILE
echo "API_KEY"=$API_KEY >> $CRON_TAB_FILE
echo "API_EMAIL"=$API_EMAIL >> $CRON_TAB_FILE
echo "API_PASSWORD"=$API_PASSWORD >> $CRON_TAB_FILE
cat /etc/cron.d/crontab >> $CRON_TAB_FILE

crontab $CRON_TAB_FILE
echo "$(date +"%Y-%m-%d %H:%M:%S") [Entrypoint]: Installed crontab with environment variables"


echo "$(date +"%Y-%m-%d %H:%M:%S") [Entrypoint]: Starting cron service"
exec cron -f
