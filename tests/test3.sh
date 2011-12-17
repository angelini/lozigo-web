#!bin/bash

while read line
do
  echo $line >> ../logs/log3.txt
  sleep 1
done < "/var/log/apache2/access_log"
