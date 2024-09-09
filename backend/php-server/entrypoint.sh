#!/bin/bash

export FRONT_HOST=$(getent hosts nextjs-app | awk '{ print $1 }')

exec apache2-foreground
