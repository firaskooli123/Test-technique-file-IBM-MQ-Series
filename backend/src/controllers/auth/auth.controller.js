const { authService } = require('../../services/auth/auth.service');
const logger = require('../../services/logger/logger.service');

const login = async (req, res) => {
  try {
    const validatedData = authService.validateLogin(req.body);
    if (!validatedData) {
      return res.status(400).json({ error: "Le nom d'utilisateur et le mot de passe sont requis" });
    }

    const { username, password } = validatedData;
    const result = await authService.authenticateUser(username, password);
    
    if (result.error) {
      return res.status(401).json({ error: result.error });
    }

    const { user } = result;
    const token = authService.generateToken(user);
    
    logger.info('Connexion réussie', { userId: user.id, username: user.username });
    res.json({
      message: 'Connexion réussie',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    logger.error('Erreur de connexion:', error);

  }
};

const authController = {
  login
};

module.exports = { authController }; 