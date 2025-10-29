const db = require("../config/db"); // Assure-toi que c'est ta config MySQL

// Postuler à une offre
exports.postuler = async (req, res) => {
  try {
    const candidate_id = req.user.id; // id du candidat connecté
    const { offer_id, cv_path } = req.body;

    if (!offer_id) return res.status(400).json({ message: "❌ offer_id requis" });

    await db.query(
      "INSERT INTO candidatures (candidate_id, offer_id, date_posted, cv_path, status) VALUES (?, ?, NOW(), ?, ?)",
      [candidate_id, offer_id, cv_path || null, "En attente"]
    );

    res.status(201).json({ message: "✅ Candidature envoyée avec succès" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Voir mes candidatures (candidat)
exports.getMesCandidatures = async (req, res) => {
  try {
    const candidate_id = req.user.id;
    const [rows] = await db.query(
      "SELECT c.*, j.title, j.company FROM candidatures c JOIN job_offers j ON c.offer_id = j.id WHERE c.candidate_id = ?",
      [candidate_id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Voir les candidatures reçues pour mes offres (employeur)
exports.getCandidaturesReçues = async (req, res) => {
  try {
    const employer_id = req.user.id;

    // On récupère les offres de l'employeur
    const [offers] = await db.query(
      "SELECT id FROM job_offers WHERE employer_id = ?",
      [employer_id]
    );
    const offerIds = offers.map(o => o.id);
    if (offerIds.length === 0) return res.json([]);

    // On récupère les candidatures pour ces offres
    const [rows] = await db.query(
      `SELECT c.*, j.title, j.company, u.name as candidate_name, u.email as candidate_email 
       FROM candidatures c 
       JOIN job_offers j ON c.offer_id = j.id
       JOIN users u ON c.candidate_id = u.id
       WHERE c.offer_id IN (?)`,
      [offerIds]
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
