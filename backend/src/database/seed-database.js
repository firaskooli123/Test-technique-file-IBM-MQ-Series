const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const logger = require('../services/logger/logger.service');
const bcrypt = require('bcrypt');

const dbPath = path.resolve(__dirname, '../../dev.db');
const db = new sqlite3.Database(dbPath);

// Données de test pour les utilisateurs
const users = [
  {
    username: 'admin',
    email: 'admin@example.com',
    password: 'admin123'
  },
  {
    username: 'user',
    email: 'user@example.com',
    password: 'user123'
  }
];

// Données de test pour les partenaires
const partners = [
  {
    alias: 'PARTNER1',
    type: 'CLIENT',
    direction: 'INBOUND',
    application: 'APP1',
    processed_flow_type: 'MESSAGE',
    description: 'Partenaire client pour les messages entrants'
  },
  {
    alias: 'PARTNER2',
    type: 'SUPPLIER',
    direction: 'OUTBOUND',
    application: 'APP2',
    processed_flow_type: 'ALERTING',
    description: 'Partenaire fournisseur pour les alertes sortantes'
  },
  {
    alias: 'PARTNER3',
    type: 'INTERNAL',
    direction: 'BIDIRECTIONAL',
    application: 'APP3',
    processed_flow_type: 'NOTIFICATION',
    description: 'Partenaire interne pour les notifications'
  }
];

// Données de test pour les messages
const messages = [
  {
    content: 'Message test 1',
    partner_id: 1
  },
  {
    content: 'Message test 2',
    partner_id: 2
  },
  {
    content: 'Message test 3',
    partner_id: 3
  }
];

// Fonction pour insérer les utilisateurs
const insertUsers = () => {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare('INSERT INTO user (username, email, password, created_at, updated_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)');
    
    Promise.all(users.map(user => {
      return new Promise((resolveUser, rejectUser) => {
        bcrypt.hash(user.password, 10, (err, hash) => {
          if (err) {
            rejectUser(err);
            return;
          }
          stmt.run([user.username, user.email, hash], function(err) {
            if (err) {
              rejectUser(err);
              return;
            }
            logger.info(`Utilisateur créé: ${user.username}`);
            resolveUser();
          });
        });
      });
    }))
    .then(() => {
      stmt.finalize();
      resolve();
    })
    .catch(reject);
  });
};

// Fonction pour insérer les partenaires
const insertPartners = () => {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare('INSERT INTO partners (alias, type, direction, application, processed_flow_type, description, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)');
    
    Promise.all(partners.map(partner => {
      return new Promise((resolvePartner, rejectPartner) => {
        stmt.run([
          partner.alias,
          partner.type,
          partner.direction,
          partner.application,
          partner.processed_flow_type,
          partner.description
        ], function(err) {
          if (err) {
            rejectPartner(err);
            return;
          }
          logger.info(`Partenaire créé: ${partner.alias}`);
          resolvePartner();
        });
      });
    }))
    .then(() => {
      stmt.finalize();
      resolve();
    })
    .catch(reject);
  });
};

// Fonction pour insérer les messages
const insertMessages = () => {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare('INSERT INTO messages (content, partner_id, created_at, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)');
    
    Promise.all(messages.map(message => {
      return new Promise((resolveMessage, rejectMessage) => {
        stmt.run([message.content, message.partner_id], function(err) {
          if (err) {
            rejectMessage(err);
            return;
          }
          logger.info(`Message créé pour le partenaire ${message.partner_id}`);
          resolveMessage();
        });
      });
    }))
    .then(() => {
      stmt.finalize();
      resolve();
    })
    .catch(reject);
  });
};

// Exécution des insertions
db.serialize(async () => {
  try {
    logger.info('Début de l\'alimentation de la base de données...');
    
    await insertUsers();
    await insertPartners();
    await insertMessages();
    
    logger.info('Base de données alimentée avec succès !');
  } catch (error) {
    logger.error('Erreur lors de l\'alimentation de la base de données:', error.message);
  } finally {
    db.close((err) => {
      if (err) {
        logger.error('Erreur lors de la fermeture de la base de données:', err.message);
      } else {
        logger.info('Connexion à la base de données fermée');
      }
    });
  }
}); 