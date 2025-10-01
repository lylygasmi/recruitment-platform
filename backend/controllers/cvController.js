const pool = require("../config/db");
const path = require("path");
const fs = require("fs");

// ✅ Upload CV
exports.uploadCV = async (req, res) => {
  try {
    if (!req.files || !req.files.file) {
      return res.status(400).json({ message: "❌ Aucun fichier envoyé" });
    }

    const file = req.files.file;
    const uploadPath = path.join(__dirname, "../uploads", file.name);

    file.mv(uploadPath, async (err) => {
      if (err) return res.status(500).json({ message: "❌ Erreur lors de l'upload" });

      await pool.query(
        "INSERT INTO cvs (candidat_id, title, description, file_path, uploaded_at) VALUES (?, ?, ?, ?, NOW())",
        [
          req.user.id,
          req.body.title || file.name,
          req.body.description || "",
          `/uploads/${file.name}`,
        ]
      );

      res.json({ message: "✅ CV uploadé avec succès" });
    });
  } catch (err) {
    console.error("❌ Erreur uploadCV:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// ✅ Voir mes CVs
exports.getMyCVs = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM cvs WHERE candidat_id = ?", [req.user.id]);
    res.json(rows);
  } catch (err) {
    console.error("❌ Erreur getMyCVs:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// ✅ Supprimer un CV
exports.deleteCV = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM cvs WHERE id=? AND candidat_id=?", [
      req.params.id,
      req.user.id,
    ]);

    if (rows.length === 0) return res.status(404).json({ message: "❌ CV introuvable" });

    const cv = rows[0];
    const filePath = path.join(__dirname, "..", cv.file_path);

    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await pool.query("DELETE FROM cvs WHERE id=?", [req.params.id]);

    res.json({ message: "✅ CV supprimé avec succès" });
  } catch (err) {
    console.error("❌ Erreur deleteCV:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
