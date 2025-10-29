const jwt = require("jsonwebtoken");
const pool = require("../config/db");

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) 
      return res.status(401).json({ message: "Token manquant" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "mysecret");

    const [rows] = await pool.query("SELECT * FROM users WHERE id=?", [decoded.id]);
    if (!rows[0]) return res.status(401).json({ message: "Utilisateur introuvable" });
    if (rows[0].role !== "candidat") return res.status(403).json({ message: "Accès réservé aux candidats" });

    req.user = rows[0];
    next();
  } catch (err) {
    console.error("Erreur authenticateCandidat:", err.message);
    res.status(401).json({ message: "Token invalide" });
  }
};
