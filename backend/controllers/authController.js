const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");
const nodemailer = require("nodemailer");

const SECRET = process.env.JWT_SECRET || "mysecret";

// ------------------ Transporteur mail ------------------ //
const transporter = nodemailer.createTransport({
  service: "gmail", // ou autre SMTP
  auth: {
    user: process.env.EMAIL_USER, // ton email
    pass: process.env.EMAIL_PASS, // mot de passe ou app password
  },
});

// ------------------ Inscription ------------------ //
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "❌ Tous les champs obligatoires ne sont pas remplis" });
    }

    // Vérifier si email déjà utilisé
    const [existing] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: "❌ Email déjà utilisé" });
    }

    // Hasher le mot de passe
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Générer token de vérification
    const verificationToken = jwt.sign({ email }, SECRET, { expiresIn: "1d" });

    // Insérer utilisateur avec isVerified = false
    const [result] = await pool.query(
      "INSERT INTO users (name, email, password, role, isVerified, verificationToken) VALUES (?, ?, ?, ?, ?, ?)",
      [name, email, hashedPassword, role, false, verificationToken]
    );

    const verifyLink = `http://localhost:3000/confirm/${verificationToken}`;

    // Envoi du mail
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Vérification de votre compte",
      html: `
        <h2>Bienvenue ${name} 🎉</h2>
        <p>Merci de vous être inscrit sur notre plateforme.</p>
        <p>Cliquez sur le bouton ci-dessous pour activer votre compte :</p>
        <a href="${verifyLink}" 
           style="display:inline-block;
                  background:#00AEEF;
                  color:#fff;
                  padding:12px 20px;
                  border-radius:6px;
                  text-decoration:none;
                  font-weight:bold;"
        >Vérifier mon compte</a>
        <p>Ou copiez-collez ce lien dans votre navigateur :</p>
        <p>${verifyLink}</p>
      `,
    });

    res.status(201).json({
      message: "✅ Inscription réussie ! Vérifiez vos emails pour activer votre compte.",
    });
  } catch (err) {
    console.error("❌ Erreur register :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// ------------------ Confirmation Email ------------------ //
exports.confirmEmail = async (req, res) => {
  try {
    const { token } = req.params;

    let decoded;
    try {
      decoded = jwt.verify(token, SECRET);
    } catch (err) {
      return res.status(400).json({ message: "❌ Lien de vérification invalide ou expiré" });
    }

    const email = decoded.email;

    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "❌ Utilisateur introuvable" });
    }

    const user = rows[0];

    if (user.isVerified) {
      return res.json({ message: "✅ Compte déjà vérifié. Vous pouvez vous connecter." });
    }

    await pool.query("UPDATE users SET isVerified = ?, verificationToken = NULL WHERE email = ?", [true, email]);

    res.json({ message: "✅ Compte vérifié avec succès ! Vous pouvez maintenant vous connecter." });
  } catch (err) {
    console.error("❌ Erreur confirmEmail :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// ------------------ Connexion ------------------ //
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "❌ Email et mot de passe requis" });
    }

    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length === 0) {
      return res.status(401).json({ message: "❌ Utilisateur introuvable" });
    }

    const user = rows[0];

    if (!user.isVerified) {
      return res.status(403).json({ message: "⚠️ Compte non vérifié. Vérifiez vos emails." });
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "❌ Mot de passe incorrect" });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, SECRET, { expiresIn: "7d" });

    res.json({
      message: "✅ Connexion réussie",
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("❌ Erreur login :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
