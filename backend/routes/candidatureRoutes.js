const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { auth, employeurOnly } = require("../middleware/auth");

// 🔹 Candidat : mes candidatures
router.get("/mes-candidatures", auth, (req, res) => {
  const candidate_id = req.user.id;

  const query = `
    SELECT c.id, c.date_posted, o.title, o.description, o.location, o.contract_type
    FROM candidatures c
    JOIN job_offers o ON c.offer_id = o.id
    WHERE c.candidate_id = ?
  `;

  db.query(query, [candidate_id], (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(results);
  });
});

// 🔹 Employeur : candidatures reçues pour mes offres
router.get("/reçues", auth, employeurOnly, (req, res) => {
  const employer_id = req.user.id;

  const query = `
    SELECT c.id, c.date_posted, u.email AS candidate_email, o.title AS offer_title
    FROM candidatures c
    JOIN users u ON c.candidate_id = u.id
    JOIN job_offers o ON c.offer_id = o.id
    WHERE o.employer_id = ?
  `;

  db.query(query, [employer_id], (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(results);
  });
});

// 🔹 Postuler à une offre
router.post("/postuler/:offerId", auth, (req, res) => {
  const candidate_id = req.user.id;
  const offerId = req.params.offerId;

  const query = `
    INSERT INTO candidatures (candidate_id, offer_id, date_posted)
    VALUES (?, ?, NOW())
  `;

  db.query(query, [candidate_id, offerId], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json({ message: "✅ Candidature envoyée avec succès" });
  });
});

module.exports = router;
