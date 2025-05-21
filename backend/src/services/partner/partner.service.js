const partnerRepository = require('../../repositories/partner.repository');
const logger = require('../../services/logger/logger.service');

// Récupérer tous les partenaires avec pagination, tri et filtrage
const getPartners = async (page = 1, limit = 10, sortBy = 'alias', sortOrder = 'ASC', filters = {}) => {
  try {
    return await partnerRepository.findAll(page, limit, sortBy, sortOrder, filters);
  } catch (error) {
    logger.error('Erreur dans le service getPartners:', error.message);
    throw error;
  }
};

// Récupérer un partenaire par son ID
const getPartnerById = async (id) => {
  try {
    return await partnerRepository.findById(id);
  } catch (error) {
    logger.error(`Erreur dans le service getPartnerById pour l'ID ${id}:`, error.message);
    throw error;
  }
};

const createPartner = async (partnerData) => {
  try {
    // Validation des champs obligatoires
    if (!partnerData.alias) {
      throw new Error('L\'alias est obligatoire');
    }
    if (!partnerData.type) {
      throw new Error('Le type est obligatoire');
    }
    if (!partnerData.direction) {
      throw new Error('La direction est obligatoire');
    }

    // Vérifier si un partenaire avec le même alias existe déjà
    const existingPartner = await partnerRepository.findByAlias(partnerData.alias);
    if (existingPartner) {
      throw new Error('Un partenaire avec cet alias existe déjà');
    }

    return await partnerRepository.create(partnerData);
  } catch (error) {
    logger.error('Erreur dans le service createPartner:', error.message);
    throw error;
  }
};

const updatePartner = async (id, partnerData) => {
  try {
    // Vérifier si le partenaire existe
    const existingPartner = await partnerRepository.findById(id);
    if (!existingPartner) {
      throw new Error('Partenaire non trouvé');
    }

    return await partnerRepository.update(id, partnerData);
  } catch (error) {
    logger.error(`Erreur dans le service updatePartner pour l'ID ${id}:`, error.message);
    throw error;
  }
};

const deletePartner = async (id) => {
  try {
    // Vérifier si le partenaire existe
    const existingPartner = await partnerRepository.findById(id);
    if (!existingPartner) {
      throw new Error('Partenaire non trouvé');
    }

    return await partnerRepository.remove(id);
  } catch (error) {
    logger.error(`Erreur dans le service deletePartner pour l'ID ${id}:`, error.message);
    throw error;
  }
};

module.exports = {
  getPartners,
  getPartnerById,
  createPartner,
  updatePartner,
  deletePartner
}; 