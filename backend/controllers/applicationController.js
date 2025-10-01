const Application = require("../models/applicationModel");

// Postuler à une offre
exports.createApplication = async (req, res) => {
  try {
    const candidate_id = req.candidat?.id || req.user?.id;
    const offer_id = req.body.offer_id;

    if (!candidate_id) {
      return res.status(401).json({ message: "❌ Candidat non authentifié" });
    }
    if (!offer_id) {
      return res.status(400).json({ message: "❌ offer_id requis" });
    }

    await Application.create({ candidate_id, offer_id });
    return res.status(201).json({ message: "✅ Candidature envoyée avec succès" });
  } catch (err) {
    console.error("❌ Erreur création candidature :", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

// Voir mes candidatures envoyées (candidat)
exports.getMyApplications = async (req, res) => {
  try {
    const candidate_id = req.candidat?.id || req.user?.id;
    const [rows] = await Application.getByCandidate(candidate_id);
    res.json(rows);
  } catch (err) {
    console.error("❌ Erreur getMyApplications :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Voir les candidatures reçues pour une offre (employeur)
exports.getApplicationsByOffer = async (req, res) => {
  try {
    const { job_offer_id } = req.params;
    const [rows] = await Application.getByOffer(job_offer_id);
    res.json(rows);
  } catch (err) {
    console.error("❌ Erreur getApplicationsByOffer :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Mettre à jour statut d'une candidature
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await Application.updateStatus(id, status);
    res.json({ message: "✅ Statut mis à jour avec succès" });
  } catch (err) {
    console.error("❌ Erreur updateApplicationStatus :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
