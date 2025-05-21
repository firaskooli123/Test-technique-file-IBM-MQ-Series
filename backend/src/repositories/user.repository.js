const db = require('../database/sqlite');
const bcrypt = require('bcrypt');
const logger = require('../services/logger/logger.service');

const findByUsername = async (username) => {
  try {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM user WHERE username = ?', [username], (err, row) => {
        if (err) {
          logger.error(`Erreur lors de la récupération de l'utilisateur ${username}:`, err.message);
          return reject(err);
        }
        resolve(row);
      });
    });
  } catch (error) {
    logger.error(`Erreur dans le repository findByUsername pour ${username}:`, error.message);
    throw error;
  }
};

const findById = async (id) => {
  try {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM user WHERE id = ?', [id], (err, row) => {
        if (err) {
          logger.error(`Erreur lors de la récupération de l'utilisateur ${id}:`, err.message);
          return reject(err);
        }
        resolve(row);
      });
    });
  } catch (error) {
    logger.error(`Erreur dans le repository findById pour l'ID ${id}:`, error.message);
    throw error;
  }
};

const create = async (userData) => {
  try {
    const { username, email, password } = userData;
    const hash = await bcrypt.hash(password, 10);

    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO user (username, email, password, created_at, updated_at) VALUES (?, ?, ?, datetime("now"), datetime("now"))',
        [username, email, hash],
        function(err) {
          if (err) {
            logger.error('Erreur lors de la création de l\'utilisateur:', err.message);
            return reject(err);
          }
          resolve(this.lastID);
        }
      );
    });
  } catch (error) {
    logger.error('Erreur dans le repository create:', error.message);
    throw error;
  }
};

const update = async (id, userData) => {
  try {
    const fields = [];
    const values = [];

    if (userData.username) {
      fields.push('username = ?');
      values.push(userData.username);
    }
    if (userData.email) {
      fields.push('email = ?');
      values.push(userData.email);
    }
    if (userData.password) {
      const hash = await bcrypt.hash(userData.password, 10);
      fields.push('password = ?');
      values.push(hash);
    }

    if (fields.length === 0) {
      throw new Error('Aucune donnée à mettre à jour');
    }

    fields.push('updated_at = datetime("now")');
    values.push(id);

    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE user SET ${fields.join(', ')} WHERE id = ?`,
        values,
        function(err) {
          if (err) {
            logger.error(`Erreur lors de la mise à jour de l'utilisateur ${id}:`, err.message);
            return reject(err);
          }
          resolve(this.changes > 0);
        }
      );
    });
  } catch (error) {
    logger.error(`Erreur dans le repository update pour l'ID ${id}:`, error.message);
    throw error;
  }
};

const remove = async (id) => {
  try {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM user WHERE id = ?', [id], function(err) {
        if (err) {
          logger.error(`Erreur lors de la suppression de l'utilisateur ${id}:`, err.message);
          return reject(err);
        }
        resolve(this.changes > 0);
      });
    });
  } catch (error) {
    logger.error(`Erreur dans le repository remove pour l'ID ${id}:`, error.message);
    throw error;
  }
};

module.exports = {
  findByUsername,
  findById,
  create,
  update,
  remove
}; 