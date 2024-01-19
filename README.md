# WordPress Website Manger Tool

Create a WordPress Website in 30 seconds.



![Showcase](https://raw.githubusercontent.com/JohannesKantz/wpdev/main/docs/showcase.gif)


## Tech
[![Docker](https://img.shields.io/badge/-Docker-05122A?style=flat&logo=docker)](https://www.docker.com/)
[![Docker Compose](https://img.shields.io/badge/-Docker%20Compose-05122A?style=flat&logo=docker)](https://docs.docker.com/compose/)
[![Nginx](https://img.shields.io/badge/-Nginx-05122A?style=flat&logo=nginx)](https://www.nginx.com/)
[![PHP](https://img.shields.io/badge/-PHP-05122A?style=flat&logo=php)](https://www.php.net/)
[![MySQL](https://img.shields.io/badge/-MySQL-05122A?style=flat&logo=mysql)](https://www.mysql.com/)
[![WordPress](https://img.shields.io/badge/-WordPress-05122A?style=flat&logo=wordpress)](https://wordpress.org/)
[![phpMyAdmin](https://img.shields.io/badge/-phpMyAdmin-05122A?style=flat&logo=phpmyadmin)](https://www.phpmyadmin.net/)
[![Let's Encrypt](https://img.shields.io/badge/-Let's%20Encrypt-05122A?style=flat&logo=letsencrypt)](https://letsencrypt.org/)
[![Next.js](https://img.shields.io/badge/-Next.js-05122A?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/-React-05122A?style=flat&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/-TypeScript-05122A?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/-Tailwind%20CSS-05122A?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/-Prisma-05122A?style=flat&logo=prisma)](https://www.prisma.io/)


## How to set it up
in case i forget

1. Install [Docker](https://www.docker.com/products/docker-desktop) & [Docker Compose](https://docs.docker.com/compose/install/)
2. Clone this repo
3. Get a Wildcard SSL certificate
   
   or create one with 
    ```bash
    sudo apt-get install letsencrypt

    sudo certbot certonly --manual --preferred-challenges=dns --email webmaster@wpdev.website --server https://acme-v02.api.letsencrypt.org/directory --agree-tos -d wpdev.website -d *.wpdev.website
    ```
    if you have a different domain you also need to change the domain in the nginx config file

4. Generate dhparam.pem
    ```bash
    openssl dhparam -out ./etc/nginx/ssl/dhparam.pem 2048
    ```
5. Create a .env file in the root of the project
    ```bash
    cp .env.example .env
    ```
6. Run the following command to start the containers
    ```bash
    docker-compose up -d
    ```