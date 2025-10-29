const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../models/userModel");
require("dotenv").config();

// Transporter facultatif pour emails
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

// INSCRIPTION
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const [existingUser] = await User.findByEmail(email);
    if (existingUser.length > 0) return res.status(400).json({ message: "Email déjà utilisé." });

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");
    await User.create({ name, email, password: hashedPassword, role, verificationToken });

    res.status(201).json({ message: "Utilisateur créé. Vérifiez votre email !" });
  } catch (error) {
    console.error("❌ Erreur register :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// CONFIRMATION EMAIL
exports.confirmEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const [user] = await User.findByToken(token);
    if (!user || user.length === 0) return res.status(400).json({ message: "Token invalide." });

    await User.verifyUser(user[0].id);
    res.status(200).json({ message: "Compte vérifié avec succès !" });
  } catch (error) {
    console.error("❌ Erreur confirmEmail :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// CONNEXION
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const [rows] = await User.findByEmail(email);
    if (rows.length === 0) return res.status(404).json({ message: "Utilisateur introuvable." });

    const user = rows[0];
    if (!user.isVerified) return res.status(403).json({ message: "Veuillez vérifier votre email." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Mot de passe incorrect." });

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: "2h" });
    res.json({ message: "Connexion réussie", token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.error("❌ Erreur login :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// MOT DE PASSE OUBLIÉ
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const [userResult] = await User.findByEmail(email);
    if (userResult.length === 0) return res.status(404).json({ message: "Utilisateur introuvable." });

    const user = userResult[0];
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetExpiry = new Date(Date.now() + 3600000); // 1h

    await User.setResetToken(email, resetToken, resetExpiry);
    res.json({ message: "Email de réinitialisation envoyé !" });
  } catch (error) {
    console.error("❌ Erreur forgotPassword :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// RÉINITIALISER LE MOT DE PASSE
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const [userResult] = await User.findByResetToken(token);
    if (userResult.length === 0) return res.status(400).json({ message: "Lien invalide ou expiré." });

    const user = userResult[0];
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.resetPassword(user.id, hashedPassword);

    res.json({ message: "Mot de passe réinitialisé avec succès !" });
  } catch (error) {
    console.error("❌ Erreur resetPassword :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
