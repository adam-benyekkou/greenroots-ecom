#!/bin/bash

# Configuration
DOMAIN="greenroots.cloud"
EMAIL="contact@greenroots.cloud" # Remplacez par votre email

# Chemin vers les données certbot
DATA_PATH="./data/certbot"

# Création des dossiers
mkdir -p "$DATA_PATH/conf"
mkdir -p "$DATA_PATH/www"

echo "### Arrêt de nginx si démarré..."
docker compose -f docker-compose.prod.yml down nginx 2>/dev/null

echo "### Création d'un certificat temporaire pour $DOMAIN..."
docker compose -f docker-compose.prod.yml run --rm --entrypoint "\
  openssl req -x509 -nodes -newkey rsa:4096 -days 1\
    -keyout '/etc/letsencrypt/live/$DOMAIN/privkey.pem' \
    -out '/etc/letsencrypt/live/$DOMAIN/fullchain.pem' \
    -subj '/CN=localhost'" certbot

echo "### Démarrage de nginx..."
docker compose -f docker-compose.prod.yml up --force-recreate -d nginx

echo "### Suppression du certificat temporaire..."
docker compose -f docker-compose.prod.yml run --rm --entrypoint "\
  rm -Rf /etc/letsencrypt/live/$DOMAIN && \
  rm -Rf /etc/letsencrypt/archive/$DOMAIN && \
  rm -Rf /etc/letsencrypt/renewal/$DOMAIN.conf" certbot

echo "### Demande du vrai certificat Let's Encrypt..."
docker compose -f docker-compose.prod.yml run --rm --entrypoint "\
  certbot certonly --webroot -w /var/www/certbot \
    --email $EMAIL \
    -d $DOMAIN \
    -d www.$DOMAIN \
    --rsa-key-size 4096 \
    --agree-tos \
    --force-renewal" certbot

echo "### Rechargement de nginx..."
docker compose -f docker-compose.prod.yml exec nginx nginx -s reload

echo "### Configuration SSL terminée pour $DOMAIN !"
