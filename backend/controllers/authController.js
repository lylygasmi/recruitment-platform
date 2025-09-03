const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const SECRET = "mysecret";

exports.register = (req, res) => {
  const {
    nom,
    prenom,
    telephone,
    adresse,
    poste,
    experience,
    competences,
    formation,
    email,
    password,
    role,
  } = req.body;

  // Vérification des champs obligatoires
  if (!nom || !prenom || !email || !password || !role) {
    return res.status(400).json({ message: "❌ Tous les champs requis ne sont pas remplis" });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  // Fusion nom + prénom pour le champ "name"
  const name = `${prenom} ${nom}`;

  // Création de l'utilisateur
  User.create(
    {
      name,
      email,
      password: hashedPassword,
      role,
      telephone,
      adresse,
      poste,
      experience,
      competences,
      formation,
    },
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "✅ Utilisateur enregistré avec succès" });
    }
  );
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  User.findByEmail(email, (err, results) => {
    if (err || results.length === 0)
      return res.status(401).json({ error: "❌ Utilisateur introuvable" });

    const user = results[0];
    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: "❌ Mot de passe incorrect" });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, SECRET, { expiresIn: "1h" });
    res.json({ token, role: user.role });
  });
};
