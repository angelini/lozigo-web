#!bin/bash

while read line
do
  echo $line >> ../logs/log1.txt
  sleep 1
done < "/var/log/install.log"
