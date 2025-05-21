const mqService = require('../mq/mq.service');
const logger = require('../logger/logger.service');
const messageRepository = require('../../repositories/message.repository');

class MessageService {
  async createMessage(messageData) {
    try {
      if (!this.validateMessage(messageData)) {
        throw new Error('Message invalide');
      }

      const formattedMessage = this.formatMessage(messageData);
      const savedMessage = await messageRepository.create({
        content: formattedMessage.content,
        partner_id: formattedMessage.partner_id
      });

      logger.info(`Message créé avec succès`);
      return savedMessage;
    } catch (error) {
      logger.error('Erreur lors de la création du message:', error);
      throw error;
    }
  }

  async getMessages(query = {}) {
    try {
      return await messageRepository.findAll(query);
    } catch (error) {
      logger.error('Erreur lors de la récupération des messages:', error);
      throw error;
    }
  }

  async getMessageById(id) {
    try {
      const message = await messageRepository.findById(id);
      if (!message) {
        throw new Error('Message non trouvé');
      }
      return message;
    } catch (error) {
      logger.error(`Erreur lors de la récupération du message ${id}:`, error);
      throw error;
    }
  }

  async sendMessage(messageData) {
    try {
      if (!this.validateMessage(messageData)) {
        throw new Error('Message invalide');
      }

      const formattedMessage = this.formatMessage(messageData);
      await mqService.sendMessage(messageData.queueName, formattedMessage);
      
      const savedMessage = await messageRepository.create({
        content: messageData.content,
        partner_id: messageData.partner_id,
        queue_name: messageData.queueName,
        status: 'pending'
      });

      logger.info(`Message envoyé avec succès à la file ${messageData.queueName}`);
      return savedMessage;
    } catch (error) {
      logger.error('Erreur lors de l\'envoi du message:', error);
      throw error;
    }
  }

  async updateMessage(id, messageData) {
    try {
      const existingMessage = await messageRepository.findById(id);
      if (!existingMessage) {
        throw new Error('Message non trouvé');
      }

      const updatedData = {
        content: messageData.content || existingMessage.content,
        partner_id: messageData.partner_id || existingMessage.partner_id,
        status: messageData.status || existingMessage.status
      };

      const updatedMessage = await messageRepository.update(id, updatedData);
      logger.info(`Message ${id} mis à jour avec succès`);
      return updatedMessage;
    } catch (error) {
      logger.error(`Erreur lors de la mise à jour du message ${id}:`, error);
      throw error;
    }
  }

  async deleteMessage(id) {
    try {
      const message = await messageRepository.findById(id);
      if (!message) {
        throw new Error('Message non trouvé');
      }

      const deleted = await messageRepository.delete(id);
      logger.info(`Message ${id} supprimé avec succès`);
      return deleted;
    } catch (error) {
      logger.error(`Erreur lors de la suppression du message ${id}:`, error);
      throw error;
    }
  }

  async receiveMessage(queueName) {
    try {
      const message = await mqService.receiveMessage(queueName);
      if (message) {
        const formattedMessage = this.formatMessage(message);
        const savedMessage = await messageRepository.create({
          content: formattedMessage.content,
          partner_id: formattedMessage.partner_id,
          queue_name: queueName,
          status: 'received'
        });
        logger.info(`Message reçu avec succès de la file ${queueName}`);
        return savedMessage;
      }
      return null;
    } catch (error) {
      logger.error('Erreur lors de la réception du message:', error);
      throw error;
    }
  }

  async updateMessageStatus(id, status) {
    try {
      const message = await messageRepository.findById(id);
      if (!message) {
        throw new Error('Message non trouvé');
      }

      const updatedMessage = await messageRepository.update(id, { status });
      logger.info(`Statut du message ${id} mis à jour avec succès: ${status}`);
      return updatedMessage;
    } catch (error) {
      logger.error(`Erreur lors de la mise à jour du statut du message ${id}:`, error);
      throw error;
    }
  }

  validateMessage(message) {
    if (!message || typeof message !== 'object') {
      return false;
    }

    const requiredFields = ['content', 'partner_id'];
    return requiredFields.every(field => {
      if (field === 'partner_id') {
        return message[field] && !isNaN(parseInt(message[field]));
      }
      return message[field] && typeof message[field] === 'string';
    });
  }

  formatMessage(message) {
    return {
      id: Date.now().toString(),
      content: message.content,
      partner_id: message.partner_id,
      timestamp: message.timestamp || new Date().toISOString()
    };
  }
}

module.exports = new MessageService(); 