const partnerService = require('../../services/partner/partner.service');
const { validateCreate, validateUpdate } = require('../../validators/partner.validator');
const logger = require('../../services/logger/logger.service');

/**
 * Récupère tous les partenaires.
 * @param {Object} req - La requête HTTP.
 * @param {Object} res - La réponse HTTP.
 */
const getPartners = async (req, res) => {
  try {
    const { page, limit, sortBy, sortOrder, ...filters } = req.query;
    const partners = await partnerService.getPartners(
      parseInt(page) || 1,
      parseInt(limit) || 10,
      sortBy,
      sortOrder,
      filters
    );
    logger.info('Récupération de tous les partenaires réussie');
    res.json(partners);
  } catch (error) {
    logger.error('Erreur lors de la récupération des partenaires:', error.message);
    res.status(500).json({ message: 'Erreur lors de la récupération des partenaires' });
  }
};

/**
 * Récupère un partenaire par son ID.
 * @param {Object} req - La requête HTTP.
 * @param {Object} res - La réponse HTTP.
 */
const getPartnerById = async (req, res) => {
  try {
    const partner = await partnerService.getPartnerById(req.params.id);

    if (!partner) {
      logger.warn(`Partenaire non trouvé avec l'ID: ${req.params.id}`);
      return res.status(404).json({ message: 'Partenaire non trouvé' });
    }

    logger.info(`Récupération du partenaire ${req.params.id} réussie`);
    res.json(partner);
  } catch (error) {
    logger.error(`Erreur lors de la récupération du partenaire ${req.params.id}:`, error.message);
    res.status(500).json({ message: 'Erreur lors de la récupération du partenaire' });
  }
};

/**
 * Crée un nouveau partenaire.
 * @param {Object} req - La requête HTTP.
 * @param {Object} res - La réponse HTTP.
 */
const createPartner = async (req, res) => {
  try {
    const validationResult = validateCreate(req.body);
    const partner = await partnerService.createPartner(validationResult);
    logger.info(`Création du partenaire ${partner.id} réussie`);
    res.status(201).json(partner);
  } catch (error) {
    logger.error('Erreur lors de la création du partenaire:', error.message);
    if (error.name === 'ZodError') {
      return res.status(400).json({ message: 'Données invalides', errors: error.errors });
    }
    res.status(500).json({ message: 'Erreur lors de la création du partenaire' });
  }
};

/**
 * Met à jour un partenaire.
 * @param {Object} req - La requête HTTP.
 * @param {Object} res - La réponse HTTP.
 */
const updatePartner = async (req, res) => {
  try {
    const validationResult = validateUpdate(req.body);
    const partner = await partnerService.updatePartner(req.params.id, validationResult);
    if (!partner) {
      logger.warn(`Partenaire non trouvé avec l'ID: ${req.params.id}`);
      return res.status(404).json({ message: 'Partenaire non trouvé' });
    }
    logger.info(`Mise à jour du partenaire ${req.params.id} réussie`);
    res.json(partner);
  } catch (error) {
    logger.error(`Erreur lors de la mise à jour du partenaire ${req.params.id}:`, error.message);
    if (error.name === 'ZodError') {
      return res.status(400).json({ message: 'Données invalides', errors: error.errors });
    }
    res.status(500).json({ message: 'Erreur lors de la mise à jour du partenaire' });
  }
};

/**
 * Supprime un partenaire.
 * @param {Object} req - La requête HTTP.
 * @param {Object} res - La réponse HTTP.
 */
const deletePartner = async (req, res) => {
  try {
    const success = await partnerService.deletePartner(req.params.id);
    if (!success) {
      logger.warn(`Partenaire non trouvé avec l'ID: ${req.params.id}`);
      return res.status(404).json({ message: 'Partenaire non trouvé' });
    }
    logger.info(`Suppression du partenaire ${req.params.id} réussie`);
    res.status(204).send();
  } catch (error) {
    logger.error(`Erreur lors de la suppression du partenaire ${req.params.id}:`, error.message);
    res.status(500).json({ message: 'Erreur lors de la suppression du partenaire' });
  }
};

const partnerController = {
  getPartners,
  getPartnerById,
  createPartner,
  updatePartner,
  deletePartner
};

module.exports = { partnerController }; 