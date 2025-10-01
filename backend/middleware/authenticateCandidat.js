const jwt = require("jsonwebtoken");
const pool = require("../config/db");

const SECRET = process.env.JWT_SECRET || "mysecret";

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({ message: "Accès refusé. Token manquant." });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token invalide." });
    }

    const decoded = jwt.verify(token, SECRET);

    if (decoded.role !== "candidat") {
      return res.status(403).json({ message: "Accès réservé aux candidats." });
    }

    const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [decoded.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Utilisateur introuvable." });
    }

    req.user = rows[0]; // ajoute l'utilisateur dans req.user
    next();
  } catch (err) {
    console.error("❌ Erreur authenticateCandidat:", err.message);
    return res.status(401).json({ message: "Token invalide ou expiré." });
  }
};
