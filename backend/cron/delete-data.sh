#!/bin/bash

echo "$(date +"%Y-%m-%d %H:%M:%S") [Delete data]: Start delete data"


pipe_login=$(mktemp -u)
pipe_employees=$(mktemp -u)
pipe_customers=$(mktemp -u)
pipe_events=$(mktemp -u)
pipe_encounters=$(mktemp -u)

mkfifo $pipe_login
mkfifo $pipe_employees
mkfifo $pipe_customers
mkfifo $pipe_events
mkfifo $pipe_encounters


php /usr/local/php-scripts/src/login.php > $pipe_login &
pid_login=$!

output_login=$(cat $pipe_login)
wait $pid_login


login_status=$(echo $output_login | jq -r ".status")

if [ "$login_status" = "false" ]; then
    echo "$(date +"%Y-%m-%d %H:%M:%S") [Delete data]: $output_login"
    echo "$(date +"%Y-%m-%d %H:%M:%S") [Delete data]: Delete data failed"
    rm -f $pipe_login $pipe_employees $pipe_customers $pipe_events $pipe_encounters
    exit 1
fi

token=$(echo $output_login | jq -r ".token")

echo "$(date +"%Y-%m-%d %H:%M:%S") [Delete data]: $output_login"


php /usr/local/php-scripts/src/delete-data/delete-employees.php token=$token > $pipe_employees &

php /usr/local/php-scripts/src/delete-data/delete-customers.php token=$token > $pipe_customers &

php /usr/local/php-scripts/src/delete-data/delete-events.php token=$token > $pipe_events &

php /usr/local/php-scripts/src/delete-data/delete-encounters.php token=$token > $pipe_encounters &


output_1=$(cat $pipe_employees)
output_2=$(cat $pipe_customers)
output_3=$(cat $pipe_events)
output_4=$(cat $pipe_encounters)

echo "$(date +"%Y-%m-%d %H:%M:%S") [Delete data]: $output_1"
echo "$(date +"%Y-%m-%d %H:%M:%S") [Delete data]: $output_2"
echo "$(date +"%Y-%m-%d %H:%M:%S") [Delete data]: $output_3"
echo "$(date +"%Y-%m-%d %H:%M:%S") [Delete data]: $output_4"


echo "$(date +"%Y-%m-%d %H:%M:%S") [Delete data]: Delete data completed"


rm -f $pipe_login $pipe_employees $pipe_customers $pipe_events $pipe_encounters
