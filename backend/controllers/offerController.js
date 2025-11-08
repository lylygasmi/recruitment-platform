const JobOffer = require('../models/jobOfferModel');
const { Op } = require('sequelize');

// ✅ Publier une offre (employeur)
exports.createOffer = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'employer') {
      return res.status(403).json({ message: 'Non autorisé' });
    }

    const { title, description, location, contract_type, speciality, salary, currency, country, category, technologies } = req.body;

    const offer = await JobOffer.create({
      employer_id: req.user.id,
      title,
      description,
      location,
      contract_type,
      speciality,
      salary,
      currency,
      country,
      category,
      technologies,
      created_at: new Date(),
      updated_at: new Date()
    });

    res.status(201).json({ message: 'Offre publiée', offer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la publication', error: error.message });
  }
};

// ✅ Voir toutes les offres publiées (candidat)
exports.getAllOffers = async (req, res) => {
  try {
    const offers = await JobOffer.findAll();
    res.json({ offers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération', error: error.message });
  }
};

// ✅ Voir mes offres (employeur)
exports.getMyOffers = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'employer') {
      return res.status(403).json({ message: 'Non autorisé' });
    }

    const offers = await JobOffer.findAll({
      where: { employer_id: req.user.id }
    });

    res.json({ offers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération', error: error.message });
  }
};

// ✅ Mettre à jour une offre
exports.updateOffer = async (req, res) => {
  try {
    const { id } = req.params;

    const offer = await JobOffer.findByPk(id);
    if (!offer) return res.status(404).json({ message: 'Offre non trouvée' });
    if (offer.employer_id !== req.user.id) return res.status(403).json({ message: 'Non autorisé' });

    const updatedFields = req.body;
    Object.assign(offer, updatedFields, { updated_at: new Date() });

    await offer.save();
    res.json({ message: 'Offre mise à jour', offer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour', error: error.message });
  }
};

// ✅ Supprimer une offre
exports.deleteOffer = async (req, res) => {
  try {
    const { id } = req.params;

    const offer = await JobOffer.findByPk(id);
    if (!offer) return res.status(404).json({ message: 'Offre non trouvée' });
    if (offer.employer_id !== req.user.id) return res.status(403).json({ message: 'Non autorisé' });

    await offer.destroy();
    res.json({ message: 'Offre supprimée' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la suppression', error: error.message });
  }
};
