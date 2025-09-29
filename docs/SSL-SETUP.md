# Configuration SSL/HTTPS avec Let's Encrypt

Ce guide explique comment configurer automatiquement SSL/HTTPS pour GreenRoots avec certbot et Let's Encrypt.

## 🔒 Fonctionnalités

- **HTTPS automatique** avec certificats Let's Encrypt
- **Renouvellement automatique** des certificats (tous les 12h)
- **Redirection HTTP vers HTTPS** automatique
- **Headers de sécurité** modernes
- **Configuration SSL** conforme aux standards actuels

## 🚀 Déploiement automatique

### Via GitHub Actions (Recommandé)

Le workflow GitHub Actions configure automatiquement SSL lors du premier déploiement :

1. **Push sur la branche main** → Déploiement automatique
2. **Détection** : Si pas de certificats SSL → Lancement de `init-letsencrypt.sh`
3. **Configuration SSL** : Génération des certificats Let's Encrypt
4. **Activation HTTPS** : Redirection automatique HTTP → HTTPS

### Manuellement sur le serveur

Si vous préférez configurer SSL manuellement :

```bash
cd /path/to/greenroots

# Première fois uniquement
./init-letsencrypt.sh

# Démarrer tous les services
docker compose -f docker-compose.prod.yml up -d
```

## 🔧 Configuration

### Domaines supportés
- `greenroots.website` (principal)
- `www.greenroots.website` (alias)

### Ports utilisés
- **Port 80** : HTTP (redirection vers HTTPS)
- **Port 443** : HTTPS (application)

### Services Docker
- **nginx** : Reverse proxy avec SSL termination
- **certbot** : Gestion automatique des certificats
- **frontend** : Application React (port 3000 interne)
- **backend** : API Node.js (port 3001 interne)
- **database** : PostgreSQL (port 5432 interne, 5433 externe)

## 🔄 Renouvellement automatique

Les certificats sont automatiquement renouvelés :
- **Certbot** vérifie tous les 12h si renouvellement nécessaire
- **Nginx** recharge sa configuration toutes les 6h
- **Certificats valides 90 jours** (renouvellement à 30 jours)

## 🌐 Accès

Une fois configuré :
- **Application** : https://greenroots.website
- **API** : https://greenroots.website/api
- **Redirection automatique** : http://greenroots.website → https://greenroots.website

## 🛠️ Dépannage

### Vérifier les certificats
```bash
# Status des conteneurs
docker compose -f docker-compose.prod.yml ps

# Logs certbot
docker compose -f docker-compose.prod.yml logs certbot

# Vérifier les certificats
sudo docker compose -f docker-compose.prod.yml exec certbot ls -la /etc/letsencrypt/live/
```

### Renouvellement manuel forcé
```bash
# Forcer le renouvellement
docker compose -f docker-compose.prod.yml run --rm certbot certbot renew --force-renewal

# Recharger nginx
docker compose -f docker-compose.prod.yml exec nginx nginx -s reload
```

### Problèmes courants

**Erreur "certificate not found"**
- Vérifiez que le domaine pointe vers votre serveur
- Lancez manuellement `./init-letsencrypt.sh`

**Nginx ne démarre pas**
- Vérifiez que les ports 80 et 443 sont libres
- Consultez : `docker compose -f docker-compose.prod.yml logs nginx`

**Rate limit Let's Encrypt**
- Let's Encrypt limite à 5 tentatives par semaine par domaine
- Utilisez leur staging environment pour les tests

## 📋 Headers de sécurité inclus

- **HSTS** : Force HTTPS pendant 1 an
- **X-Content-Type-Options** : Empêche le MIME sniffing
- **X-Frame-Options** : Protection contre le clickjacking
- **X-XSS-Protection** : Protection XSS basique
- **Referrer-Policy** : Contrôle des referrers

## ✅ Test SSL

Testez votre configuration SSL :
- [SSL Labs Test](https://www.ssllabs.com/ssltest/) → Note A/A+
- [Mozilla SSL Configuration Generator](https://ssl-config.mozilla.org/)

---

**🎉 SSL configuré !** Votre application est maintenant sécurisée avec HTTPS automatique.
