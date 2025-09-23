const Application = require("../models/applicationModel");

// Postuler à une offre (candidat)
const applyToOffer = async (req, res) => {
  try {
    const candidate_id = req.user.id;
    const { job_offer_id, cv_filename } = req.body; 
    const [result] = await Application.create({ candidate_id, job_offer_id, cv_filename });
    res.status(201).json({ message: "✅ Candidature envoyée", applicationId: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Voir toutes ses candidatures (candidat)
const getMyApplications = async (req, res) => {
  try {
    const candidate_id = req.user.id;
    const [rows] = await Application.getByCandidate(candidate_id);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Voir tous les candidats pour une offre (employeur)
const getApplicationsByOffer = async (req, res) => {
  try {
    const offer_id = req.params.offerId;
    const [rows] = await Application.getByOffer(offer_id);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Changer le statut d'une candidature (employeur)
const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body; 
    const validStatus = ["en_attente", "acceptée", "refusée"];
    if (!validStatus.includes(status)) return res.status(400).json({ message: "Statut invalide" });

    await Application.updateStatus(req.params.id, status);
    res.json({ message: `Statut mis à jour ✅ (${status})` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Supprimer sa candidature (candidat)
const deleteApplication = async (req, res) => {
  try {
    const candidate_id = req.user.id;
    await Application.delete(req.params.id, candidate_id);
    res.json({ message: "Candidature supprimée ✅" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Exporter toutes les fonctions correctement
module.exports = {
  applyToOffer,
  getMyApplications,
  getApplicationsByOffer,
  updateApplicationStatus,
  deleteApplication,
};
