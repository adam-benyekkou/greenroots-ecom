/**
 * Script de seeding (insertion de données de test)
 * 
 * Ce script insère des données d'exemple dans la base de données
 * pour faciliter le développement et les tests
 * 
 * Usage: pnpm db:seed
 * 
 * Prérequis: 
 * - Les tables doivent être créées (lancer pnpm db:create d'abord)
 * - Les mêmes variables d'environnement que migrate.js
 * 
 * Contenu inséré:
 * - Localisations géographiques
 * - Catalogue d'arbres
 * - Projets de plantation
 * - Associations arbres-projets
 * - Utilisateurs de test
 * - Commandes et paiements d'exemple
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
 * Fonction principale qui exécute le seeding
 * 
 * Étapes:
 * 1. Se connecte à PostgreSQL (même config que migrate.js)
 * 2. Lit le fichier SQL contenant les données d'exemple
 * 3. Exécute les INSERT pour peupler les tables
 * 4. Ferme la connexion
 * 
 * Note: Ce script peut être exécuté plusieurs fois, mais attention aux
 * contraintes d'unicité (notamment sur les emails des utilisateurs)
 */
async function runSeeding() {
  try {
    // Import dynamique du module PostgreSQL
    const pg = await import('pg');
    const { Client } = pg.default;

    // Configuration identique à migrate.js pour la cohérence
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

    // Lit le fichier SQL contenant les données d'exemple
    const sqlFilePath = join(__dirname, './sample-data.sql');
    const sql = readFileSync(sqlFilePath, 'utf8');

    console.log('🌱 Insertion des données de test...');
    // Exécute tous les INSERT en une seule transaction
    await client.query(sql);

    console.log('✅ Seeding terminé avec succès');
    console.log('📊 Vous pouvez maintenant tester l\'API avec des données réalistes');
    // Ferme proprement la connexion
    await client.end();

  } catch (error) {
    // Gestion des erreurs avec message explicite
    console.error('❌ Erreur lors du seeding:', error.message);
    console.error('💡 Vérifiez que les tables existent (pnpm db:create)');
    // Termine le processus avec un code d'erreur
    process.exit(1);
  }
}

// Lance le seeding au démarrage du script
runSeeding();
