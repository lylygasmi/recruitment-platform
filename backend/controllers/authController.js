const User = require("../models/userModel");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const { Op } = require("sequelize");

// ============================
// 📧 Nodemailer setup
// ============================
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ============================
// 📨 Email de vérification avec logo et bouton
// ============================
const sendVerificationEmail = async (userEmail, token) => {
  const verifyUrl = `${process.env.FRONTEND_URL}/verify-account/${token}`;

  await transporter.sendMail({
    from: '"HireMe" <hireme@example.com>',
    to: userEmail,
    subject: "✅ Vérifiez votre compte HireMe",
    html: `
      <div style="font-family: Arial, sans-serif; line-height:1.6; color:#333;">
        <!-- Logo en haut -->
        <div style="text-align:center; margin-bottom:20px;">
          <img src="cid:hiremeLogo" alt="HireMe Logo" width="120"/>
        </div>

        <h2 style="color:#1877F2;">Bienvenue sur HireMe !</h2>
        <p>Bonjour,</p>
        <p>Merci de vous être inscrit sur <strong>HireMe</strong>. Pour activer votre compte, cliquez sur le bouton ci-dessous :</p>

        <!-- Bouton vérifier mon compte -->
        <div style="text-align:center; margin:30px;">
          <a href="${verifyUrl}" 
             style="background-color:#1877F2; color:white; padding:15px 30px; text-decoration:none; border-radius:8px; font-weight:bold;">
            Vérifier mon compte
          </a>
        </div>

        <p style="font-size:12px; color:#666;">
          Si le bouton ne fonctionne pas, copiez-collez ce lien dans votre navigateur :<br/>
          <a href="${verifyUrl}" style="color:#1877F2;">${verifyUrl}</a>
        </p>

        <!-- Logo et copyright en bas -->
        <div style="text-align:center; margin-top:40px;">
          <img src="cid:hiremeLogo" alt="HireMe Logo" width="80"/>
          <p style="font-size:12px; color:#666;">© 2025 HireMe. Tous droits réservés.</p>
        </div>
      </div>
    `,
    attachments: [
      {
        filename: 'logo.png',
        path: __dirname + '/../logo.png', // chemin vers backend/logo.png
        cid: 'hiremeLogo', // identifiant utilisé dans le HTML
      },
    ],
  });
};

// ============================
// 📝 Inscription sécurisée
// ============================
const register = async (req, res) => {
  try {
    console.log("🚀 BODY reçu :", req.body);
    const { name, email, password, role, phone } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "Champs obligatoires manquants" });

    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      if (!existingUser.isVerified) {
        const verificationToken = crypto.randomBytes(32).toString("hex");
        existingUser.name = name;
        existingUser.role = role || existingUser.role;
        existingUser.phone = phone || existingUser.phone;
        existingUser.password = await bcrypt.hash(password, 10);
        existingUser.verificationToken = verificationToken;
        await existingUser.save();
        console.log("📌 Compte existant non vérifié mis à jour");

        await sendVerificationEmail(email, verificationToken);

        return res.status(200).json({
          message: "Compte existant non vérifié. Email de vérification renvoyé !",
        });
      } else {
        return res.status(400).json({ message: "Email déjà utilisé" });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "candidat",
      phone: phone || null,
      verificationToken,
      isVerified: false,
    });

    console.log("✅ Nouvel utilisateur créé :", newUser.email);

    await sendVerificationEmail(email, verificationToken);

    res.status(201).json({ message: "Inscription réussie ! Vérifiez votre email." });
  } catch (err) {
    console.error("🔥 ERREUR REGISTER :", err);
    res.status(500).json({ message: "Erreur serveur: " + err.message });
  }
};

// ============================
// ✅ Vérification email
// ============================
const verifyAccount = async (req, res) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({ where: { verificationToken: token } });
    if (!user) return res.status(400).json({ message: "Token invalide ou expiré" });

    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    res.redirect(`${process.env.FRONTEND_URL}/login?verified=true`);
  } catch (err) {
    console.error("🔥 ERREUR VERIFY :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// ============================
// 🔑 Login
// ============================
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: "Email ou mot de passe incorrect" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Email ou mot de passe incorrect" });

    if (!user.isVerified) return res.status(403).json({ message: "Compte non vérifié" });

    res.status(200).json({ message: "Connexion réussie", user });
  } catch (err) {
    console.error("🔥 ERREUR LOGIN :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// ============================
// 🔒 Mot de passe oublié
// ============================
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: "Email inconnu" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600 * 1000);

    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    console.log("🔑 Reset link (test) :", resetUrl);

    res.status(200).json({ message: "Email de réinitialisation envoyé" });
  } catch (err) {
    console.error("🔥 ERREUR FORGOT PASSWORD :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// ============================
// 🔑 Reset password
// ============================
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const user = await User.findOne({
      where: {
        resetToken: token,
        resetTokenExpiry: { [Op.gt]: new Date() },
      },
    });
    if (!user) return res.status(400).json({ message: "Token invalide ou expiré" });

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await user.save();

    res.status(200).json({ message: "Mot de passe réinitialisé avec succès" });
  } catch (err) {
    console.error("🔥 ERREUR RESET PASSWORD :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// ============================
// 📱 OTP téléphone
// ============================
const sendOTP = async (req, res) => {
  try {
    const { phone } = req.body;
    const user = await User.findOne({ where: { phone } });
    if (!user) return res.status(400).json({ message: "Numéro de téléphone inconnu" });

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    user.otpCode = otpCode;
    user.otpExpiry = otpExpiry;
    await user.save();

    console.log(`OTP pour ${phone} : ${otpCode}`);
    res.status(200).json({ message: "OTP envoyé" });
  } catch (err) {
    console.error("🔥 ERREUR SEND OTP :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { phone, otpCode } = req.body;
    const user = await User.findOne({ where: { phone } });
    if (!user) return res.status(400).json({ message: "Numéro de téléphone inconnu" });

    if (!user.otpCode || user.otpExpiry < new Date() || user.otpCode !== otpCode) {
      return res.status(400).json({ message: "OTP invalide ou expiré" });
    }

    user.otpCode = null;
    user.otpExpiry = null;
    await user.save();

    res.status(200).json({ message: "Téléphone vérifié avec succès" });
  } catch (err) {
    console.error("🔥 ERREUR VERIFY OTP :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// ============================
// ✅ Exports
// ============================
module.exports = {
  register,
  login,
  verifyAccount,
  forgotPassword,
  resetPassword,
  sendOTP,
  verifyOTP,
};
