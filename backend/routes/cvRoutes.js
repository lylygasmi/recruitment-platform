const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const db = require("../config/db");

// Configuration Multer pour uploader les CVs
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // dossier pour stocker les CVs
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // nom unique
  },
});
const upload = multer({ storage: storage });

// POST : uploader un CV
router.post("/", upload.single("cv"), async (req, res) => {
  try {
    const candidate_id = req.user.id; // ID du candidat connecté
    const { filename, path: filepath } = req.file;

    const [result] = await db.promise().execute(
      "INSERT INTO cvs (candidate_id, filename, filepath) VALUES (?, ?, ?)",
      [candidate_id, filename, filepath]
    );

    res.status(201).json({ message: "CV uploadé ✅", cv: { id: result.insertId, filename } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// GET : récupérer tous les CVs du candidat
router.get("/", async (req, res) => {
  try {
    const candidate_id = req.user.id;
    const [rows] = await db.promise().execute("SELECT * FROM cvs WHERE candidate_id = ?", [candidate_id]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// GET : télécharger un CV spécifique
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await db.promise().execute("SELECT * FROM cvs WHERE id = ?", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: "CV introuvable" });
    res.download(rows[0].filepath, rows[0].filename);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// DELETE : supprimer un CV
router.delete("/:id", async (req, res) => {
  try {
    const [result] = await db.promise().execute("DELETE FROM cvs WHERE id = ? AND candidate_id = ?", [
      req.params.id,
      req.user.id,
    ]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "CV introuvable ou action non autorisée" });
    res.json({ message: "CV supprimé ✅" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
