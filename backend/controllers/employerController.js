// backend/controllers/employerController.js
const pool = require("../config/db");

// 🔹 Voir toutes les offres publiées par l'employeur avec nombre de candidatures
exports.getMyOffers = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "employeur") {
      return res.status(403).json({ message: "Accès refusé" });
    }

    const [rows] = await pool.query(
      `SELECT j.*, 
              COUNT(c.id) AS total_candidatures
       FROM job_offers j
       LEFT JOIN candidatures c ON c.offer_id = j.id
       WHERE j.employer_id = ?
       GROUP BY j.id
       ORDER BY j.created_at DESC`,
      [req.user.id]
    );

    // Convertir technologies en tableau
    const offers = rows.map(o => ({
      ...o,
      technologies: o.technologies ? o.technologies.split(",") : []
    }));

    res.json(offers);
  } catch (err) {
    console.error("Erreur getMyOffers:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// 🔹 Voir toutes les candidatures reçues pour les offres de l'employeur
exports.getReceivedCandidatures = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "employeur") {
      return res.status(403).json({ message: "Accès refusé" });
    }

    const [rows] = await pool.query(
      `SELECT c.id, c.candidate_id, c.offer_id, c.cv_filename, c.status, 
              j.title AS offer_title,
              ca.nom AS candidate_nom,
              ca.prenom AS candidate_prenom,
              ca.email AS candidate_email
       FROM candidatures c
       JOIN job_offers j ON c.offer_id = j.id
       JOIN candidates ca ON c.candidate_id = ca.id
       WHERE j.employer_id = ?
       ORDER BY c.created_at DESC`,
      [req.user.id]
    );

    res.json(rows);
  } catch (err) {
    console.error("Erreur getReceivedCandidatures:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
