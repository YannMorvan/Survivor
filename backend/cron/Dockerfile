FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
    cron \
    mysql-client \
    jq \
    php \
    php-cli \
    php-curl \
    php-pdo \
    php-mysql \
    && apt-get clean

COPY crontab /etc/cron.d/crontab
RUN chmod 0644 /etc/cron.d/crontab

COPY db-backup.sh /usr/local/bin/db-backup.sh
RUN chmod +x /usr/local/bin/db-backup.sh

COPY restore-db.sh /usr/local/bin/restore-db.sh
RUN chmod +x /usr/local/bin/restore-db.sh

COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

COPY update-data.sh /usr/local/bin/update-data.sh
RUN chmod +x /usr/local/bin/update-data.sh

COPY delete-data.sh /usr/local/bin/delete-data.sh
RUN chmod +x /usr/local/bin/delete-data.sh

COPY src/ /usr/local/php-scripts/src/

ENTRYPOINT [ "/usr/local/bin/entrypoint.sh" ]
