// backend/routes/applicationRoutes.js
const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { auth, employeurOnly } = require("../middleware/auth");

// 🔹 Candidat : postuler à une offre
router.post("/postuler/:offerId", auth, async (req, res) => {
  const candidate_id = req.user.id;
  const offer_id = req.params.offerId;

  try {
    // Vérifie si la candidature existe déjà
    const [existing] = await db.promise().query(
      "SELECT * FROM candidatures WHERE candidate_id = ? AND offer_id = ?",
      [candidate_id, offer_id]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: "Vous avez déjà postulé à cette offre." });
    }

    // Ajoute la candidature
    await db.promise().query(
      "INSERT INTO candidatures (candidate_id, offer_id, date_posted) VALUES (?, ?, NOW())",
      [candidate_id, offer_id]
    );

    res.json({ message: "Candidature envoyée avec succès !" });
  } catch (err) {
    console.error("Erreur candidature :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// 🔹 Candidat : récupérer ses candidatures
router.get("/mes-candidatures", auth, async (req, res) => {
  const candidate_id = req.user.id;

  try {
    const [results] = await db.promise().query(`
      SELECT c.id, c.date_posted, o.title, o.description, o.location, o.contract_type
      FROM candidatures c
      JOIN job_offers o ON c.offer_id = o.id
      WHERE c.candidate_id = ?
    `, [candidate_id]);

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// 🔹 Employeur : récupérer les candidatures reçues pour ses offres
router.get("/reçues", auth, employeurOnly, async (req, res) => {
  const employer_id = req.user.id;

  try {
    const [results] = await db.promise().query(`
      SELECT c.id, c.date_posted, u.email AS candidate_email, o.title AS offer_title
      FROM candidatures c
      JOIN users u ON c.candidate_id = u.id
      JOIN job_offers o ON c.offer_id = o.id
      WHERE o.employer_id = ?
    `, [employer_id]);

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;

