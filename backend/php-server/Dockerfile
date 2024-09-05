FROM php:8.1-apache

RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

RUN docker-php-ext-install pdo pdo_mysql && docker-php-ext-enable pdo_mysql

EXPOSE 80

CMD ["apache2-foreground"]
