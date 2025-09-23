const pool = require("../config/db");

// Publier une offre
exports.createOffer = async (req, res) => {
  try {
    const employer_id = req.user.id; // vient du token JWT
    const { title, description, location, contract_type } = req.body;

    if (!title || !description || !location || !contract_type) {
      return res.status(400).json({ error: "Tous les champs sont obligatoires" });
    }

    const [result] = await pool.query(
      "INSERT INTO job_offers (employer_id, title, description, location, contract_type, created_at) VALUES (?, ?, ?, ?, ?, NOW())",
      [employer_id, title, description, location, contract_type]
    );

    res.status(201).json({ 
      message: "✅ Offre publiée",
      offerId: result.insertId
    });
  } catch (err) {
    console.error("❌ Erreur SQL :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// Récupérer toutes les offres
exports.getAllOffers = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM job_offers ORDER BY created_at DESC");
    res.json(rows);
  } catch (err) {
    console.error("❌ Erreur SQL :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
