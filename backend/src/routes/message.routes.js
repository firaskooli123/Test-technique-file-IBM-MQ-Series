const express = require('express');
const router = express.Router();
const { messageController } = require('../controllers/message/message.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const mqService = require('../services/mq/mq.service');
const logger = require('../services/logger/logger.service');

// Routes protégées par l'authentification
router.use(authMiddleware);

// Routes des messages
router.get('/', messageController.getMessages);
router.get('/:id', messageController.getMessageById);
router.put('/:id', messageController.updateMessage);
router.post('/', messageController.createMessage);
router.delete('/:id', messageController.deleteMessage);

// Route pour envoyer un message à une file spécifique
router.post('/queue/:queueName', async (req, res) => {
  try {
    const { queueName } = req.params;
    const message = req.body;
    
    await mqService.sendMessage(queueName, message);
    res.json({ status: 'success', message: 'Message envoyé avec succès' });
  } catch (error) {
    logger.error('Erreur lors de l\'envoi du message:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Route pour recevoir un message d'une file spécifique
router.get('/queue/:queueName', async (req, res) => {
  try {
    const { queueName } = req.params;
    const message = await mqService.receiveMessage(queueName);
    
    if (message) {
      res.json({ status: 'success', message });
    } else {
      res.json({ status: 'success', message: 'Aucun message disponible' });
    }
  } catch (error) {
    logger.error('Erreur lors de la réception du message:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

module.exports = router; 