const jwt = require("jsonwebtoken");

// Middleware pour authentification JWT
function auth(req, res, next) {
  const token = req.header("Authorization"); // expects "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: "⛔ Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET || "secretKey123");
    req.user = decoded; // stocke les infos de l'utilisateur
    next();
  } catch (err) {
    res.status(400).json({ message: "❌ Invalid token." });
  }
}

// Middleware pour routes accessibles seulement aux employeurs
function employeurOnly(req, res, next) {
  if (!req.user) return res.status(401).json({ message: "⛔ Non authentifié" });
  if (req.user.role !== "employeur") return res.status(403).json({ message: "⛔ Accès réservé aux employeurs" });
  next();
}

module.exports = { auth, employeurOnly };

