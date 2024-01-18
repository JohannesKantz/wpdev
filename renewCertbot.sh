#!/bin/bash

# add the following line to crontab
# 0 4 1 */2 * /path to renewCertbot.sh

# renew certbot certificate
docker-compose -f ./docker-compose.yaml up certbot

# reload nginx
docker-compose -f ./docker-compose.yaml exec nginx nginx -s reload