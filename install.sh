#!/bin/bash


# Initialize 
# Start nginx and certbot to get the certificate
docker-compose -f ./docker-compose-initiate.yml up -d web
docker-compose -f ./docker-compose-initiate.yml up certbot
docker-compose -f ./docker-compose-initiate.yml down

# generate the dhparam.pem file
openssl dhparam -out ./etc/nginx/ssl/dhparam.pem 2048


# Start the main docker-compose
docker-compose -f ./docker-compose.yml -d up