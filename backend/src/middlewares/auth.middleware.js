const jwt = require('jsonwebtoken');
const logger = require('../services/logger/logger.service');
const { JWT_SECRET } = require('../config/auth.config');

const authMiddleware = (req, res, next) => {
  try {
    // Récupérer le token du header Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      logger.warn('Tentative d\'accès sans token');
      return res.status(401).json({ message: 'Token d\'authentification manquant' });
    }

    // Vérifier le format du token (Bearer token)
    const token = authHeader.split(' ')[1];
    if (!token) {
      logger.warn('Format de token invalide');
      return res.status(401).json({ message: 'Format de token invalide' });
    }

    // Vérifier et décoder le token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Ajouter les informations de l'utilisateur à la requête
    req.user = decoded;

    next();
  } catch (error) {
    logger.error('Erreur d\'authentification:', error.message);

    // Gérer les différents types d'erreurs JWT
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Token invalide' });
    }
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: 'Token expiré' });
    }

    // Erreur par défaut
    return res.status(500).json({ message: 'Erreur lors de l\'authentification' });
  }
};

module.exports = authMiddleware; 