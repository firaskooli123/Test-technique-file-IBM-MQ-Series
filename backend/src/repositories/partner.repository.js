const db = require('../database/sqlite');
const logger = require('../services/logger/logger.service');

const findAll = async (page = 1, limit = 10, sortBy = 'alias', sortOrder = 'ASC', filters = {}) => {
  try {
    const offset = (page - 1) * limit;
    let query = 'SELECT * FROM partners';
    const queryParams = [];

    // Ajout des filtres
    const filterConditions = [];
    if (filters.alias) {
      filterConditions.push('alias LIKE ?');
      queryParams.push(`%${filters.alias}%`);
    }
    if (filters.type) {
      filterConditions.push('type = ?');
      queryParams.push(filters.type);
    }
    if (filters.direction) {
      filterConditions.push('direction = ?');
      queryParams.push(filters.direction);
    }
    if (filters.processed_flow_type) {
      filterConditions.push('processed_flow_type = ?');
      queryParams.push(filters.processed_flow_type);
    }

    if (filterConditions.length > 0) {
      query += ' WHERE ' + filterConditions.join(' AND ');
    }

    // Ajout du tri
    query += ` ORDER BY ${sortBy} ${sortOrder}`;

    // Ajout de la pagination
    query += ' LIMIT ? OFFSET ?';
    queryParams.push(limit, offset);

    return new Promise((resolve, reject) => {
      db.all(query, queryParams, (err, rows) => {
        if (err) {
          logger.error('Erreur lors de la récupération des partenaires:', err.message);
          reject(err);
          return;
        }

        // Récupérer le nombre total de partenaires pour la pagination
        db.get('SELECT COUNT(*) as total FROM partners', (err, result) => {
          if (err) {
            logger.error('Erreur lors du comptage des partenaires:', err.message);
            reject(err);
            return;
          }

          resolve({
            data: rows,
            pagination: {
              total: result.total,
              page,
              limit,
              totalPages: Math.ceil(result.total / limit)
            }
          });
        });
      });
    });
  } catch (error) {
    logger.error('Erreur dans le repository findAll:', error.message);
    throw error;
  }
};

const findById = async (id) => {
  try {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM partners WHERE id = ?', [id], (err, row) => {
        if (err) {
          logger.error(`Erreur lors de la récupération du partenaire ${id}:`, err.message);
          reject(err);
          return;
        }
        resolve(row);
      });
    });
  } catch (error) {
    logger.error(`Erreur dans le repository findById pour l'ID ${id}:`, error.message);
    throw error;
  }
};

const findByAlias = async (alias) => {
  try {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM partners WHERE alias = ?', [alias], (err, row) => {
        if (err) {
          logger.error(`Erreur lors de la récupération du partenaire ${alias}:`, err.message);
          reject(err);
          return;
        }
        resolve(row);
      });
    });
  } catch (error) {
    logger.error(`Erreur dans le repository findByAlias pour le alias ${alias}:`, error.message);
    throw error;
  }
};

const create = async (partnerData) => {
  try {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO partners (
          alias, type, direction, application, 
          processed_flow_type, description, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `;

      const values = [
        partnerData.alias,
        partnerData.type,
        partnerData.direction,
        partnerData.application || null,
        partnerData.processed_flow_type || null,
        partnerData.description || null
      ];

      db.run(query, values, function (err) {
        if (err) {
          logger.error('Erreur lors de la création du partenaire:', err.message);
          reject(err);
          return;
        }

        // Récupérer le partenaire créé
        db.get('SELECT * FROM partners WHERE id = ?', [this.lastID], (err, partner) => {
          if (err) {
            logger.error('Erreur lors de la récupération du partenaire créé:', err.message);
            reject(err);
            return;
          }
          logger.info(`Partenaire créé avec succès: ${partner.alias}`);
          resolve(partner);
        });
      });
    });
  } catch (error) {
    logger.error('Erreur dans le repository create:', error.message);
    throw error;
  }
};

const update = async (id, partnerData) => {
  try {
    const fields = [];
    const values = [];

    // Validation des champs
    if (partnerData.alias !== undefined) {
      fields.push('alias = ?');
      values.push(partnerData.alias);
    }
    if (partnerData.type !== undefined) {
      fields.push('type = ?');
      values.push(partnerData.type);
    }
    if (partnerData.direction !== undefined) {
      fields.push('direction = ?');
      values.push(partnerData.direction);
    }
    if (partnerData.application !== undefined) {
      fields.push('application = ?');
      values.push(partnerData.application);
    }
    if (partnerData.processed_flow_type !== undefined) {
      fields.push('processed_flow_type = ?');
      values.push(partnerData.processed_flow_type);
    }
    if (partnerData.description !== undefined) {
      fields.push('description = ?');
      values.push(partnerData.description);
    }

    fields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    return new Promise((resolve, reject) => {
      const query = `UPDATE partners SET ${fields.join(', ')} WHERE id = ?`;
      db.run(query, values, function (err) {
        if (err) {
          logger.error(`Erreur lors de la mise à jour du partenaire ${id}:`, err.message);
          reject(err);
          return;
        }

        if (this.changes === 0) {
          resolve(null);
          return;
        }

        // Récupérer le partenaire mis à jour
        db.get('SELECT * FROM partners WHERE id = ?', [id], (err, partner) => {
          if (err) {
            logger.error(`Erreur lors de la récupération du partenaire mis à jour ${id}:`, err.message);
            reject(err);
            return;
          }
          logger.info(`Partenaire mis à jour avec succès: ${partner.alias}`);
          resolve(partner);
        });
      });
    });
  } catch (error) {
    logger.error(`Erreur dans le repository update pour l'ID ${id}:`, error.message);
    throw error;
  }
};

const remove = async (id) => {
  try {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM partners WHERE id = ?', [id], function (err) {
        if (err) {
          logger.error(`Erreur lors de la suppression du partenaire ${id}:`, err.message);
          reject(err);
          return;
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
  findAll,
  findById,
  findByAlias,
  create,
  update,
  remove
}; 