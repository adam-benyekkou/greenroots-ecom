#!/bin/bash

# Configuration
DOMAIN="greenroots.website"
EMAIL="contact@greenroots.website" # Remplacez par votre email

echo "### Nettoyage des anciens certificats cassés..."
docker compose -f docker-compose.prod.yml exec -T certbot rm -f /etc/letsencrypt/renewal/greenroots.website.conf || true
docker compose -f docker-compose.prod.yml exec -T certbot rm -rf /etc/letsencrypt/live/greenroots.website || true
docker compose -f docker-compose.prod.yml exec -T certbot rm -rf /etc/letsencrypt/live/greenroots.website-* || true
docker compose -f docker-compose.prod.yml exec -T certbot rm -rf /etc/letsencrypt/archive/greenroots.website* || true
docker compose -f docker-compose.prod.yml exec -T certbot rm -f /etc/letsencrypt/renewal/greenroots.website-*.conf || true

echo "### Demande du certificat Let's Encrypt..."
docker compose -f docker-compose.prod.yml run --rm --entrypoint "\
  certbot certonly --webroot -w /var/www/certbot \
    --email $EMAIL \
    -d $DOMAIN \
    -d www.$DOMAIN \
    --rsa-key-size 4096 \
    --agree-tos \
    --cert-name $DOMAIN" certbot

echo "### Vérification que le certificat a été créé..."
if ! docker compose -f docker-compose.prod.yml exec -T certbot test -f "/etc/letsencrypt/live/$DOMAIN/fullchain.pem"; then
  echo "ERREUR: Le certificat Let's Encrypt n'a pas été créé !"
  echo "Logs certbot:"
  docker compose -f docker-compose.prod.yml logs certbot | tail -10
  exit 1
fi

echo "### Le workflow va redémarrer nginx avec la vraie config SSL..."

echo "### Configuration SSL terminée pour $DOMAIN !"
