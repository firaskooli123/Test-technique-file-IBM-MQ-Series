const logger = require('../logger/logger.service');

class MockMQService {
  constructor() {
    this.queues = {};
  }

  async connect() {
    logger.info('Connexion MQ simulée établie');
    return true;
  }

  async openQueue(queueName) {
    if (!this.queues[queueName]) {
      this.queues[queueName] = [];
    }
    logger.info(`File ${queueName} ouverte`);
    return true;
  }

  async sendMessage(queueName, message) {
    if (!this.queues[queueName]) {
      await this.openQueue(queueName);
    }
    this.queues[queueName].push(message);
    logger.info(`Message envoyé à ${queueName}`);
    return true;
  }

  async receiveMessage(queueName) {
    if (!this.queues[queueName] || this.queues[queueName].length === 0) {
      return null;
    }
    const message = this.queues[queueName].shift();
    logger.info(`Message reçu de ${queueName}`);
    return message;
  }

  async closeQueue(queueName) {
    delete this.queues[queueName];
    logger.info(`File ${queueName} fermée`);
  }

  async disconnect() {
    this.queues = {};
    logger.info('Déconnexion MQ simulée');
  }
}

module.exports = new MockMQService(); 