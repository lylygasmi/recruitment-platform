const jwt = require("jsonwebtoken");
const SECRET = process.env.JWT_SECRET || "mysecret";

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: "Token manquant" });

  const token = authHeader.split(' ')[1];
  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch {
    res.status(403).json({ message: "Token invalide" });
  }
};

module.exports = authMiddleware;
