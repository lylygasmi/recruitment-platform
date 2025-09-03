// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');

// Configuration MySQL
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'LYLY53706136...', // ⚠️ Mets ton mot de passe MySQL
  database: 'recruitment_platform'
});

// ==================== REGISTER ====================
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }

    // Vérifier si l'utilisateur existe déjà
    const [existing] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: '❌ Utilisateur déjà enregistré' });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insérer le nouvel utilisateur
    await pool.execute(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role]
    );

    res.json({ message: '✅ Inscription réussie' });
  } catch (error) {
    console.error('Erreur REGISTER:', error);
    res.status(500).json({ message: '❌ Erreur serveur lors de l\'inscription' });
  }
});

// ==================== LOGIN ====================
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe requis' });
    }

    const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ message: '❌ Utilisateur non trouvé' });
    }

    const user = rows[0];

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: '❌ Mot de passe incorrect' });
    }

    // Générer un token JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      'secretKey123', // ⚠️ Mets une clé secrète dans .env
      { expiresIn: '1d' }
    );

    res.json({
      message: '✅ Connexion réussie',
      userId: user.id,
      role: user.role,
      token
    });
  } catch (error) {
    console.error('Erreur LOGIN:', error);
    res.status(500).json({ message: '❌ Erreur serveur lors de la connexion' });
  }
});

module.exports = router;
