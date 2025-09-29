# GreenRoots

# Commandes Docker

Ce projet utilise Docker Compose avec différentes configurations pour les environnements de développement et de production.

## Environnement de développement

### Commandes principales
```bash
npm run dev                    # Lance l'application en mode développement
npm run dev:build             # Lance l'application en reconstruisant les images
npm run dev:build:fresh       # Reconstruit complètement (sans cache) et lance
npm run dev:down              # Arrête tous les services de développement
npm run dev:logs              # Affiche les logs en temps réel
```

## Environnement de production

### Commandes principales
```bash
npm run prod                  # Lance l'application en mode production
npm run prod:build           # Lance l'application en reconstruisant les images
npm run prod:build:fresh     # Reconstruit complètement (sans cache) et lance
npm run prod:down            # Arrête tous les services de production
```

## Gestion Docker

### Nettoyage et maintenance
```bash
npm run docker:clean         # Arrête et supprime les conteneurs, volumes et réseaux
npm run docker:reset         # Nettoyage complet + suppression des images inutilisées
npm run docker:rebuild       # Arrête et reconstruit toutes les images sans cache
```

## Services individuels

### Backend
```bash
npm run backend              # Lance uniquement le backend et la base de données
npm run backend:fresh        # Reconstruit et lance le backend avec la base de données
```

### Frontend
```bash
npm run frontend             # Lance uniquement le frontend
npm run frontend:fresh       # Reconstruit et lance le frontend
```

### Base de données
```bash
npm run database             # Lance uniquement la base de données
```

## Logs des services

### Consultation des logs
```bash
npm run logs:backend         # Affiche les logs du backend en temps réel
npm run logs:frontend        # Affiche les logs du frontend en temps réel
npm run logs:database        # Affiche les logs de la base de données en temps réel
```

## Accès aux conteneurs

### Shell interactif
```bash
npm run shell:backend        # Ouvre un shell dans le conteneur backend
npm run shell:frontend       # Ouvre un shell dans le conteneur frontend
npm run shell:database       # Ouvre un shell dans le conteneur de base de données
```

## Structure des fichiers Docker Compose

Le projet utilise une approche multi-fichiers :
- `docker-compose.yml` : Configuration de base partagée
- `docker-compose.dev.yml` : Surcharges pour le développement
- `docker-compose.prod.yml` : Surcharges pour la production

Les commandes combinent automatiquement ces fichiers selon l'environnement ciblé.