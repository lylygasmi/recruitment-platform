const pool = require("../config/db");

// ✅ Publier une offre
exports.createJobOffer = async (req, res) => {
  try {
    const { title, description, location, contract_type, salary } = req.body;

    if (!req.user || req.user.role !== "employeur") {
      return res.status(403).json({ message: "Accès refusé." });
    }

    const [result] = await pool.query(
      "INSERT INTO job_offers (employer_id, title, description, location, contract_type, salary, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())",
      [req.user.id, title, description, location, contract_type, salary]
    );

    res.status(201).json({ message: "✅ Offre publiée avec succès", id: result.insertId });
  } catch (err) {
    console.error("❌ Erreur createJobOffer:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// ✅ Voir toutes les offres
exports.getAllJobOffers = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM job_offers ORDER BY created_at DESC");
    res.json(rows);
  } catch (err) {
    console.error("❌ Erreur getAllJobOffers:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// ✅ Voir mes offres (employeur)
exports.getMyJobOffers = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM job_offers WHERE employer_id = ?", [req.user.id]);
    res.json(rows);
  } catch (err) {
    console.error("❌ Erreur getMyJobOffers:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// ✅ Modifier une offre
exports.updateJobOffer = async (req, res) => {
  try {
    const { title, description, location, contract_type, salary } = req.body;
    const offerId = req.params.id;

    await pool.query(
      "UPDATE job_offers SET title=?, description=?, location=?, contract_type=?, salary=?, updated_at=NOW() WHERE id=? AND employer_id=?",
      [title, description, location, contract_type, salary, offerId, req.user.id]
    );

    res.json({ message: "✅ Offre mise à jour" });
  } catch (err) {
    console.error("❌ Erreur updateJobOffer:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// ✅ Supprimer une offre
exports.deleteJobOffer = async (req, res) => {
  try {
    const offerId = req.params.id;
    await pool.query("DELETE FROM job_offers WHERE id=? AND employer_id=?", [offerId, req.user.id]);

    res.json({ message: "🗑️ Offre supprimée" });
  } catch (err) {
    console.error("❌ Erreur deleteJobOffer:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
