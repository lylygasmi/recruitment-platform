const Application = require('../models/applicationModel');
const JobOffer = require('../models/jobOfferModel');
const Candidate = require('../models/candidateModel');

// ✅ Postuler à une offre
exports.createApplication = async (req, res) => {
  try {
    const { offer_id, cv_path, required_skills } = req.body;

    if (!req.user || req.user.role !== 'candidat') {
      return res.status(403).json({ message: 'Accès refusé : uniquement pour les candidats' });
    }

    const application = await Application.create({
      candidate_id: req.user.id,
      offer_id,
      cv_path,
      required_skills
    });

    res.status(201).json({ message: 'Candidature envoyée avec succès', application });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la création de la candidature', error: error.message });
  }
};

// ✅ Récupérer toutes les candidatures envoyées par le candidat connecté
exports.getApplicationsByCandidate = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'candidat') {
      return res.status(403).json({ message: 'Accès refusé : uniquement pour les candidats' });
    }

    const applications = await Application.findAll({
      where: { candidate_id: req.user.id },
      include: [{ model: JobOffer }]
    });

    res.json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération des candidatures', error: error.message });
  }
};

// ✅ Récupérer toutes les candidatures reçues par les offres de l'employeur connecté
exports.getApplicationsByEmployer = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'employeur') {
      return res.status(403).json({ message: 'Accès refusé : uniquement pour les employeurs' });
    }

    const applications = await Application.findAll({
      include: [
        { model: JobOffer, where: { employer_id: req.user.id } },
        { model: Candidate }
      ]
    });

    res.json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération des candidatures', error: error.message });
  }
};

// ✅ Modifier le statut d'une candidature (acceptée / refusée)
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['en_attente', 'acceptée', 'refusée'].includes(status)) {
      return res.status(400).json({ message: 'Statut invalide' });
    }

    const application = await Application.findByPk(id);
    if (!application) return res.status(404).json({ message: 'Candidature non trouvée' });

    application.status = status;
    await application.save();

    res.json({ message: 'Statut de la candidature mis à jour', application });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du statut', error: error.message });
  }
};
