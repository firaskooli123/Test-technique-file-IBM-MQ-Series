require('dotenv').config();
const app = require('./app');
const logger = require('./services/logger/logger.service');
const mqService = require('./services/mq/mq.service');

const port = process.env.PORT || 3000;

// Initialisation du service MQ
mqService.connect()
  .then(() => {
    logger.info('Service MQ initialisé avec succès');
    app.listen(port, () => {
      logger.info(`Serveur démarré sur le port ${port}`);
    });
  })
  .catch((error) => {
    logger.error('Erreur lors de l\'initialisation du service MQ:', error);
    process.exit(1);
  });

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM reçu, arrêt gracieux en cours');
  await mqService.disconnect();
  process.exit(0);
}); 