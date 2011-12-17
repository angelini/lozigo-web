#!bin/bash

while read line
do
  echo $line >> ../logs/log2.txt
  sleep 1
done < "/var/log/system.log"
