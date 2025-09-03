const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const db = require("../config/db"); // connexion MySQL

// 📌 Récupérer toutes les offres de l'employeur connecté
router.get("/", auth.employeurOnly, (req, res) => {
  const employeurId = req.user.id;

  db.query(
    "SELECT id, title, description, created_at FROM offers WHERE employeur_id = ?",
    [employeurId],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json(results);
    }
  );
});

module.exports = router;
