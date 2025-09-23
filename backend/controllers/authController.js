const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const SECRET = process.env.JWT_SECRET || "mysecret";

// Inscription
exports.register = (req, res) => {
  const { nom, prenom, email, password, role } = req.body;

  // Vérification des champs obligatoires
  if (!nom || !prenom || !email || !password || !role) {
    return res.status(400).json({ message: "❌ Tous les champs obligatoires ne sont pas remplis" });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const name = `${prenom} ${nom}`;

  // Création de l'utilisateur
  User.create({ name, email, password: hashedPassword, role }, (err) => {
    if (err) {
      // Vérifier si l'email existe déjà
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(400).json({ message: "❌ Email déjà utilisé" });
      }
      return res.status(500).json({ error: err });
    }
    res.status(201).json({ message: "✅ Utilisateur enregistré avec succès" });
  });
};

// Connexion
exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "❌ Email et mot de passe requis" });
  }

  User.findByEmail(email, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (!results || results.length === 0) {
      return res.status(401).json({ message: "❌ Utilisateur introuvable" });
    }

    const user = results[0];

    // Vérification du mot de passe
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "❌ Mot de passe incorrect" });
    }

    // Génération du token JWT
    const token = jwt.sign({ id: user.id, role: user.role }, SECRET, { expiresIn: "1h" });

    res.json({
      message: "✅ Connexion réussie",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  });
};
