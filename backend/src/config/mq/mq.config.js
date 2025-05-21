// Configuration MQ
const MQ_CONFIG = {
  // Configuration de la connexion
  CONNECTION: {
    HOST: process.env.MQ_HOST || 'localhost',
    PORT: parseInt(process.env.MQ_PORT) || 1414,
    CHANNEL: process.env.MQ_CHANNEL || 'DEV.ADMIN.SVRCONN',
    NAME: process.env.MQ_QUEUE_NAME || 'QM1',
    USER: process.env.MQ_USER || 'admin',
    PASSWORD: process.env.MQ_PASSWORD || 'passw0rd'
  },

  // Configuration des files d'attente
  QUEUES: {
    REQUEST: process.env.MQ_REQUEST_QUEUE || 'DEV.QUEUE.1',
    RESPONSE: process.env.MQ_RESPONSE_QUEUE || 'DEV.QUEUE.2',
    ERROR: process.env.MQ_ERROR_QUEUE || 'DEV.QUEUE.ERROR'
  },

  // Configuration des messages
  MESSAGES: {
    MAX_SIZE: parseInt(process.env.MQ_MAX_MESSAGE_SIZE) || 1048576, // 1MB
    TIMEOUT: parseInt(process.env.MQ_TIMEOUT) || 30000, // 30 secondes
    RETRY_COUNT: parseInt(process.env.MQ_RETRY_COUNT) || 3,
    RETRY_DELAY: parseInt(process.env.MQ_RETRY_DELAY) || 1000 // 1 seconde
  },

  // Configuration des options MQ
  OPTIONS: {
    SSL: process.env.MQ_SSL === 'true',
    SSL_CIPHER: process.env.MQ_SSL_CIPHER || 'TLS_RSA_WITH_AES_128_CBC_SHA256',
    SSL_CERTIFICATE: process.env.MQ_SSL_CERTIFICATE,
    SSL_KEY: process.env.MQ_SSL_KEY,
    SSL_CA: process.env.MQ_SSL_CA
  },

  // Codes d'erreur MQ
  ERROR_CODES: {
    CONNECTION_FAILED: 'MQ_CONNECTION_FAILED',
    QUEUE_NOT_FOUND: 'MQ_QUEUE_NOT_FOUND',
    MESSAGE_TOO_LARGE: 'MQ_MESSAGE_TOO_LARGE',
    TIMEOUT: 'MQ_TIMEOUT',
    UNAUTHORIZED: 'MQ_UNAUTHORIZED',
    UNKNOWN: 'MQ_UNKNOWN_ERROR'
  },

  // Messages d'erreur
  ERROR_MESSAGES: {
    CONNECTION_FAILED: 'Échec de la connexion au gestionnaire de files d\'attente',
    QUEUE_NOT_FOUND: 'File d\'attente non trouvée',
    MESSAGE_TOO_LARGE: 'Le message dépasse la taille maximale autorisée',
    TIMEOUT: 'Délai d\'attente dépassé',
    UNAUTHORIZED: 'Non autorisé à accéder à la file d\'attente',
    UNKNOWN: 'Une erreur inconnue s\'est produite'
  }
};

module.exports = { MQ_CONFIG }; 