#!/bin/sh

export NEXT_PUBLIC_PHP_HOST=$(getent hosts php-server | awk '{ print $1 }')

# exec npm run start
exec npm run dev
