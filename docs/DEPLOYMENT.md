# Déploiement GreenRoots avec GitHub Actions

Ce guide explique comment déployer l'application GreenRoots automatiquement via GitHub Actions avec Docker et nginx comme reverse proxy.

## 📋 Prérequis

### Sur le serveur de production :
- Ubuntu/Debian avec Docker et Docker Compose v2 installés
- Accès SSH configuré
- Git installé
- Port 80 (HTTP) ouvert
- Optionnel : Port 443 (HTTPS) pour certbot/Let's Encrypt

### Sur GitHub :
- Repository avec les bonnes permissions
- Secrets configurés (voir ci-dessous)

## 🚀 Configuration du déploiement

### 1. Cloner le repository sur le serveur

Connectez-vous à votre serveur et clonez le repository :

```bash
cd /home/ubuntu  # ou le dossier de votre choix
git clone https://github.com/votre-username/greenroots.git
cd greenroots
```

### 2. Configurer l'accès SSH pour GitHub Actions

#### Génération des clés SSH
1. **Sur votre machine locale**, générez une paire de clés SSH dédiée pour GitHub Actions :
   ```bash
   ssh-keygen -t rsa -b 4096 -C "votre-email@example.com" -f ~/.ssh/github_actions
   ```
   
   ⚠️ **IMPORTANT** : Quand la commande demande une passphrase :
   - **Laissez vide** (ne tapez rien)
   - **Appuyez sur Entrée** deux fois (pour confirmer l'absence de passphrase)
   - GitHub Actions ne peut pas utiliser de clés avec passphrase
   
   - Cela crée deux fichiers : `github_actions` (clé privée) et `github_actions.pub` (clé publique)

2. **Installez la clé publique sur le serveur** :
   ```bash
   # Copiez la clé publique vers le serveur
   ssh-copy-id -i ~/.ssh/github_actions.pub username@votre-serveur
   
   # Ou manuellement :
   cat ~/.ssh/github_actions.pub | ssh username@votre-serveur "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
   ```

3. **Testez la connexion** :
   ```bash
   ssh -i ~/.ssh/github_actions username@votre-serveur
   ```

#### Configuration des secrets GitHub
Allez dans `Settings > Secrets and variables > Actions` de votre repository GitHub et ajoutez ces secrets :

#### 🔐 Secrets SSH (Obligatoires)

| Secret | Description | Où le trouver |
|--------|-------------|---------------|
| `HOST` | Adresse IP ou domaine du serveur | IP publique ou votre domaine |
| `USERNAME` | Utilisateur SSH | `ubuntu`, `root`, etc. |
| `PRIVATE_KEY` | **Clé SSH privée complète** | Contenu de `~/.ssh/github_actions` |
| `PORT` | Port SSH | `22` (par défaut) |

⚠️ **Important pour `PRIVATE_KEY`** :
- Copiez **tout** le contenu du fichier `~/.ssh/github_actions` (clé privée)
- Incluez les lignes `-----BEGIN OPENSSH PRIVATE KEY-----` et `-----END OPENSSH PRIVATE KEY-----`
- Ne partagez jamais cette clé privée ailleurs

#### 🗄️ Secrets Base de Données (Obligatoires)

| Secret | Description | Exemple |
|--------|-------------|---------|
| `POSTGRES_DB` | Nom de la base de données | `greenroots_prod` |
| `POSTGRES_USER` | Utilisateur PostgreSQL | `admin` |
| `POSTGRES_PASSWORD` | Mot de passe PostgreSQL | `mot_de_passe_securise` |
| `DB_USER` | Utilisateur DB pour l'app | Même valeur que `POSTGRES_USER` |
| `DB_PASSWORD` | Mot de passe DB pour l'app | Même valeur que `POSTGRES_PASSWORD` |
| `DB_NAME` | Nom de la DB pour l'app | Même valeur que `POSTGRES_DB` |
| `DB_PORT` | Port de la DB (optionnel) | `5433` (défaut si non défini) |

#### 🌐 Secrets URLs (Obligatoires)

| Secret | Description | Exemple |
|--------|-------------|---------|
| `FRONTEND_URL` | URL du frontend | `https://greenroots.website` |
| `VITE_API_URL` | **URL de l'API (OBLIGATOIRE)** | `https://greenroots.website/api` |

⚠️ **ATTENTION** : `VITE_API_URL` est **obligatoire** car certains fichiers l'utilisent en dehors du processus de build Vite (comme `cartService.ts`). Cette variable doit correspondre à votre nom de domaine suivi de `/api`.

**Exemple pour ce projet** : `https://greenroots.website/api`

#### 💳 Secrets Stripe (Obligatoires)

| Secret | Description |
|--------|-------------|
| `STRIPE_PUBLIC_KEY` | Clé publique Stripe (pk_...) |
| `STRIPE_SECRET_KEY` | Clé secrète Stripe (sk_...) |
| `STRIPE_WEBHOOK_SECRET` | Secret webhook Stripe (whsec_...) |

#### 🔒 Secrets JWT (Optionnels - utilise les valeurs par défaut sinon)

| Secret | Description | Valeur par défaut |
|--------|-------------|-------------------|
| `JWT_SECRET` | Secret pour signer les tokens JWT | Valeur du .env.example |
| `JWT_EXPIRES_IN` | Durée de validité des tokens | `7d` |
| `JWT_ISSUER` | Émetteur des tokens | `greenroots-app` |

### 3. Configurer le chemin de déploiement

Dans le fichier `.github/workflows/deploy.yml`, modifiez la ligne :

```yaml
cd /home/ubuntu/greenroots  # Remplacez par votre chemin réel
```

### 4. Configuration nginx et nom de domaine

⚠️ **Prérequis obligatoire** : Vous devez posséder un nom de domaine et le configurer pour pointer vers votre serveur.

#### Configuration DNS du domaine
1. **Obtenez votre adresse IP publique du serveur** *(à faire depuis le serveur)* :
   ```bash
   curl ifconfig.me
   ```

2. **Configurez les enregistrements DNS** chez votre registrar :
   - **Enregistrement A** : `votre-domaine.com` → `IP_DE_VOTRE_SERVEUR`
   - **Enregistrement A** : `www.votre-domaine.com` → `IP_DE_VOTRE_SERVEUR`

3. **Vérifiez la propagation DNS** (peut prendre jusqu'à 48h) :
   ```bash
   nslookup votre-domaine.com
   ```

#### Configuration nginx
Modifiez le fichier `nginx.conf` pour configurer votre nom de domaine :

```nginx
server {
    listen 80;
    server_name votre-domaine.com www.votre-domaine.com;  # Remplacez par votre domaine
    # ...
}

server {
    listen 443 ssl;
    http2 on;
    server_name votre-domaine.com www.votre-domaine.com;  # Remplacez par votre domaine
    # ...
}
```

**Points importants :**
- Remplacez `greenroots.website www.greenroots.website` par votre propre domaine
- Assurez-vous que le DNS pointe bien vers votre serveur avant le déploiement

### 5. Configuration des branches

Pour tester sur une branche spécifique, modifiez :

```yaml
on:
  push:
    branches: [ main, votre-branche ]  # Ajoutez votre branche de test
```

## 🔄 Processus de déploiement

Le workflow GitHub Actions se déclenche automatiquement lors d'un push sur les branches configurées et suit ces étapes :

### 1. **Tests** 
- Installation des dépendances backend et frontend
- Exécution des tests backend
- Build du frontend pour vérification

### 2. **Build et Push des images Docker**
- Construction des images Docker backend et frontend
- Publication sur GitHub Container Registry (GHCR)

### 3. **Déploiement sur le serveur**
- Connexion SSH au serveur
- Pull du code le plus récent
- Mise à jour du fichier `.env`
- Arrêt des services backend/frontend (préservation de la DB)
- Rebuild des images Docker
- Redémarrage de tous les services
- Nettoyage des anciennes images

## 🗃️ Gestion de la base de données

⚠️ **Important** : La base de données est préservée lors des déploiements !

- **Premier déploiement** : La DB est créée avec les scripts d'initialisation
- **Déploiements suivants** : Seuls backend et frontend sont redémarrés
- **Volume persistant** : `db_data` conserve toutes les données

## 📁 Structure des fichiers

```
greenroots/
├── .github/workflows/deploy.yml    # Workflow GitHub Actions
├── docker-compose.prod.yml         # Configuration Docker production
├── docker-compose.yml              # Configuration Docker de base
├── docker-compose.dev.yml          # Overrides développement
├── nginx.conf                      # Configuration nginx reverse proxy
├── @back/                          # Backend Node.js + TypeScript
│   └── Dockerfile
├── @front/                         # Frontend React Router SSR
│   └── Dockerfile
└── docs/DEPLOYMENT.md              # Ce fichier
```

## 🔍 Surveillance et logs

### Vérifier le statut des containers :
```bash
docker compose -f docker-compose.prod.yml ps
```

### Consulter les logs :
```bash
# Tous les services
docker compose -f docker-compose.prod.yml logs

# Backend
docker compose -f docker-compose.prod.yml logs backend

# Frontend React Router
docker compose -f docker-compose.prod.yml logs frontend

# Nginx reverse proxy
docker compose -f docker-compose.prod.yml logs nginx

# Base de données
docker compose -f docker-compose.prod.yml logs database
```

## 🛠️ Dépannage

### Erreur de connexion SSH
- Vérifiez les secrets `HOST`, `USERNAME`, `PORT`
- Testez la connexion SSH manuellement : `ssh username@host -p port`

### Erreur de clé SSH
- Copiez le contenu **complet** de votre clé privée dans `PRIVATE_KEY`
- Incluez les lignes `-----BEGIN` et `-----END`

### Problèmes Docker
- Vérifiez que Docker est installé : `docker --version`
- Vérifiez que l'utilisateur peut utiliser Docker : `docker ps`

### Base de données
- Si la DB ne démarre pas, vérifiez les variables `POSTGRES_*` et `DB_*`
- Vérifiez que le port 5432 est disponible dans le conteneur
- Pour reset complet : `docker compose -f docker-compose.prod.yml down -v`

### Nginx et routage
- L'app est accessible sur le port 80 uniquement (nginx reverse proxy)
- Frontend: `http://votre-domaine/` (React Router SSR sur port 3000 interne)
- API: `http://votre-domaine/api` (Backend sur port 3001 interne)
- DB: Port 5433 externe, 5432 interne

## 🔄 Mise à jour

Pour déployer une nouvelle version :
1. Pushez vos changements sur la branche configurée
2. GitHub Actions se déclenche automatiquement
3. Surveillez les logs dans l'onglet "Actions" du repository

### Scripts de déploiement local
```bash
# Production (uniquement docker-compose.prod.yml)
pnpm prod                    # Lancer
pnpm prod:build             # Build et lancer
pnpm prod:build:fresh       # Build propre et lancer
pnpm prod:down              # Arrêter

# Développement (docker-compose.yml + docker-compose.dev.yml)  
pnpm dev                    # Lancer
pnpm dev:build              # Build et lancer
pnpm dev:down               # Arrêter
```

## 📝 Variables d'environnement complètes

Si vous avez besoin de toutes les variables, référez-vous au fichier `.env.example` et ajoutez les secrets manquants selon vos besoins.

## 🌐 Architecture de production

```
Internet (Port 80)
       ↓
   [Nginx Proxy]
    ↙        ↘
Frontend     API Backend
(Port 3000)   (Port 3001)
              ↓
          Database
        (Port 5432)
```

**Points d'accès :**
- **Application web** : `http://your-server/`
- **API** : `http://your-server/api/*`
- **Base de données** : `your-server:5433` (accès externe)

---

**🎉 Une fois configuré, vos déploiements sont automatiques !** Chaque push déclenche le processus complet de test → build → déploiement.

**🔒 Prêt pour HTTPS** : La configuration nginx est prête pour l'ajout de certbot/Let's Encrypt.
