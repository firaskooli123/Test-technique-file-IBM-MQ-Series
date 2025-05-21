const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userRepository = require('../../repositories/user.repository');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../../config/auth.config');
const logger = require('../../services/logger/logger.service');

// Validation functions
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^@]+\.[^@]+$/;
  return emailRegex.test(email);
};

const validateLogin = (data) => {
  const { username, password } = data;
  if (!username || !password) {
    return null;
  }
  return data;
};

// Auth functions
async function findUserByUsername(username) {
  try {
    return await userRepository.findByUsername(username);
  } catch (error) {
    logger.error(`Erreur lors de la recherche de l'utilisateur ${username}:`, error.message);
    throw error;
  }
}

async function createUser({ username, password, email }) {
  try {
    const userId = await userRepository.create({ username, password, email });
    return { id: userId, username, email };
  } catch (error) {
    logger.error('Erreur lors de la création de l\'utilisateur:', error.message);
    throw error;
  }
}

async function authenticateUser(username, password) {
  try {
    const user = await findUserByUsername(username);
    if (!user) {
      return { error: 'Identifiants invalides' };
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return { error: 'Identifiants invalides' };
    }

    return { user };
  } catch (error) {
    logger.error('Erreur lors de l\'authentification:', error.message);
    throw error;
  }
}

function generateToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

async function getUserProfile(userId) {
  try {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }
    return {
      id: user.id,
      username: user.username,
      email: user.email
    };
  } catch (error) {
    logger.error(`Erreur lors de la récupération du profil utilisateur ${userId}:`, error.message);
    throw error;
  }
}

const authService = {
  // Validation
  validateLogin,
  isValidEmail,
  // Auth
  findUserByUsername,
  createUser,
  authenticateUser,
  generateToken,
  getUserProfile
};

module.exports = { authService }; 