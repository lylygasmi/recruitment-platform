const jwt = require("jsonwebtoken");

// Middleware pour vérifier que c'est un employeur
function authenticateEmployer(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ message: "❌ Token manquant" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "❌ Token invalide" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretKey123");

    if (decoded.role !== "employeur") {
      return res.status(403).json({ message: "❌ Accès refusé : employeur requis" });
    }

    req.user = decoded; // { id: X, role: "employeur" }
    next();
  } catch (error) {
    return res.status(401).json({ message: "❌ Token invalide ou expiré" });
  }
}

module.exports = { authenticateEmployer };
