const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

// ==================== REGISTER ====================
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "❌ Tous les champs sont requis" });
  }

  try {
    const [existing] = await pool.execute("SELECT * FROM users WHERE email = ?", [email]);
    if (existing.length > 0) return res.status(400).json({ message: "❌ Utilisateur déjà enregistré" });

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.execute(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, role]
    );

    res.status(201).json({ message: "✅ Inscription réussie" });
  } catch (err) {
    console.error("Erreur REGISTER:", err);
    res.status(500).json({ message: "❌ Erreur serveur lors de l'inscription" });
  }
});

// ==================== LOGIN ====================
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) return res.status(400).json({ message: "❌ Email et mot de passe requis" });

  try {
    const [rows] = await pool.execute("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length === 0) return res.status(401).json({ message: "❌ Utilisateur non trouvé" });

    const user = rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ message: "❌ Mot de passe incorrect" });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || "secretKey123",
      { expiresIn: "1d" }
    );

    res.json({
      message: "✅ Connexion réussie",
      userId: user.id,
      role: user.role,
      token
    });
  } catch (err) {
    console.error("Erreur LOGIN:", err);
    res.status(500).json({ message: "❌ Erreur serveur lors de la connexion" });
  }
});

module.exports = router;
