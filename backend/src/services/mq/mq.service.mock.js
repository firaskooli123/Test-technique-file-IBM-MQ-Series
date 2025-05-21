const logger = require('../logger/logger.service');

class MockMQService {
  constructor() {
    this.queues = {};
    this.connection = true;
  }

  async connect() {
    logger.info('Connexion MQ simulée établie avec succès');
    return true;
  }

  async openQueue(queueName) {
    if (!this.queues[queueName]) {
      this.queues[queueName] = [];
    }
    logger.info(`File d'attente simulée ${queueName} ouverte avec succès`);
    return true;
  }

  async sendMessage(queueName, message) {
    if (!this.queues[queueName]) {
      await this.openQueue(queueName);
    }
    this.queues[queueName].push(message);
    logger.info(`Message simulé envoyé avec succès à la file ${queueName}`);
    return true;
  }

  async receiveMessage(queueName) {
    if (!this.queues[queueName]) {
      await this.openQueue(queueName);
    }
    const message = this.queues[queueName].shift();
    if (message) {
      logger.info(`Message simulé reçu avec succès de la file ${queueName}`);
      return message;
    }
    logger.warn(`Aucun message simulé disponible dans la file ${queueName}`);
    return null;
  }

  async readMessages(queueName) {
    logger.info(`Lecture simulée des messages de la file ${queueName}`);
    while (true) {
      const message = await this.receiveMessage(queueName);
      if (message) {
        logger.info(`Message simulé lu de la file ${queueName}:`, message);
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  async closeQueue(queueName) {
    if (this.queues[queueName]) {
      delete this.queues[queueName];
      logger.info(`File d'attente simulée ${queueName} fermée avec succès`);
    }
  }

  async disconnect() {
    this.queues = {};
    this.connection = null;
    logger.info('Déconnexion MQ simulée effectuée avec succès');
  }
}

module.exports = new MockMQService(); 