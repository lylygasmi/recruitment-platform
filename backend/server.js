// server.js
const express = require("express");
const cors = require("cors");
const pool = require("./config/db"); // Chemin correct vers db.js

const offerRoutes = require("./routes/offerRoutes");
const authRoutes = require("./routes/authRoutes");

require("dotenv").config(); // Pour JWT_SECRET

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/offres", offerRoutes);
app.use("/api/auth", authRoutes);

// Test connexion MySQL
pool.getConnection((err, connection) => {
  if (err) console.error("❌ Erreur de connexion à MySQL :", err);
  else {
    console.log("✅ Connecté à la base MySQL");
    connection.release();
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`));
