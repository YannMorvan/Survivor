#!/bin/bash

echo "$(date +"%Y-%m-%d %H:%M:%S") [Update database]: Start update data"


pipe_login=$(mktemp -u)
pipe_tips=$(mktemp -u)
pipe_employees=$(mktemp -u)
pipe_customers=$(mktemp -u)
pipe_events=$(mktemp -u)
pipe_clothes=$(mktemp -u)
pipe_encounters=$(mktemp -u)

mkfifo $pipe_login
mkfifo $pipe_tips
mkfifo $pipe_employees
mkfifo $pipe_customers
mkfifo $pipe_events
mkfifo $pipe_clothes
mkfifo $pipe_encounters


php /usr/local/bin/update-data/login.php > $pipe_login &
pid_login=$!

output_login=$(cat $pipe_login)
wait $pid_login


login_status=$(echo $output_login | jq -r ".status")

if [ "$login_status" = "false" ]; then
    echo "$(date +"%Y-%m-%d %H:%M:%S") [Update database]: $output_login"
    echo "$(date +"%Y-%m-%d %H:%M:%S") [Update database]: Update data failed"
    rm -f $pipe_login $pipe_tips $pipe_employees $pipe_customers $pipe_events $pipe_clothes $pipe_encounters
    exit 1
fi

token=$(echo $output_login | jq -r ".token")


php /usr/local/bin/update-data/update-tips.php token=$token > $pipe_tips &


php /usr/local/bin/update-data/update-employees.php token=$token > $pipe_employees &
pid_employees=$!

output_2=$(cat $pipe_employees)
wait $pid_employees
echo "$(date +"%Y-%m-%d %H:%M:%S") [Update database]: $output_2"


php /usr/local/bin/update-data/update-customers.php token=$token > $pipe_customers &
pid_customers=$!


php /usr/local/bin/update-data/update-events.php token=$token > $pipe_events &


output_3=$(cat $pipe_customers)
wait $pid_customers
echo "$(date +"%Y-%m-%d %H:%M:%S") [Update database]: $output_3"


php /usr/local/bin/update-data/update-clothes.php token=$token > $pipe_clothes &


php /usr/local/bin/update-data/update-encounters.php token=$token > $pipe_encounters &


output_1=$(cat $pipe_tips)
output_4=$(cat $pipe_events)
output_5=$(cat $pipe_clothes)
output_6=$(cat $pipe_encounters)

echo "$(date +"%Y-%m-%d %H:%M:%S") [Update database]: $output_1"
echo "$(date +"%Y-%m-%d %H:%M:%S") [Update database]: $output_4"
echo "$(date +"%Y-%m-%d %H:%M:%S") [Update database]: $output_5"
echo "$(date +"%Y-%m-%d %H:%M:%S") [Update database]: $output_6"


echo "$(date +"%Y-%m-%d %H:%M:%S") [Update database]: Update data done"


rm -f $pipe_login $pipe_tips $pipe_employees $pipe_customers $pipe_events $pipe_clothes $pipe_encounters
