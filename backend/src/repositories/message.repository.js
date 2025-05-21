const db = require('../database/sqlite');
const logger = require('../services/logger/logger.service');

class MessageRepository {
  async create(messageData) {
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO messages (content, partner_id, created_at, updated_at) VALUES (?, ?, datetime("now"), datetime("now"))',
        [messageData.content, messageData.partner_id],
        function (err) {
          if (err) {
            logger.error('Erreur lors de la création du message:', err);
            return reject(err);
          }
          db.get('SELECT * FROM messages WHERE id = ?', [this.lastID], (err2, row) => {
            if (err2) {
              logger.error('Erreur lors de la récupération du message créé:', err2);
              return reject(err2);
            }
            resolve(row);
          });
        }
      );
    });
  }

  async findAll(query) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = query.search || '';
    const partner_id = query.partner_id || '';
    const sortBy = query.sortBy || 'created_at';
    const sortOrder = query.sortOrder && ['asc', 'desc'].includes(query.sortOrder.toLowerCase()) 
      ? query.sortOrder.toUpperCase() 
      : 'DESC';

    let whereClauses = [];
    let params = [];

    if (search) {
      whereClauses.push('content LIKE ?');
      params.push(`%${search}%`);
    }
    if (partner_id) {
      whereClauses.push('partner_id = ?');
      params.push(partner_id);
    }

    const where = whereClauses.length > 0 ? 'WHERE ' + whereClauses.join(' AND ') : '';
    
    const validSortColumns = ['id', 'content', 'partner_id', 'created_at', 'updated_at'];
    const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'created_at';

    return new Promise((resolve, reject) => {
      db.get(
        `SELECT COUNT(*) as total FROM messages ${where}`,
        params,
        (err, countResult) => {
          if (err) {
            logger.error('Erreur lors du comptage des messages:', err);
            return reject(err);
          }

          const total = countResult.total;
          const totalPages = Math.ceil(total / limit);

          const query = `
            SELECT * FROM messages 
            ${where} 
            ORDER BY ${sortColumn} ${sortOrder}
            LIMIT ? OFFSET ?
          `;

          logger.debug('Requête SQL:', { query, params: [...params, limit, offset] });

          db.all(
            query,
            [...params, limit, offset],
            (err, rows) => {
              if (err) {
                logger.error('Erreur lors de la récupération des messages:', err);
                return reject(err);
              }

              resolve({
                data: rows,
                pagination: {
                  total,
                  currentPage: page,
                  limit,
                  totalPages
                }
              });
            }
          );
        }
      );
    });
  }

  async findById(id) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM messages WHERE id = ?', [id], (err, row) => {
        if (err) {
          logger.error('Erreur lors de la récupération du message:', err);
          return reject(err);
        }
        resolve(row);
      });
    });
  }

  async update(id, messageData) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM messages WHERE id = ?', [id], (err, row) => {
        if (err) {
          logger.error('Erreur lors de la vérification du message:', err);
          return reject(err);
        }
        if (!row) {
          return resolve(null);
        }

        const newContent = messageData.content || row.content;
        const newPartnerId = messageData.partner_id || row.partner_id;

        db.run(
          'UPDATE messages SET content = ?, partner_id = ?, updated_at = datetime("now") WHERE id = ?',
          [newContent, newPartnerId, id],
          function (err2) {
            if (err2) {
              logger.error('Erreur lors de la mise à jour du message:', err2);
              return reject(err2);
            }
            db.get('SELECT * FROM messages WHERE id = ?', [id], (err3, updatedRow) => {
              if (err3) {
                logger.error('Erreur lors de la récupération du message mis à jour:', err3);
                return reject(err3);
              }
              resolve(updatedRow);
            });
          }
        );
      });
    });
  }

  async delete(id) {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM messages WHERE id = ?', [id], function (err) {
        if (err) {
          logger.error('Erreur lors de la suppression du message:', err);
          return reject(err);
        }
        resolve(this.changes > 0);
      });
    });
  }
}

module.exports = new MessageRepository(); 