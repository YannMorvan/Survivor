FROM ubuntu:22.04

RUN apt-get update && apt-get install -y \
    cron \
    mysql-client \
    && apt-get clean

COPY crontab /etc/cron.d/crontab
COPY db-backup.sh /usr/local/bin/db-backup.sh
COPY entrypoint.sh /usr/local/bin/entrypoint.sh

RUN chmod 0644 /etc/cron.d/crontab
RUN chmod +x /usr/local/bin/db-backup.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

RUN crontab /etc/cron.d/crontab

ENTRYPOINT [ "/usr/local/bin/entrypoint.sh" ]
