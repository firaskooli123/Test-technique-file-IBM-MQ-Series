// Configuration de l'authentification
const JWT_SECRET = process.env.JWT_SECRET || 'authorization';
const JWT_EXPIRES_IN = '24h';

module.exports = {
  JWT_SECRET,
  JWT_EXPIRES_IN
}; 