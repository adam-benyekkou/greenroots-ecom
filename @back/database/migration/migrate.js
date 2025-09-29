/**
 * Script de migration de base de données
 * 
 * Ce script crée automatiquement toutes les tables de la base de données
 * en exécutant le fichier SQL create-tables.sql
 * 
 * Usage: pnpm db:create
 * 
 * Variables d'environnement requises:
 * - POSTGRES_USER: nom d'utilisateur PostgreSQL
 * - POSTGRES_PASSWORD: mot de passe PostgreSQL  
 * - POSTGRES_DB: nom de la base de données
 * - POSTGRES_HOST: adresse du serveur (défaut: localhost)
 * - POSTGRES_PORT: port du serveur (défaut: 5432)
 */

import { config } from 'dotenv';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// Charge les variables d'environnement depuis le fichier .env
config();

// Récupère le chemin du répertoire actuel
const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Fonction principale qui exécute la migration
 * 
 * Étapes:
 * 1. Se connecte à PostgreSQL avec les credentials du .env
 * 2. Lit le fichier SQL de création des tables
 * 3. Exécute le script SQL (DROP + CREATE + INDEX)
 * 4. Ferme la connexion
 */
async function runMigration() {
  try {
    // Import dynamique du module PostgreSQL
    const pg = await import('pg');
    const { Client } = pg.default;

    // Configuration de la connexion à partir des variables d'environnement
    const client = new Client({
      user: process.env.POSTGRES_USER,
      database: process.env.POSTGRES_DB,
      host: process.env.POSTGRES_HOST || 'localhost', // Valeur par défaut
      port: parseInt(process.env.POSTGRES_PORT || '5432'), // Conversion en nombre
      password: process.env.POSTGRES_PASSWORD,
    });

    // Établit la connexion à la base de données
    await client.connect();
    console.log('✅ Connecté à la base de données');

    // Lit le fichier SQL contenant les instructions CREATE TABLE
    const sqlFilePath = join(__dirname, '../migration/create-tables.sql');
    const sql = readFileSync(sqlFilePath, 'utf8');

    console.log('🚀 Exécution du script SQL...');
    // Exécute tout le script SQL en une seule transaction
    await client.query(sql);

    console.log('✅ Migration terminée avec succès');
    // Ferme proprement la connexion
    await client.end();

  } catch (error) {
    // Gestion des erreurs avec message explicite
    console.error('❌ Erreur:', error.message);
    // Termine le processus avec un code d'erreur
    process.exit(1);
  }
}

// Lance la migration au démarrage du script
runMigration();
