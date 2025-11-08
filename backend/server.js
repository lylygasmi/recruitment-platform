const express = require('express');
const cors = require('cors');
require('dotenv').config();
const sequelize = require('./config/db'); // ta config Sequelize
const authRoutes = require('./routes/authRoutes'); // ton fichier authRoutes.js

const app = express(); 
const PORT = process.env.PORT || 5000; 

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔹 Middleware pour logger toutes les requêtes
app.use((req, res, next) => {
  console.log(`📌 Requête reçue : ${req.method} ${req.url}`);
  console.log('Body :', req.body);
  next();
});

// Routes
app.use('/api/auth', authRoutes); // toutes les routes auth auront le préfixe /api/auth

// Route test
app.get('/', (req, res) => {
  res.send('Backend fonctionne correctement !');
});

// 404 pour les routes non trouvées
app.use((req, res) => {
  res.status(404).json({ message: 'Route non trouvée' });
});

// Synchronisation Sequelize et démarrage serveur
sequelize
  .sync({ alter: true })
  .then(() => {
    console.log('✅ Tables synchronisées avec la base de données');
    app.listen(PORT, () => {
      console.log(`✅ Serveur démarré sur le port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ Erreur lors de la synchronisation Sequelize :', error);
  });
