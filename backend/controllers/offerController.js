const JobOffer = require("../models/jobOfferModel");

// Créer une offre (employeur)
exports.createOffer = async (req, res) => {
  try {
    const employer_id = req.user?.id;
    const { title, description, location, contract_type, specialite, salary } = req.body;
    if (!employer_id) return res.status(401).json({ message: "❌ Employeur non authentifié" });
    await JobOffer.create({ employer_id, title, description, location, contract_type, specialite, salary });
    res.status(201).json({ message: "✅ Offre créée avec succès" });
  } catch (err) {
    console.error("Erreur création offre :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Voir toutes les offres d’un employeur
exports.getEmployerOffers = async (req, res) => {
  try {
    const employer_id = req.user?.id;
    const [rows] = await JobOffer.getByEmployer(employer_id);
    res.json(rows);
  } catch (err) {
    console.error("Erreur getEmployerOffers :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Voir toutes les offres disponibles pour un candidat
exports.getAllOffers = async (req, res) => {
  try {
    const [rows] = await JobOffer.getAll();
    res.json(rows);
  } catch (err) {
    console.error("Erreur getAllOffers :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Mettre à jour une offre
exports.updateOffer = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    await JobOffer.update(id, data);
    res.json({ message: "✅ Offre mise à jour avec succès" });
  } catch (err) {
    console.error("Erreur updateOffer :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Supprimer une offre
exports.deleteOffer = async (req, res) => {
  try {
    const { id } = req.params;
    await JobOffer.delete(id);
    res.json({ message: "✅ Offre supprimée avec succès" });
  } catch (err) {
    console.error("Erreur deleteOffer :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Voir une offre par ID
exports.getOfferById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await JobOffer.getById(id);
    if (!rows.length) return res.status(404).json({ message: "Offre introuvable" });
    res.json(rows[0]);
  } catch (err) {
    console.error("Erreur getOfferById :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
