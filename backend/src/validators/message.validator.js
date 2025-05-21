/**
 * Valide les données pour la création d'un message.
 * @param {Object} data - Les données du message à valider.
 * @throws {Error} Si un champ requis est manquant.
 */
function validateCreate(data) {
  const { partner_id, content } = data;
  if (!partner_id || !content) {
    throw new Error('Le contenu et le partenaire sont requis');
  }
}

/**
 * Valide les données pour la mise à jour d'un message.
 * @param {Object} updates - Les mises à jour à valider.
 * @throws {Error} Si aucun champ n'est fourni ou si un champ invalide est présent.
 */
function validateUpdate(updates) {
  if (Object.keys(updates).length === 0) {
    throw new Error('Au moins un champ doit être fourni pour la mise à jour');
  }
  const validFields = ['partner_id', 'content'];
  const invalidFields = Object.keys(updates).filter(field => !validFields.includes(field));
  if (invalidFields.length > 0) {
    throw new Error(`Champs invalides: ${invalidFields.join(', ')}`);
  }
}

/**
 * Valide le statut d'un message.
 * @param {string} status - Le statut à valider.
 * @throws {Error} Si le statut est manquant.
 */
function validateStatus(status) {
  if (!status) {
    throw new Error('Le statut est requis');
  }
}

const validateCreateMessage = (data) => {
  const errors = [];

  if (!data.content) {
    errors.push('Le contenu du message est requis');
  } else if (typeof data.content !== 'string') {
    errors.push('Le contenu doit être une chaîne de caractères');
  }

  if (!data.partner_id) {
    errors.push('L\'identifiant du partenaire est requis');
  } else if (isNaN(parseInt(data.partner_id))) {
    errors.push('L\'identifiant du partenaire doit être un nombre');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

const validateGetMessages = (query) => {
  const errors = [];

  if (query.page && isNaN(parseInt(query.page))) {
    errors.push('Le numéro de page doit être un nombre');
  }

  if (query.limit && isNaN(parseInt(query.limit))) {
    errors.push('La limite doit être un nombre');
  }

  if (query.partner_id && isNaN(parseInt(query.partner_id))) {
    errors.push('L\'identifiant du partenaire doit être un nombre');
  }

  const validSortColumns = ['id', 'content', 'partner_id', 'created_at', 'updated_at'];
  if (query.sortBy && !validSortColumns.includes(query.sortBy)) {
    errors.push('Le champ de tri n\'est pas valide');
  }

  if (query.sortOrder && !['asc', 'desc'].includes(query.sortOrder.toLowerCase())) {
    errors.push('L\'ordre de tri doit être "asc" ou "desc"');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

const validateGetMessageById = (params) => {
  const errors = [];

  if (!params.id) {
    errors.push('L\'identifiant du message est requis');
  } else if (isNaN(parseInt(params.id))) {
    errors.push('L\'identifiant du message doit être un nombre');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

const validateUpdateMessage = (data) => {
  const errors = [];

  if (!data.id) {
    errors.push('L\'identifiant du message est requis');
  } else if (isNaN(parseInt(data.id))) {
    errors.push('L\'identifiant du message doit être un nombre');
  }

  if (data.content && typeof data.content !== 'string') {
    errors.push('Le contenu doit être une chaîne de caractères');
  }

  if (data.partner_id && isNaN(parseInt(data.partner_id))) {
    errors.push('L\'identifiant du partenaire doit être un nombre');
  }

  if (!data.content && !data.partner_id) {
    errors.push('Au moins un champ à mettre à jour est requis');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

const validateDeleteMessage = (params) => {
  const errors = [];

  if (!params.id) {
    errors.push('L\'identifiant du message est requis');
  } else if (isNaN(parseInt(params.id))) {
    errors.push('L\'identifiant du message doit être un nombre');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

const messageValidator = {
  validateCreateMessage,
  validateGetMessages,
  validateGetMessageById,
  validateUpdateMessage,
  validateDeleteMessage
};

module.exports = { messageValidator }; 