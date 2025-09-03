const db = require("../db"); // Assure-toi que ce fichier exporte bien la connexion MySQL

// Créer une offre
const createOffer = (req, res) => {
  const { title, description } = req.body;
  const employer_id = req.user.id;

  if (!title || !description) return res.status(400).json({ error: "Title et description sont obligatoires" });

  db.query(
    "INSERT INTO job_offers (title, description, employer_id) VALUES (?, ?, ?)",
    [title, description, employer_id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "✅ Offre créée", offerId: result.insertId });
    }
  );
};

// Voir toutes les offres
const getAllOffers = (req, res) => {
  db.query("SELECT * FROM job_offers", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

// Voir une offre spécifique
const getOfferById = (req, res) => {
  const id = req.params.id;
  db.query("SELECT * FROM job_offers WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0) return res.status(404).json({ error: "Offre non trouvée" });
    res.json(results[0]);
  });
};

// Mettre à jour une offre
const updateOffer = (req, res) => {
  const id = req.params.id;
  const { title, description } = req.body;

  db.query(
    "UPDATE job_offers SET title = ?, description = ? WHERE id = ?",
    [title, description, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "✅ Offre mise à jour" });
    }
  );
};

// Supprimer une offre
const deleteOffer = (req, res) => {
  const id = req.params.id;

  db.query("DELETE FROM job_offers WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "✅ Offre supprimée" });
  });
};

module.exports = {
  createOffer,
  getAllOffers,
  getOfferById,
  updateOffer,
  deleteOffer
};


