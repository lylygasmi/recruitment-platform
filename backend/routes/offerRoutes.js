const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const { authenticateEmployer } = require("../middleware/auth");

// Publier une offre
router.post("/", authenticateEmployer, async (req, res) => {
  const { title, description, location, contract_type } = req.body;
  
  if (!title || !description || !location || !contract_type) {
    return res.status(400).json({ message: "❌ Tous les champs sont obligatoires" });
  }

  try {
    const employer_id = req.user.id; // <-- récupéré depuis le token
    const [result] = await pool.query(
      "INSERT INTO job_offers (title, description, location, contract_type, employer_id) VALUES (?, ?, ?, ?, ?)",
      [title, description, location, contract_type, employer_id]
    );

    res.status(201).json({ offerId: result.insertId, message: "✅ Offre publiée avec succès" });
  } catch (error) {
    console.error("Erreur SQL :", error);
    res.status(500).json({ message: "❌ Erreur serveur lors de la publication" });
  }
});

module.exports = router;
