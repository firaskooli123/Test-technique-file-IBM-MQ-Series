const { Sequelize } = require('sequelize');
const path = require('path');
const MessageModel = require('./Message');
const PartnerModel = require('./partner');
const logger = require('../services/logger/logger.service');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../../database.sqlite'),
  logging: (msg) => logger.debug(msg)
});

const Message = MessageModel(sequelize);
const Partner = PartnerModel(sequelize);

// Initialize associations
Message.associate({ Partner });
Partner.associate({ Message });

// Synchroniser la base de données
sequelize.sync({ force: true })
  .then(() => {
    logger.info('Base de données synchronisée');
  })
  .catch((error) => {
    logger.error('Erreur lors de la synchronisation de la base de données:', error);
  });

module.exports = {
  sequelize,
  Message,
  Partner
}; 