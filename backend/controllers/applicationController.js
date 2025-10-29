const Application = require("../models/applicationModel");

// 🧠 Créer une candidature
exports.createApplication = async (req, res) => {
  try {
    const candidat_id = req.user?.id;
    const { offer_id } = req.body;
    const cv_path = req.file ? req.file.path : null;

    if (!candidat_id) return res.status(401).json({ message: "Candidat non authentifié" });
    if (!offer_id) return res.status(400).json({ message: "offer_id requis" });

    await Application.create({ candidat_id, offer_id, cv_path });
    res.status(201).json({ message: "Candidature envoyée avec succès" });
  } catch (err) {
    console.error("Erreur création candidature:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// 🔍 Récupérer les candidatures d’un candidat
exports.getMyApplications = async (req, res) => {
  try {
    const candidat_id = req.user?.id;
    const [rows] = await Application.getByCandidate(candidat_id);
    res.json(rows);
  } catch (err) {
    console.error("Erreur getMyApplications:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// ❌ Supprimer une candidature
exports.deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const candidat_id = req.user?.id;
    await Application.delete(id, candidat_id);
    res.json({ message: "Candidature supprimée avec succès" });
  } catch (err) {
    console.error("Erreur deleteApplication:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// 👩‍💼 Récupérer les candidatures d’un employeur
exports.getApplicationsByEmployer = async (req, res) => {
  try {
    const employer_id = req.user?.id;
    const [rows] = await Application.getByEmployer(employer_id);
    res.json(rows);
  } catch (err) {
    console.error("Erreur getApplicationsByEmployer:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// 📄 Récupérer les candidatures pour une offre donnée
exports.getApplicationsByOffer = async (req, res) => {
  try {
    const { job_offer_id } = req.params;
    const [rows] = await Application.getByOffer(job_offer_id);
    res.json(rows);
  } catch (err) {
    console.error("Erreur getApplicationsByOffer:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// 🔁 Mettre à jour le statut
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await Application.updateStatus(id, status);
    res.json({ message: "Statut mis à jour avec succès" });
  } catch (err) {
    console.error("Erreur updateApplicationStatus:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

