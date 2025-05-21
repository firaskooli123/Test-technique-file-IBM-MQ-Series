const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const logger = require('../services/logger/logger.service');

const dbPath = path.resolve(__dirname, '../dev.db');
const db = new sqlite3.Database(dbPath);

// Supprimer les tables existantes
db.serialize(() => {
  logger.info('Suppression des tables existantes...');
  
  db.run('DROP TABLE IF EXISTS messages');
  db.run('DROP TABLE IF EXISTS partners');
  db.run('DROP TABLE IF EXISTS user');

  // Recréer les tables avec le bon schéma
  logger.info('Création des nouvelles tables...');

  // Table user
  db.run(`
    CREATE TABLE user (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      email TEXT NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      logger.error('Erreur lors de la création de la table user:', err.message);
    } else {
      logger.info('Table user créée avec succès');
    }
  });

  // Table partners
  db.run(`
    CREATE TABLE partners (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      alias TEXT NOT NULL,
      type TEXT NOT NULL,
      direction TEXT NOT NULL,
      application TEXT,
      processed_flow_type TEXT,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      logger.error('Erreur lors de la création de la table partners:', err.message);
    } else {
      logger.info('Table partners créée avec succès');
      // Vérifier le schéma de la table partners
      db.get("SELECT sql FROM sqlite_master WHERE type='table' AND name='partners'", (err, row) => {
        if (err) {
          logger.error('Erreur lors de la vérification du schéma de la table partners:', err.message);
        } else {
          logger.info('Schéma de la table partners:', row.sql);
        }
      });
    }
  });

  // Table messages
  db.run(`
    CREATE TABLE messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content TEXT NOT NULL,
      partner_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (partner_id) REFERENCES partners (id)
    )
  `, (err) => {
    if (err) {
      logger.error('Erreur lors de la création de la table messages:', err.message);
    } else {
      logger.info('Table messages créée avec succès');
    }
  });

  // Vérifier que les tables ont été créées
  db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
    if (err) {
      logger.error('Erreur lors de la vérification des tables:', err.message);
    } else {
      logger.info('Tables créées:', tables.map(t => t.name).join(', '));
    }
  });
});

// Attendre un peu avant de fermer la connexion
setTimeout(() => {
  db.close((err) => {
    if (err) {
      logger.error('Erreur lors de la fermeture de la base de données:', err.message);
    } else {
      logger.info('Connexion à la base de données fermée');
    }
  });
}, 1000); 