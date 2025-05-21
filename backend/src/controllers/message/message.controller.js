const  messageService = require('../../services/message/message.service');
const { messageValidator } = require('../../validators/message.validator');
const logger = require('../../services/logger/logger.service');

const createMessage = async (req, res) => {
  try {
    // Validation des données
    const validationResult = messageValidator.validateCreateMessage(req.body);
    if (!validationResult.isValid) {
      return res.status(400).json({ error: validationResult.errors });
    }

    // Logique métier
    const message = await messageService.createMessage(req.body);
    
    return res.status(201).json(message);
  } catch (error) {
    logger.error('Erreur lors de la création du message:', error);
    return res.status(500).json({ error: 'Erreur lors de la création du message' });
  }
};

const getMessages = async (req, res) => {
  try {
    // Validation des paramètres
    const validationResult = messageValidator.validateGetMessages(req.query);
    if (!validationResult.isValid) {
      return res.status(400).json({ message: validationResult.errors });
    }

    // Logique métier
    const messages = await messageService.getMessages(req.query);
    
    return res.json(messages);
  } catch (error) {
    logger.error('Erreur lors de la récupération des messages:', error.message);
    return res.status(500).json({ message: 'Erreur lors de la récupération des messages' });
  }
};

const getMessageById = async (req, res) => {
  try {
    // Validation des paramètres
    const validationResult = messageValidator.validateGetMessageById(req.params);
    if (!validationResult.isValid) {
      return res.status(400).json({ error: validationResult.errors });
    }

    // Logique métier
    const message = await messageService.getMessageById(req.params.id);
    if (!message) {
      return res.status(404).json({ error: 'Message non trouvé' });
    }

    return res.json(message);
  } catch (error) {
    logger.error('Erreur lors de la récupération du message:', error);
    return res.status(500).json({ error: 'Erreur lors de la récupération du message' });
  }
};

const updateMessage = async (req, res) => {
  try {
    // Validation des données
    const validationResult = messageValidator.validateUpdateMessage({
      ...req.params,
      ...req.body
    });
    if (!validationResult.isValid) {
      return res.status(400).json({ error: validationResult.errors });
    }

    // Logique métier
    const message = await messageService.updateMessage(req.params.id, req.body);
    if (!message) {
      return res.status(404).json({ error: 'Message non trouvé' });
    }

    return res.json(message);
  } catch (error) {
    logger.error('Erreur lors de la mise à jour du message:', error);
    return res.status(500).json({ error: 'Erreur lors de la mise à jour du message' });
  }
};

const deleteMessage = async (req, res) => {
  try {
    // Validation des paramètres
    const validationResult = messageValidator.validateDeleteMessage(req.params);
    if (!validationResult.isValid) {
      return res.status(400).json({ error: validationResult.errors });
    }

    // Logique métier
    const success = await messageService.deleteMessage(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Message non trouvé' });
    }

    return res.status(204).send();
  } catch (error) {
    logger.error('Erreur lors de la suppression du message:', error);
    return res.status(500).json({ error: 'Erreur lors de la suppression du message' });
  }
};

const messageController = {
  createMessage,
  getMessages,
  getMessageById,
  updateMessage,
  deleteMessage
};

module.exports = { messageController }; 