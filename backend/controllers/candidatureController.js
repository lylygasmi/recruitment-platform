const pool = require("../config/db");

// ✅ Postuler à une offre
exports.createCandidature = async (req, res) => {
  try {
    const { offer_id } = req.body;

    if (!req.user || req.user.role !== "candidat") {
      return res.status(403).json({ message: "Accès réservé aux candidats." });
    }

    // Vérifier si déjà postulé
    const [existing] = await pool.query(
      "SELECT * FROM candidatures WHERE candidate_id=? AND offer_id=?",
      [req.user.id, offer_id]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: "⚠️ Vous avez déjà postulé à cette offre." });
    }

    await pool.query(
      "INSERT INTO candidatures (candidate_id, offer_id, date_posted, status) VALUES (?, ?, NOW(), 'en_attente')",
      [req.user.id, offer_id]
    );

    res.status(201).json({ message: "✅ Candidature envoyée" });
  } catch (err) {
    console.error("❌ Erreur createCandidature:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// ✅ Voir mes candidatures (candidat)
exports.getMyCandidatures = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT c.id, j.title, j.location, j.contract_type, c.status, c.date_posted 
       FROM candidatures c
       JOIN job_offers j ON c.offer_id = j.id
       WHERE c.candidate_id=? ORDER BY c.date_posted DESC`,
      [req.user.id]
    );

    res.json(rows);
  } catch (err) {
    console.error("❌ Erreur getMyCandidatures:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// ✅ Voir candidatures reçues (employeur)
exports.getCandidaturesByOffer = async (req, res) => {
  try {
    const { offer_id } = req.params;

    const [rows] = await pool.query(
      `SELECT c.id, u.name, u.email, c.status, c.date_posted 
       FROM candidatures c
       JOIN users u ON c.candidate_id = u.id
       WHERE c.offer_id=?`,
      [offer_id]
    );

    res.json(rows);
  } catch (err) {
    console.error("❌ Erreur getCandidaturesByOffer:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// ✅ Accepter / Refuser candidature
exports.updateCandidatureStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // "acceptée" ou "refusée"

    if (!["acceptée", "refusée"].includes(status)) {
      return res.status(400).json({ message: "Statut invalide" });
    }

    await pool.query("UPDATE candidatures SET status=? WHERE id=?", [status, id]);

    res.json({ message: `✅ Candidature ${status}` });
  } catch (err) {
    console.error("❌ Erreur updateCandidatureStatus:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
