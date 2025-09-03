const express = require("express");
const router = express.Router();
const mysql = require("mysql2/promise");

// Connexion MySQL
const pool = mysql.createPool({
host: 'localhost',
  user: 'root',
  password: 'LYLY53706136...', // attention à garder ce mot de passe privé
  database: 'recruitment_platform',
});

// GET : toutes les offres
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM job_offers");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// POST : créer une offre
router.post("/", async (req, res) => {
  const { title, description, company } = req.body;
  try {
    await pool.execute(
      "INSERT INTO job_offers (title, description, company) VALUES (?, ?, ?)",
      [title, description, company]
    );
    res.json({ message: "Offre créée ✅" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// DELETE : supprimer une offre
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.execute("DELETE FROM job_offers WHERE id = ?", [id]);
    res.json({ message: "Offre supprimée ✅" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;










