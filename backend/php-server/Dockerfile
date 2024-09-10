FROM php:8.1-apache

RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

RUN docker-php-ext-install pdo pdo_mysql && docker-php-ext-enable pdo_mysql

RUN mkdir -p /var/lib/php/sessions

RUN chown -R www-data:www-data /var/lib/php/sessions && \
    chmod 700 /var/lib/php/sessions

COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

RUN export FRONT_HOST=$(getent hosts nextjs-app | awk '{ print $1 }')

EXPOSE 80

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
