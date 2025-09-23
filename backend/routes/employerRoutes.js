const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const { auth, employeurOnly } = require("../middleware/auth");

// Récupérer les offres publiées par cet employeur
router.get("/mes-offres", auth, employeurOnly, async (req, res) => {
  try {
    const employer_id = req.user.id;
    const [rows] = await pool.query(
      "SELECT * FROM job_offers WHERE employer_id = ? ORDER BY created_at DESC",
      [employer_id]
    );
    res.json(rows);
  } catch (error) {
    console.error("❌ Erreur MySQL :", error);
    res.status(500).json({ message: "❌ Erreur serveur" });
  }
});

// Supprimer une offre (optionnel)
router.delete("/offre/:id", auth, employeurOnly, async (req, res) => {
  try {
    const employer_id = req.user.id;
    const offer_id = req.params.id;

    const [result] = await pool.query(
      "DELETE FROM job_offers WHERE id = ? AND employer_id = ?",
      [offer_id, employer_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "⚠ Offre non trouvée ou non autorisée" });
    }

    res.json({ message: "✅ Offre supprimée avec succès" });
  } catch (error) {
    console.error("❌ Erreur MySQL :", error);
    res.status(500).json({ message: "❌ Erreur serveur" });
  }
});

module.exports = router;
